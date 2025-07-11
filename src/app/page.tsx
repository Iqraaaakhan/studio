'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BrainCircuit, Briefcase, GraduationCap, UserPlus } from 'lucide-react';
import Logo from '@/components/app/logo';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from 'next/link';

const translations = {
  en: {
    tagline: 'Empowering Rural India, One Skill at a Time.',
    title: 'Your Path to a Bright Future Starts Here',
    description: 'DigiDisha provides personalized training, verified certifications, and job opportunities to build successful careers for rural youth and women.',
    cta_assessment: 'Take Free Assessment',
    cta_signup: 'Register Now',
    features_title: 'How DigiDisha Works',
    features_description: 'A simple, powerful path to your future career in three easy steps.',
    feature1_title: '1. Gamified Assessment',
    feature1_description: 'A mobile-first, vernacular-language test that identifies innate talents, presented as a fun game.',
    feature2_title: '2. AI Job Mapping',
    feature2_description: 'Our AI maps your aptitude profile against a real-time database of local and remote job demands.',
    feature3_title: '3. Adaptive Micro-Learning',
    feature3_description: 'Bite-sized modules that work on any smartphone, even with patchy internet, to build skills for your matched jobs.',
    footer: `© ${new Date().getFullYear()} DigiDisha. All rights reserved.`,
    login: 'Log In',
    dashboard: 'Dashboard',
    features: 'Features',
    language: 'Language',
  },
  hi: {
    tagline: 'ग्रामीण भारत को सशक्त बनाना, एक समय में एक कौशल।',
    title: 'आपके उज्ज्वल भविष्य का रास्ता यहीं से शुरू होता है',
    description: 'डिजिटदिशा ग्रामीण युवाओं और महिलाओं के लिए सफल करियर बनाने के लिए व्यक्तिगत प्रशिक्षण, सत्यापित प्रमाणपत्र और नौकरी के अवसर प्रदान करता है।',
    cta_assessment: 'मुफ़्त मूल्यांकन करें',
    cta_signup: 'अभी पंजीकरण करें',
    features_title: 'डिजिटदिशा कैसे काम करता है',
    features_description: 'तीन आसान चरणों में आपके भविष्य के करियर का एक सरल, शक्तिशाली मार्ग।',
    feature1_title: '1. गेमिफाइड मूल्यांकन',
    feature1_description: 'एक मजेदार खेल के रूप में प्रस्तुत, सहज प्रतिभाओं की पहचान करने वाला एक मोबाइल-पहला, स्थानीय भाषा का परीक्षण।',
    feature2_title: '2. एआई जॉब मैपिंग',
    feature2_description: 'हमारा एआई आपके योग्यता प्रोफाइल को स्थानीय और दूरस्थ नौकरी की मांगों के रीयल-टाइम डेटाबेस के मुकाबले मैप करता है।',
    feature3_title: '3. अनुकूली माइक्रो-लर्निंग',
    feature3_description: 'आपके मेल खाने वाली नौकरियों के लिए कौशल बनाने के लिए, खराब इंटरनेट के साथ भी, किसी भी स्मार्टफोन पर काम करने वाले बाइट-आकार के मॉड्यूल।',
    footer: `© ${new Date().getFullYear()} डिजिटदिशा। सर्वाधिकार सुरक्षित।`,
    login: 'लॉग इन करें',
    dashboard: 'डैशबोर्ड',
    features: 'विशेषताएँ',
    language: 'भाषा',
  },
  kn: {
    tagline: 'ಗ್ರಾಮೀಣ ಭಾರತವನ್ನು ಸಬಲೀಕರಣಗೊಳಿಸುವುದು, ಒಂದು ಸಮಯದಲ್ಲಿ ಒಂದು ಕೌಶಲ್ಯ.',
    title: 'ನಿಮ್ಮ ಉಜ್ವಲ ಭವಿಷ್ಯದ ಹಾದಿ ಇಲ್ಲಿಂದ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ',
    description: 'ಡಿಜಿ ದಿಶಾ ಗ್ರಾಮೀಣ ಯುವಕರು ಮತ್ತು ಮಹಿಳೆಯರಿಗೆ ಯಶಸ್ವಿ ವೃತ್ತಿಜೀವನವನ್ನು ನಿರ್ಮಿಸಲು ವೈಯಕ್ತಿಕ ತರಬೇತಿ, ಪರಿಶೀಲಿಸಿದ ಪ್ರಮಾಣೀಕರಣಗಳು ಮತ್ತು ಉದ್ಯೋಗಾವಕಾಶಗಳನ್ನು ಒದಗಿಸುತ್ತದೆ.',
    cta_assessment: 'ಉಚಿತ ಮೌಲ್ಯಮಾಪನ ತೆಗೆದುಕೊಳ್ಳಿ',
    cta_signup: 'ಈಗ ನೋಂದಾಯಿಸಿ',
    features_title: 'ಡಿಜಿ ದಿಶಾ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ',
    features_description: 'ಮೂರು ಸುಲಭ ಹಂತಗಳಲ್ಲಿ ನಿಮ್ಮ ಭವಿಷ್ಯದ ವೃತ್ತಿಜೀವನಕ್ಕೆ ಸರಳ, ಶಕ್ತಿಯುತ ಮಾರ್ಗ.',
    feature1_title: '1. ಗೇಮಿಫೈಡ್ ಮೌಲ್ಯಮಾಪನ',
    feature1_description: 'ಒಂದು ಮೋಜಿನ ಆಟವಾಗಿ ಪ್ರಸ್ತುತಪಡಿಸಲಾದ, ಸಹಜ ಪ್ರತಿಭೆಗಳನ್ನು ಗುರುತಿಸುವ ಮೊಬೈಲ್-ಮೊದಲ, ಸ್ಥಳೀಯ ಭಾಷೆಯ ಪರೀಕ್ಷೆ.',
    feature2_title: '2. AI ಉದ್ಯೋಗ ಮ್ಯಾಪಿಂಗ್',
    feature2_description: 'ನಮ್ಮ AI ನಿಮ್ಮ ಯೋಗ್ಯತಾ ಪ್ರೊಫೈಲ್ ಅನ್ನು ಸ್ಥಳೀಯ ಮತ್ತು ದೂರಸ್ಥ ಉದ್ಯೋಗ ಬೇಡಿಕೆಗಳ ನೈಜ-ಸಮಯದ ಡೇಟಾಬೇಸ್ ವಿರುದ್ಧ ನಕ್ಷೆ ಮಾಡುತ್ತದೆ.',
    feature3_title: '3. ಅಡಾಪ್ಟಿವ್ ಮೈಕ್ರೋ-ಲರ್ನಿಂಗ್',
    feature3_description: 'ನಿಮ್ಮ ಹೊಂದಾಣಿಕೆಯ ಉದ್ಯೋಗಗಳಿಗೆ ಕೌಶಲ್ಯಗಳನ್ನು ನಿರ್ಮಿಸಲು, ಪ್ಯಾಚಿ ಇಂಟರ್ನೆಟ್‌ನೊಂದಿಗೆ ಸಹ ಯಾವುದೇ ಸ್ಮಾರ್ಟ್‌ಫೋನ್‌ನಲ್ಲಿ ಕಾರ್ಯನಿರ್ವಹಿಸುವ ಬೈಟ್-ಗಾತ್ರದ ಮಾಡ್ಯೂಲ್‌ಗಳು.',
    footer: `© ${new Date().getFullYear()} ಡಿಜಿ ದಿಶಾ। ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.`,
    login: 'ಲಾಗಿನ್ ಮಾಡಿ',
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    features: 'ವೈಶಿಷ್ಟ್ಯಗಳು',
    language: 'ಭಾಷೆ',
  }
};

