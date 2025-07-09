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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const router = useRouter();

  const totalSteps = questions.length + 2; // Intro + questions + loading/result

  const handleStart = () => {
    setStep(1);
  };

  const handleAnswer = (answer: string) => {
    setAnswers([...answers, answer]);
    if (step <= questions.length) {
      setStep(step + 1);
    }
  };

  useEffect(() => {
    if (step === questions.length + 1) {
      const processResults = async () => {
        setLoading(true);
        const assessmentResponses = `
          Question 1: ${questions[0].text} - Answer: ${answers[0]}
          Question 2: ${questions[1].text} - Answer: ${answers[1]}
          Question 3: ${questions[2].text} - Answer: ${answers[2]}
          Language: ${language}
        `;
        try {
          const result = await createAptitudeProfile({ assessmentResponses });
          if (typeof window !== 'undefined') {
            localStorage.setItem('aptitudeProfile', result.aptitudeProfile);
          }
          router.push('/dashboard');
        } catch (error) {
          console.error("Failed to generate aptitude profile:", error);
          if (typeof window !== 'undefined') {
            localStorage.setItem('aptitudeProfile', "Could not generate profile. Based on your answers, you seem to be a creative problem solver who enjoys collaboration.");
          }
          router.push('/dashboard');
        } finally {
          setLoading(false);
        }
      };
      processResults();
    }
  }, [step, answers, router, language]);

  const progressValue = (step / totalSteps) * 100;

  const renderStep = () => {
    if (loading || step === questions.length + 1) {
      return (
        <motion.div
          key="loading"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-center"
        >
          <Loader2 className="mx-auto size-12 animate-spin text-primary mb-4" />
          <h2 className="text-2xl font-bold font-headline">Analyzing your potential...</h2>
          <p className="text-muted-foreground mt-2">Our AI is crafting your unique aptitude profile.</p>
        </motion.div>
      );
    }

    if (step === 0) {
      return (
        <motion.div
          key="start"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <CardHeader className="items-center text-center">
            <Logo />
            <CardTitle className="text-3xl font-bold font-headline mt-4">Welcome to SkillBridge</CardTitle>
            <CardDescription className="max-w-md">Discover your innate talents with our quick, fun assessment and unlock job opportunities tailored just for you.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="w-48">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                  <SelectItem value="kn">ಕನ್ನಡ (Kannada)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button size="lg" onClick={handleStart} className="bg-accent text-accent-foreground hover:bg-accent/90">
              Start Your Journey <ArrowRight className="ml-2" />
            </Button>
          </CardContent>
        </motion.div>
      );
    }

    const currentQuestion = questions[step - 1];
    return (
      <motion.div
        key={`question-${step}`}
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
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-2xl">
        <Card className="shadow-2xl">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </Card>
        {step > 0 && !loading && (
          <Progress value={progressValue} className="mt-6 h-2" />
        )}
      </div>
    </main>
  );
}
