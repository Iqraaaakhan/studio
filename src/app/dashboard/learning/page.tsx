
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smartphone, BarChart2, MessageSquare, PenTool, Loader2, Sparkles, BookOpen } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { generateLearningPath, type LearningPathOutput } from '@/ai/flows/learning-path-generation';
import { Skeleton } from '@/components/ui/skeleton';

const allLearningModules = [
  {
    id: 'digital_literacy',
    title: 'Digital Literacy Basics',
    description: 'Learn to use smartphones and essential apps for daily tasks.',
    icon: <Smartphone className="h-8 w-8 text-primary" />,
    image: { src: 'https://placehold.co/600x400.png', hint: 'person using phone' },
    duration: '2 hours',
    level: 'Beginner',
  },
  {
    id: 'financial_management',
    title: 'Financial Management',
    description: 'Understand budgeting, savings, and digital payment methods.',
    icon: <BarChart2 className="h-8 w-8 text-primary" />,
    image: { src: 'https://placehold.co/600x400.png', hint: 'charts graphs' },
    duration: '3 hours',
    level: 'Beginner',
  },
  {
    id: 'effective_communication',
    title: 'Effective Communication',
    description: 'Improve your communication skills for better job prospects.',
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    image: { src: 'https://placehold.co/600x400.png', hint: 'people talking' },
    duration: '4 hours',
    level: 'Intermediate',
  },
  {
    id: 'vocational_tailoring',
    title: 'Vocational Skills: Tailoring',
    description: 'Master the basics of tailoring and dressmaking.',
    icon: <PenTool className="h-8 w-8 text-primary" />,
    image: { src: 'https://placehold.co/600x400.png', hint: 'sewing machine' },
    duration: '10 hours',
    level: 'Vocational',
  },
];

const RecommendedModuleCard = ({ title, reason, module }: { title: string; reason: string; module?: typeof allLearningModules[0] }) => {
  if (!module) return null;
  return (
    <Card className="flex flex-col overflow-hidden border-primary/50 border-2 shadow-lg">
      <div className="relative h-40 w-full">
        <Image 
          src={module.image.src} 
          alt={module.title}
          fill
          objectFit="cover"
          data-ai-hint={module.image.hint}
        />
         <div className="absolute top-2 right-2 bg-primary/80 text-primary-foreground rounded-full p-2 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
          </div>
      </div>
      <CardHeader>
        <div className="flex items-start gap-4">
          {module.icon}
          <div className="flex-1">
            <CardTitle className="text-lg font-headline">{title}</CardTitle>
            <CardDescription className="mt-2 text-sm text-foreground/80">{reason}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="mt-auto">
        <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Start Learning</Button>
      </CardContent>
    </Card>
  );
};

const ModuleCard = ({ module }: { module: typeof allLearningModules[0] }) => (
    <Card className="flex flex-col overflow-hidden">
        <div className="relative h-40 w-full">
            <Image 
                src={module.image.src} 
                alt={module.title}
                fill
                objectFit="cover"
                data-ai-hint={module.image.hint}
            />
        </div>
        <CardHeader>
            <div className="flex items-start gap-4">
            {module.icon}
            <div className="flex-1">
                <CardTitle className="text-lg font-headline">{module.title}</CardTitle>
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                    <span>{module.level}</span>
                    <span>&bull;</span>
                    <span>{module.duration}</span>
                </div>
                <CardDescription className="mt-2">{module.description}</CardDescription>
            </div>
            </div>
        </CardHeader>
        <CardContent className="mt-auto">
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Start Learning</Button>
        </CardContent>
    </Card>
);

export default function LearningPage() {
  const { user } = useAuth();
  const [aptitudeProfile, setAptitudeProfile] = useState<string | null>(null);
  const [recommendedPath, setRecommendedPath] = useState<LearningPathOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndGeneratePath = async () => {
      if (user) {
        setLoading(true);
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists() && docSnap.data().aptitudeProfile) {
          const profile = docSnap.data().aptitudeProfile;
          setAptitudeProfile(profile);
          try {
            const result = await generateLearningPath({ 
              aptitudeProfile: profile,
              availableModules: allLearningModules.map(m => m.title) 
            });
            setRecommendedPath(result);
          } catch (error) {
            console.error("Failed to generate learning path:", error);
            setRecommendedPath(null); // Set to null on error to prevent crash
          }
        }
        setLoading(false);
      }
    };
    fetchProfileAndGeneratePath();
  }, [user]);

  const recommendedModules = useMemo(() => {
    if (!recommendedPath) return [];
    return recommendedPath.recommendedModules.map(rec => ({
      ...rec,
      module: allLearningModules.find(m => m.title === rec.title),
    }));
  }, [recommendedPath]);


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold font-headline tracking-tight">Adaptive Micro-Learning</h2>
        <p className="text-muted-foreground">
          Bite-sized modules to help you learn new skills, anytime, anywhere.
        </p>
      </div>

      {loading && (
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}><CardContent className="p-4 space-y-4"><Skeleton className="h-40 w-full" /><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/2" /></CardContent></Card>
            ))}
        </div>
      )}

      {!loading && recommendedPath && recommendedPath.recommendedModules.length > 0 && (
        <>
          <div className="space-y-2 py-4">
             <h3 className="text-2xl font-bold font-headline tracking-tight flex items-center"><Sparkles className="mr-2 text-primary"/> Your AI-Recommended Path</h3>
             <p className="text-muted-foreground">Our AI has selected these modules just for you based on your aptitude profile.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recommendedModules.map((rec, index) => (
              <RecommendedModuleCard key={index} title={rec.title} reason={rec.reason} module={rec.module} />
            ))}
          </div>
          <div className="pt-12 space-y-2">
             <h3 className="text-2xl font-bold font-headline tracking-tight flex items-center"><BookOpen className="mr-2"/> Full Module Library</h3>
             <p className="text-muted-foreground">Explore all available learning opportunities.</p>
          </div>
        </>
      )}
      
      {!loading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {allLearningModules.map((module, index) => (
            <ModuleCard key={index} module={module} />
          ))}
        </div>
      )}
    </div>
  );
}
