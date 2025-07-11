
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { createAptitudeProfile } from '@/ai/flows/aptitude-profile-creation';
import { Loader2, ArrowRight, Building, Palette, Users, BrainCircuit } from 'lucide-react';
import Logo from '@/components/app/logo';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

type Question = {
  text: string;
  options: {
    id: string;
    text: string;
    icon: React.ReactNode;
  }[];
};

const questions: Question[] = [
  {
    text: "Which activity sounds most appealing to you?",
    options: [
      { id: 'build', text: "Building something tangible", icon: <Building className="size-8" /> },
      { id: 'design', text: "Designing a beautiful poster", icon: <Palette className="size-8" /> },
      { id: 'organize', text: "Organizing a community event", icon: <Users className="size-8" /> },
      { id: 'solve', text: "Solving a complex puzzle", icon: <BrainCircuit className="size-8" /> },
    ],
  },
  {
    text: "When facing a challenge, you are more likely to:",
    options: [
      { id: 'analyze', text: "Analyze all data points", icon: <BrainCircuit className="size-8" /> },
      { id: 'collaborate', text: "Collaborate with others", icon: <Users className="size-8" /> },
      { id: 'innovate', text: "Create an innovative solution", icon: <Palette className="size-8" /> },
      { id: 'execute', text: "Follow a proven plan", icon: <Building className="size-8" /> },
    ],
  },
  {
    text: "You feel most energized in an environment that is:",
    options: [
      { id: 'structured', text: "Structured and organized", icon: <Building className="size-8" /> },
      { id: 'creative', text: "Creative and dynamic", icon: <Palette className="size-8" /> },
      { id: 'social', text: "Social and team-oriented", icon: <Users className="size-8" /> },
      { id: 'analytical', text: "Logical and data-driven", icon: <BrainCircuit className="size-8" /> },
    ],
  },
];

export default function AssessmentPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const totalSteps = questions.length;
  const progressValue = ((currentQuestionIndex) / totalSteps) * 100;

  const handleAnswer = (answer: string) => {
    setAnswers([...answers, answer]);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      processResults([...answers, answer]);
    }
  };

  const processResults = async (finalAnswers: string[]) => {
    setLoading(true);
    const assessmentResponses = `
        ${questions.map((q, i) => `Question ${i + 1}: ${q.text} - Answer: ${finalAnswers[i]}`).join('\n')}
        Language: ${language}
    `;
    try {
      const result = await createAptitudeProfile({ assessmentResponses });
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          aptitudeProfile: result.aptitudeProfile
        });
        // The AuthGuard will handle redirection now. No need for router.push here.
      }
    } catch (error) {
      console.error("Failed to generate aptitude profile:", error);
      if (user) {
         const userDocRef = doc(db, "users", user.uid);
         await updateDoc(userDocRef, {
            aptitudeProfile: "Could not generate profile. Based on your answers, you seem to be a creative problem solver who enjoys collaboration."
        });
      }
      // Even on error, the AuthGuard will see the updated (fallback) profile and redirect.
    } finally {
      // The component will be unmounted by the AuthGuard's redirection.
      // Setting loading to false isn't strictly necessary but is good practice.
      setLoading(false);
    }
  };


  const renderContent = () => {
    if (loading) {
      return (
        <motion.div
          key="loading"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-center p-6"
        >
          <Loader2 className="mx-auto size-12 animate-spin text-primary mb-4" />
          <h2 className="text-2xl font-bold font-headline">Analyzing your potential...</h2>
          <p className="text-muted-foreground mt-2">Our AI is crafting your unique aptitude profile.</p>
        </motion.div>
      );
    }

    const currentQuestion = questions[currentQuestionIndex];
    return (
      <motion.div
        key={`question-${currentQuestionIndex}`}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <CardHeader>
          <CardTitle className="text-2xl text-center font-headline">{currentQuestion.text}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentQuestion.options.map((option) => (
              <Button
                key={option.id}
                variant="outline"
                className="h-28 flex flex-col gap-2 p-4 text-center text-base hover:bg-secondary hover:border-primary"
                onClick={() => handleAnswer(option.text)}
              >
                {option.icon}
                <span>{option.text}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </motion.div>
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-secondary p-4 sm:p-8">
        <div className="absolute top-6 left-6">
            <Button variant="ghost" asChild>
                <Link href="/">
                    &larr; Back to Home
                </Link>
            </Button>
        </div>
      <div className="w-full max-w-2xl">
        <Card className="shadow-2xl bg-background border-border/50">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </Card>
        {!loading && (
          <Progress value={progressValue} className="mt-6 h-2" />
        )}
      </div>
    </main>
  );
}