type LanguageKey = keyof typeof translations;

function LanguageSwitcher({ onLanguageChange, value }: { onLanguageChange: (lang: string) => void; value: LanguageKey }) {
  return (
    <div className="w-32">
      <Select value={value} onValueChange={onLanguageChange}>
        <SelectTrigger className="bg-transparent border-border/80 text-foreground/80 hover:bg-secondary hover:text-foreground transition-colors">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="hi">हिंदी</SelectItem>
          <SelectItem value="kn">ಕನ್ನಡ</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="bg-secondary/50 backdrop-blur-sm border-border/20 text-center shadow-lg hover:shadow-primary/10 transition-shadow duration-300">
      <CardHeader className="items-center">
        <div className="p-4 bg-primary/20 rounded-full text-primary">
          {icon}
        </div>
        <CardTitle className="font-headline text-xl mt-4">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground">
        {description}
      </CardContent>
    </Card>
  )
}

export default function HomePage() {
  const router = useRouter();
  const [language, setLanguage] = useState<LanguageKey>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('selectedLanguage') as LanguageKey;
    if (savedLang && translations[savedLang]) {
      setLanguage(savedLang);
    }
  }, []);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang as LanguageKey);
    localStorage.setItem('selectedLanguage', lang);
  }

  const handleStartAssessment = () => {
    router.push('/assessment');
  };
  
  const t = translations[language];

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Logo />
            </Link>
          </div>
          <nav className="flex-1 items-center space-x-6 text-sm font-medium hidden md:flex">
            <Link href="#features" className="text-muted-foreground transition-colors hover:text-foreground">{t.features}</Link>
            <Link href="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">{t.dashboard}</Link>
          </nav>
          <div className="flex items-center justify-end space-x-4 flex-1">
            <LanguageSwitcher onLanguageChange={handleLanguageChange} value={language} />
            <Button variant="outline" asChild className="border-primary/50 text-primary/80 hover:bg-primary/10 hover:text-primary">
                <Link href="/login">{t.login}</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="py-24 md:py-32 flex items-center justify-center text-white bg-gradient-to-b from-background to-secondary/30">
            <div className="container text-center z-10 p-4">
                <div className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">{t.tagline}</div>
                <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter text-foreground">
                    {t.title}
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
                    {t.description}
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button size="lg" onClick={handleStartAssessment} className="bg-gradient-to-r from-primary to-purple-500 text-primary-foreground hover:opacity-90 shadow-lg w-full sm:w-auto">
                        {t.cta_assessment} <ArrowRight className="ml-2" />
                    </Button>
                    <Button size="lg" variant="ghost" asChild className="text-muted-foreground hover:text-foreground w-full sm:w-auto">
                      <Link href="/signup">
                        {t.cta_signup} <UserPlus className="ml-2" />
                      </Link>
                    </Button>
                </div>
            </div>
        </section>

        <section id="features" className="py-20 md:py-24 bg-secondary/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">{t.features_title}</h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">{t.features_description}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                <FeatureCard 
                    icon={<BrainCircuit className="size-8" />}
                    title={t.feature1_title}
                    description={t.feature1_description}
                />
                <FeatureCard 
                    icon={<Briefcase className="size-8" />}
                    title={t.feature2_title}
                    description={t.feature2_description}
                />
                <FeatureCard 
                    icon={<GraduationCap className="size-8" />}
                    title={t.feature3_title}
                    description={t.feature3_description}
                />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-border/40 bg-background">
        <div className="container text-center text-muted-foreground text-sm">
            {t.footer}
        </div>
      </footer>
    </div>
  );
}
