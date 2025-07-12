const { initializeApp, getApps } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");

// Your Firebase config here (copy from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyAqoWhRb5vY2N7urYtl32q01KQg4xjbn1I",
  authDomain: "skillbridge-84qnn.firebaseapp.com",
  projectId: "skillbridge-84qnn",
  storageBucket: "skillbridge-84qnn.appspot.com",
  messagingSenderId: "464504505620",
  appId: "1:464504505620:web:a81ae5f53d104ef04aae01"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

// Copy your translations and questions function here:
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
    upload: "Upload File",
    skip: "Skip & Finish",
  },
  // ...add hi and kn objects here, just like in your code...
};

const questions = (t: typeof translations.en) => [
  { round: t.round1Title, type: 'mcq', text: t.q1_1, options: ['7', '8', '9', '10'], answer: '8' },
  { round: t.round1Title, type: 'mcq', text: t.q1_2, options: ['test@email', 'test.email.com', 'test@email.com', 'test@.com'], answer: 'test@email.com' },
  { round: t.round2Title, type: 'mcq-img', text: t.q2_1, options: ['/icons/chrome.svg', '/icons/whatsapp.svg', '/icons/camera.svg', '/icons/maps.svg'], answer: '/icons/chrome.svg' },
  { round: t.round2Title, type: 'mcq', text: t.q2_2, options: ['Search Button', 'Image Button', 'Mic Button', 'Settings Button'], answer: 'Search Button' },
  { round: t.round3Title, type: 'typing', text: t.q3_1, sentence: t.sentenceToType },
  { round: t.round3Title, type: 'textarea', text: t.q3_2 },
  { round: t.round4Title, type: 'likert', text: t.q4_1, options: [t.agree, t.neutral, t.disagree] },
  { round: t.round4Title, type: 'likert', text: t.q4_2, options: [t.agree, t.neutral, t.disagree] },
  { round: t.round4Title, type: 'mcq', text: t.q4_3, options: [t.teach, t.earnHome, t.startShop, t.officeWork], id: 'career_goal' },
];

async function uploadQuestions() {
  const lang = "en";
const t = translations[lang];
const qs = questions(t);
for (const q of qs) {
  await addDoc(collection(db, "assessmentQuestions"), {
    ...q,
    language: lang,
  });
  console.log(`Uploaded: ${lang} - ${q.text}`);
}
console.log("All questions uploaded!");
process.exit(0);
}
uploadQuestions();
