import { db } from '../lib/firebase';
import { collection, writeBatch, doc } from "firebase/firestore";

// --- Put all necessary data directly in this script ---
const translations = {
  en: {
    round1Title: "Round 1: Aptitude Test",
    round2Title: "Round 2: Digital Literacy",
    round3Title: "Round 3: Communication",
    round4Title: "Round 4: Career Preference",
    //... add all other English translations here
  },
  hi: {
    round1Title: "राउंड 1: योग्यता परीक्षण",
    //... add all other Hindi translations here
  },
  kn: {
    round1Title: "ಸುತ್ತು 1: ಆಪ್ಟಿಟ್ಯೂಡ್ ಪರೀಕ್ಷೆ",
    //... add all other Kannada translations here
  }
};

const hardcodedQuestions = (t: any, lang: string) => [
  { round: t.round1Title, type: 'mcq', text: "Which number completes the pattern: 2, 4, 6, __?", options: ['7', '8', '9', '10'], id: 'q1_1', language: lang },
  // ... add ALL your other questions here, using the `t` object for round titles if needed
];
// --- End of data ---


export const uploadQuestionsToFirestore = async () => {
  console.log("Starting question upload...");
  const batch = writeBatch(db);
  
  try {
    // Loop through each language
    for (const lang of ['en', 'hi', 'kn']) {
      const t = translations[lang as keyof typeof translations];
      
      // Check if translations for the language exist
      if (!t) {
          console.error(`Translations not found for language: ${lang}`);
          continue; // Skip this language if translations are missing
      }

      const questionsForLang = hardcodedQuestions(t, lang);
      
      console.log(`Preparing ${questionsForLang.length} questions for language: ${lang}`);

      questionsForLang.forEach((question, index) => {
        // Ensure every question has a valid 'round' field
        if (typeof question.round === 'undefined') {
            console.error(`Question with id ${question.id || index} is missing a 'round' title.`);
            // We can either skip this question or assign a default
            question.round = "General Round"; 
        }

        const docId = `${lang}_${question.id || `q${index}`}`;
        const questionRef = doc(db, "assessmentQuestions", docId);
        batch.set(questionRef, question);
      });
    }

    await batch.commit();
    console.log("Successfully committed batch to upload all questions!");
    return "Success!";

  } catch (error) {
    console.error("Error uploading questions: ", error);
    return "Failed!";
  }
};