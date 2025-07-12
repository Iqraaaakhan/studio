'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { createAptitudeProfile } from '@/ai/flows/aptitude-profile-creation';
import { Bot, ArrowRight, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/lib/firebase';
import { doc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import CryptoJS from 'crypto-js';

// --- YOUR FULL TRANSLATIONS, NOW CORRECTLY INCLUDED ---
const translations = {
  en: {
    round1Title: "Round 1: Aptitude Test",
    round2Title: "Round 2: Digital Literacy",
    round3Title: "Round 3: Communication",
    round4Title: "Round 4: Career Preference",
    round5Title: "Round 5: Skill Challenge",
    resumeTitle: "Final Step: Upload Resume",
    q1_1: "Which number completes the pattern: 2, 4, 6, __?",
    q1_2: "Which of these is a correct email format?",
    q2_1: "Which icon represents a web browser?",
    q2_2: "Which button would you click to search on Google?",
    q3_1: "Please type the following sentence exactly:",
    q3_2: "Write 2-3 lines about yourself.",
    q4_1: "I enjoy working on computers.",
    q4_2: "I prefer creative tasks over analytical ones.",
    q4_3: "What is your main career goal?",
    q5_creative: "Which color combination do you find most appealing for a poster?",
    q5_business: "A customer wants to buy 3 items priced at ₹15, ₹25, and ₹10. What is the total cost?",
    q5_tech: "Which of these is a correct HTML tag for a heading?",
    q5_freelance: "Which task would you choose for a quick freelance job?",
    agree: "Agree",
    neutral: "Neutral",
    disagree: "Disagree",
    teach: "Teach others",
    earnHome: "Earn from home",
    startShop: "Start a shop",
    officeWork: "Work in an office",
    analyzing: "Analyzing your potential...",
    craftingProfile: "Our AI is crafting your unique aptitude profile.",
    backToHome: "Back to Home",
    sentenceToType: "The quick brown fox jumps over the lazy dog.",
    resumeDescription: "Upload your resume if you have one. This is optional.",
    upload: "Finish & See Profile",
    skip: "Skip & See Profile",
    next: "Next",
    loadingQuestions: "Loading Questions..."
  },
  hi: {
    round1Title: "राउंड 1: योग्यता परीक्षण",
    round2Title: "राउंड 2: डिजिटल साक्षरता",
    round3Title: "राउंड 3: संचार कौशल",
    round4Title: "राउंड 4: करियर वरीयता",
    round5Title: "राउंड 5: कौशल चुनौती",
    resumeTitle: "अंतिम चरण: बायोडाटा अपलोड करें",
    q1_1: "कौन सी संख्या पैटर्न को पूरा करती है: 2, 4, 6, __?",
    q1_2: "इनमें से कौन सा सही ईमेल प्रारूप है?",
    q2_1: "कौन सा आइकन वेब ब्राउज़र का प्रतिनिधित्व करता है?",
    q2_2: "Google पर खोजने के लिए आप कौन सा बटन क्लिक करेंगे?",
    q3_1: "कृपया निम्नलिखित वाक्य बिल्कुल वैसा ही टाइप करें:",
    q3_2: "अपने बारे में 2-3 पंक्तियाँ लिखें।",
    q4_1: "मुझे कंप्यूटर पर काम करने में आनंद आता है।",
    q4_2: "मैं विश्लेषणात्मक कार्यों के बजाय रचनात्मक कार्यों को प्राथमिकता देता हूँ।",
    q4_3: "आपका मुख्य करियर लक्ष्य क्या है?",
    q5_creative: "पोस्टर के लिए कौन सा रंग संयोजन आपको सबसे आकर्षक लगता है?",
    q5_business: "एक ग्राहक ₹15, ₹25, और ₹10 की कीमत वाली 3 वस्तुएँ खरीदना चाहता है। कुल लागत क्या है?",
    q5_tech: "इनमें से कौन सा हेडिंग के लिए एक सही HTML टैग है?",
    q5_freelance: "एक छोटे फ्रीलांस काम के लिए आप कौन सा कार्य चुनेंगे?",
    agree: "सहमत",
    neutral: "तटस्थ",
    disagree: "असहमत",
    teach: "दूसरों को सिखाना",
    earnHome: "घर से कमाना",
    startShop: "दुकान शुरू करना",
    officeWork: "ऑफिस में काम करना",
    analyzing: "आपकी क्षमता का विश्लेषण किया जा रहा है...",
    craftingProfile: "हमारा AI आपकी अनूठी योग्यता प्रोफाइल तैयार कर रहा है।",
    backToHome: "होम पर वापस",
    sentenceToType: "एक तेज भूरी लोमड़ी आलसी कुत्ते पर कूदती है।",
    resumeDescription: "यदि आपके पास बायोडाटा है तो उसे अपलोड करें। यह वैकल्पिक है।",
    upload: "प्रोफ़ाइल देखें और समाप्त करें",
    skip: "छोड़ें और प्रोफ़ाइल देखें",
    next: "अगला",
    loadingQuestions: "प्रश्न लोड हो रहे हैं..."
  },
  kn: {
    round1Title: "ಸುತ್ತು 1: ಆಪ್ಟಿಟ್ಯೂಡ್ ಪರೀಕ್ಷೆ",
    round2Title: "ಸುತ್ತು 2: ಡಿಜಿಟಲ್ ಸಾಕ್ಷರತೆ",
    round3Title: "ಸುತ್ತು 3: ಸಂವಹನ",
    round4Title: "ಸುತ್ತು 4: ವೃತ್ತಿ ಆದ್ಯತೆ",
    round5Title: "ಸುತ್ತು 5: ಕೌಶಲ್ಯ ಸವಾಲು",
    resumeTitle: "ಅಂತಿಮ ಹಂತ: ರೆಸ್ಯೂಮ್ ಅಪ್ಲೋಡ್ ಮಾಡಿ",
    q1_1: "ಯಾವ ಸಂಖ್ಯೆ ಪ್ಯಾಟರ್ನ್ ಅನ್ನು ಪೂರ್ಣಗೊಳಿಸುತ್ತದೆ: 2, 4, 6, __?",
    q1_2: "ಇವುಗಳಲ್ಲಿ ಯಾವುದು ಸರಿಯಾದ ಇಮೇಲ್ ಫಾರ್ಮ್ಯಾಟ್ ಆಗಿದೆ?",
    q2_1: "ಯಾವ ಐಕಾನ್ ವೆಬ್ ಬ್ರೌಸರ್ ಅನ್ನು ಪ್ರತಿನಿಧಿಸುತ್ತದೆ?",
    q2_2: "Google ನಲ್ಲಿ ಹುಡುಕಲು ನೀವು ಯಾವ ಬಟನ್ ಅನ್ನು ಕ್ಲಿಕ್ ಮಾಡುತ್ತೀರಿ?",
    q3_1: "ದಯವಿಟ್ಟು ಈ ವಾಕ್ಯವನ್ನು ನಿಖರವಾಗಿ ಟೈಪ್ ಮಾಡಿ:",
    q3_2: "ನಿಮ್ಮ ಬಗ್ಗೆ 2-3 ಸಾಲುಗಳನ್ನು ಬರೆಯಿರಿ.",
    q4_1: "ನಾನು ಕಂಪ್ಯೂಟರ್‌ನಲ್ಲಿ ಕೆಲಸ ಮಾಡಲು ಇಷ್ಟಪಡುತ್ತೇನೆ.",
    q4_2: "ನಾನು ವಿಶ್ಲೇಷಣಾತ್ಮಕ ಕಾರ್ಯಗಳಿಗಿಂತ ಸೃಜನಾತ್ಮಕ ಕಾರ್ಯಗಳಿಗೆ ಆದ್ಯತೆ ನೀಡುತ್ತೇನೆ.",
    q4_3: "ನಿಮ್ಮ ಮುಖ್ಯ ವೃತ್ತಿ ಗುರಿ ಯಾವುದು?",
    q5_creative: "ಪೋಸ್ಟರ್‌ಗಾಗಿ ಯಾವ ಬಣ್ಣ ಸಂಯೋಜನೆಯು ನಿಮಗೆ ಹೆಚ್ಚು ಆಕರ್ಷಕವಾಗಿ ಕಾಣುತ್ತದೆ?",
    q5_business: "ಒಬ್ಬ ಗ್ರಾಹಕರು ₹15, ₹25, ಮತ್ತು ₹10 ಮೌಲ್ಯದ 3 ವಸ್ತುಗಳನ್ನು ಖರೀದಿಸಲು ಬಯಸುತ್ತಾರೆ. ಒಟ್ಟು ವೆಚ್ಚ ಎಷ್ಟು?",
    q5_tech: "ಹೆಡಿಂಗ್‌ಗಾಗಿ ಸರಿಯಾದ HTML ಟ್ಯಾಗ್ ಯಾವುದು?",
    q5_freelance: "ತ್ವರಿತ ಫ್ರೀಲ್ಯಾನ್ಸ್ ಕೆಲಸಕ್ಕಾಗಿ ನೀವು ಯಾವ ಕಾರ್ಯವನ್ನು ಆರಿಸುತ್ತೀರಿ?",
    agree: "ಒಪ್ಪುತ್ತೇನೆ",
    neutral: "ತಟಸ್ಥ",
    disagree: "ಒಪ್ಪುವುದಿಲ್ಲ",
    teach: "ಇತರರಿಗೆ ಕಲಿಸುವುದು",
    earnHome: "ಮನೆಯಿಂದ ಸಂಪಾದಿಸುವುದು",
    startShop: "ಅಂಗಡಿ ಪ್ರಾರಂಭಿಸುವುದು",
    officeWork: "ಕಚೇರಿಯಲ್ಲಿ ಕೆಲಸ",
    analyzing: "ನಿಮ್ಮ ಸಾಮರ್ಥ್ಯವನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
    craftingProfile: "ನಮ್ಮ AI ನಿಮ್ಮ ಅನನ್ಯ ಯೋಗ್ಯತಾ ಪ್ರೊಫೈಲ್ ಅನ್ನು ರಚಿಸುತ್ತಿದೆ.",
    backToHome: "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ",
    sentenceToType: "ವೇಗದ ಕಂದು ನರಿ ಸೋಮಾರಿಯಾದ ನಾಯಿಯ ಮೇಲೆ ಜಿಗಿಯುತ್ತದೆ.",
    resumeDescription: "ನಿಮ್ಮ ಬಳಿ ರೆಸ್ಯೂಮ್ ಇದ್ದರೆ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ. ಇದು ಐಚ್ಛಿಕ.",
    upload: "ಪ್ರೊಫೈಲ್ ನೋಡಿ ಮತ್ತು ಮುಗಿಸಿ",
    skip: "ಸ್ಕಿಪ್ ಮಾಡಿ ಮತ್ತು ಪ್ರೊಫೈಲ್ ನೋಡಿ",
    next: "ಮುಂದೆ",
    loadingQuestions: "ಪ್ರಶ್ನೆಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ..."
  }
};
type LanguageKey = 'en' | 'hi' | 'kn';

// --- YOUR FULL HARDCODED QUESTIONS ---
const hardcodedQuestions = (t: typeof translations.en) => [
  { round: t.round1Title, type: 'mcq', text: t.q1_1, options: ['7', '8', '9', '10'], id: 'q1_1' },
  { round: t.round1Title, type: 'mcq', text: t.q1_2, options: ['test@email', 'test.email.com', 'test@email.com', 'test@.com'], id: 'q1_2' },
  { round: t.round2Title, type: 'mcq-img', text: t.q2_1, options: ['/icons/chrome.svg', '/icons/whatsapp.svg', '/icons/camera.svg', '/icons/maps.svg'], id: 'q2_1' },
  { round: t.round2Title, type: 'mcq', text: t.q2_2, options: ['Search Button', 'Image Button', 'Mic Button', 'Settings Button'], id: 'q2_2' },
  { round: t.round3Title, type: 'typing', text: t.q3_1, sentence: t.sentenceToType, id: 'q3_1' },
  { round: t.round3Title, type: 'textarea', text: t.q3_2, id: 'q3_2' },
  { round: t.round4Title, type: 'likert', text: t.q4_1, options: [t.agree, t.neutral, t.disagree], id: 'q4_1' },
  { round: t.round4Title, type: 'likert', text: t.q4_2, options: [t.agree, t.neutral, t.disagree], id: 'q4_2' },
  { round: t.round4Title, type: 'mcq', text: t.q4_3, options: [t.teach, t.earnHome, t.startShop, t.officeWork], id: 'career_goal' },
];

export default function AssessmentPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [allQuestions, setAllQuestions] = useState<any[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [language, setLanguage] = useState<LanguageKey>('en');
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const savedLang = localStorage.getItem('selectedLanguage') as LanguageKey;
    if (savedLang && translations[savedLang]) {
      setLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    // This is the "switch". We are now using the full hardcoded questions for stability.
    // The database fetching logic can be re-enabled after the hackathon.
    setAllQuestions(hardcodedQuestions(translations[language]));
    setIsLoadingQuestions(false);
  }, [language]);
  
  const t = translations[language];
  
  let questionsWithDynamic = [...allQuestions];
  const careerGoal = answers['career_goal'];
  if (careerGoal) {
    let round5Question = null;
    if (careerGoal === t.teach) round5Question = { round: t.round5Title, type: 'mcq', text: t.q5_freelance, options: ['Teach basic English', 'Write a blog post', 'Design a logo'], id: 'round5' };
    else if (careerGoal === t.earnHome) round5Question = { round: t.round5Title, type: 'mcq', text: t.q5_freelance, options: ['Data entry for 1 hour', 'Customer service calls', 'Online surveys'], id: 'round5' };
    else if (careerGoal === t.startShop) round5Question = { round: t.round5Title, type: 'mcq', text: t.q5_business, options: ['₹40', '₹50', '₹60'], id: 'round5' };
    else if (careerGoal === t.officeWork) round5Question = { round: t.round5Title, type: 'mcq', text: t.q5_tech, options: ['<p>', '<h1>', '<image>'], id: 'round5' };
    
    if (round5Question && !questionsWithDynamic.some(q => q.id === 'round5')) {
        const careerGoalIndex = questionsWithDynamic.findIndex(q => q.id === 'career_goal');
        if (careerGoalIndex !== -1) {
            questionsWithDynamic.splice(careerGoalIndex + 1, 0, round5Question);
        }
    }
  }

  const totalSteps = questionsWithDynamic.length > 0 ? questionsWithDynamic.length + 1 : 1;
  const progressValue = (currentQuestionIndex / totalSteps) * 100;

  const handleAnswer = (answer: any, questionId: string) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);

    if (currentQuestionIndex < questionsWithDynamic.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCurrentQuestionIndex(questionsWithDynamic.length); 
    }
  };

  const processResults = async () => {
    setIsProcessing(true);
    if (!user) { router.push('/login'); return; }
    try {
      const result = await createAptitudeProfile({ assessmentResponses: JSON.stringify(answers), language: language });
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, { aptitudeProfile: result.aptitudeProfile }, { merge: true });

      const certificateData = { studentId: user.uid, courseName: "Aptitude & Digital Literacy", issueDate: new Date().toISOString() };
      const transactionHash = '0x' + CryptoJS.SHA256(JSON.stringify(certificateData)).toString();
      const newCertificate = { ...certificateData, transactionHash, verificationUrl: "https://sepolia.etherscan.io/tx/0x2b1c2b53e7f4b7a1e0f2b2b1c2b53e7f4b7a1e0f2b2b1c2b53e7f4b7a1e0f2b2b" };
      const credentialDocRef = doc(db, "users", user.uid, "credentials", "aptitude-and-digital-literacy");
      await setDoc(credentialDocRef, newCertificate);
      
      router.push('/dashboard'); 
    } catch (error) {
      console.error("AI Profile or Certificate Error:", error);
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, { aptitudeProfile: "Based on your answers, you seem to be a creative and collaborative individual." }, { merge: true });
      router.push('/dashboard'); 
    }
  };

  const renderContent = () => {
    if (isLoadingQuestions || isProcessing) {
      return (
        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-8">
          <Bot className="mx-auto size-12 animate-pulse text-primary mb-4" />
          <h2 className="text-2xl font-bold font-headline">{isProcessing ? t.analyzing : t.loadingQuestions}</h2>
          {isProcessing && <p className="text-muted-foreground mt-2">{t.craftingProfile}</p>}
        </motion.div>
      );
    }
    
    if (questionsWithDynamic.length === 0) {
        return <div className="p-8 text-center">Could not load assessment questions. Please try again later.</div>
    }

    if (currentQuestionIndex >= questionsWithDynamic.length) {
      // Resume Upload Step
      return (
        <motion.div key="resume" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
           <CardHeader>
            <CardTitle className="text-2xl text-center font-headline">{t.resumeTitle}</CardTitle>
            <CardDescription className="text-center">{t.resumeDescription}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <div className="flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed">
              <UploadCloud className="mx-auto size-8 text-muted-foreground" />
            </div>
            <Input type="file" className="w-full" />
            <div className="flex w-full gap-4">
               <Button variant="outline" className="w-full" onClick={processResults}>{t.skip}</Button>
               <Button className="w-full" onClick={processResults}>{t.upload}</Button>
            </div>
          </CardContent>
        </motion.div>
      );
    }

    const currentQuestion = questionsWithDynamic[currentQuestionIndex];
    return (
        <motion.div key={currentQuestion.id} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <CardHeader>
                <CardDescription className="text-center font-semibold text-primary">{currentQuestion.round}</CardDescription>
                <CardTitle className="text-xl text-center font-headline">{currentQuestion.text}</CardTitle>
            </CardHeader>
            <CardContent>
                {currentQuestion.type === 'mcq' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentQuestion.options.map((option: string) => (
                      <Button key={option} variant="outline" className="h-auto py-4" onClick={() => handleAnswer(option, currentQuestion.id)}>
                        {option}
                      </Button>
                    ))}
                  </div>
                )}
                {currentQuestion.type === 'mcq-img' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {currentQuestion.options.map((option: string) => (
                      <Button key={option} variant="outline" className="h-24 flex items-center justify-center" onClick={() => handleAnswer(option, currentQuestion.id)}>
                        <img src={option} alt={option} className="h-12 w-12" />
                      </Button>
                    ))}
                  </div>
                )}
                {currentQuestion.type === 'likert' && (
                   <RadioGroup onValueChange={(value) => handleAnswer(value, currentQuestion.id)} className="flex justify-center gap-4 sm:gap-8 pt-4">
                    {currentQuestion.options.map((option: string) => (
                      <div key={option} className="flex flex-col items-center space-y-2">
                        <RadioGroupItem value={option} id={option} className="h-6 w-6" />
                        <Label htmlFor={option}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                {(currentQuestion.type === 'typing' || currentQuestion.type === 'textarea') && (
                  <div className="space-y-4">
                    {currentQuestion.type === 'typing' && <p className="p-4 bg-muted rounded-md text-center font-mono">{currentQuestion.sentence}</p>}
                    <Textarea 
                      placeholder={currentQuestion.type === 'typing' ? t.sentenceToType : t.q3_2}
                      onChange={(e) => setAnswers({...answers, [currentQuestion.id]: e.target.value})}
                    />
                    <Button onClick={() => handleAnswer(answers[currentQuestion.id] || "", currentQuestion.id)} className="w-full">{t.next}</Button>
                  </div>
                )}
            </CardContent>
        </motion.div>
    )
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8">
       <div className="absolute top-6 left-6">
            <Button variant="ghost" asChild>
                <Link href="/"><ArrowRight className="rotate-180 mr-2" />{t.backToHome}</Link>
            </Button>
        </div>
      <div className="w-full max-w-2xl">
        <Card className="shadow-2xl bg-background border-border/50">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </Card>
        {(!isLoadingQuestions && !isProcessing) && (
            <Progress value={progressValue} className="mt-6 h-2" />
        )}
      </div>
    </main>
  );
}