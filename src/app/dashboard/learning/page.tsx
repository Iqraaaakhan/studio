
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smartphone, BarChart2, MessageSquare, PenTool, Loader2, Sparkles, BookOpen, Brush, Code, ShoppingCart, Video, Briefcase } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import generateLearningPath, { type LearningPathOutput } from '@/ai/flows/learning-path-generation';import { Skeleton } from '@/components/ui/skeleton';

const allLearningModules = [
  // Digital Literacy
  { id: 'dl_basics', title: 'Digital Literacy: Smartphone Basics', description: 'Learn to use smartphones and essential apps for daily tasks.', icon: <Smartphone />, image: { src: 'https://placehold.co/600x400.png', hint: 'person using phone' }, duration: '2 hours', level: 'Beginner', category: 'Digital Literacy' },
  { id: 'dl_internet', title: 'Internet and Browser Skills', description: 'Safely browse the internet, use search engines, and manage emails.', icon: <Smartphone />, image: { src: 'https://placehold.co/600x400.png', hint: 'internet globe' }, duration: '3 hours', level: 'Beginner', category: 'Digital Literacy' },
  // Financial Management
  { id: 'fm_basics', title: 'Financial Management: Budgeting', description: 'Understand budgeting, savings, and digital payment methods like UPI.', icon: <BarChart2 />, image: { src: 'https://placehold.co/600x400.png', hint: 'charts graphs' }, duration: '3 hours', level: 'Beginner', category: 'Finance' },
  { id: 'fm_banking', title: 'Introduction to Online Banking', description: 'Learn to use your bank\'s mobile app for transactions and services.', icon: <BarChart2 />, image: { src: 'https://placehold.co/600x400.png', hint: 'mobile banking' }, duration: '4 hours', level: 'Intermediate', category: 'Finance' },
  // Communication
  { id: 'ec_basics', title: 'Effective Communication', description: 'Improve your communication skills for better job prospects.', icon: <MessageSquare />, image: { src: 'https://placehold.co/600x400.png', hint: 'people talking' }, duration: '4 hours', level: 'Intermediate', category: 'Communication' },
  { id: 'ec_english', title: 'Spoken English for Beginners', description: 'Learn basic conversational English for interviews and workplace.', icon: <MessageSquare />, image: { src: 'https://placehold.co/600x400.png', hint: 'speaking english' }, duration: '8 hours', level: 'Intermediate', category: 'Communication' },
  // Vocational & Job Skills
  { id: 'vs_tailoring', title: 'Vocational Skills: Tailoring', description: 'Master the basics of tailoring and dressmaking.', icon: <PenTool />, image: { src: 'https://placehold.co/600x400.png', hint: 'sewing machine' }, duration: '20 hours', level: 'Vocational', category: 'Vocational' },
  { id: 'vs_data_entry', title: 'Data Entry and MS Excel Basics', description: 'Learn fast and accurate data entry, and essential Excel formulas.', icon: <Briefcase />, image: { src: 'https://placehold.co/600x400.png', hint: 'spreadsheet data' }, duration: '12 hours', level: 'Vocational', category: 'Job Skills' },
  { id: 'vs_ecommerce', title: 'Online Selling: E-commerce Platforms', description: 'Learn how to sell products on platforms like Meesho and Flipkart.', icon: <ShoppingCart />, image: { src: 'https://placehold.co/600x400.png', hint: 'online shopping' }, duration: '10 hours', level: 'Vocational', category: 'Job Skills' },
  { id: 'vs_graphic_design', title: 'Graphic Design with Canva', description: 'Create beautiful graphics for social media and local businesses using Canva.', icon: <Brush />, image: { src: 'https://placehold.co/600x400.png', hint: 'graphic design' }, duration: '8 hours', level: 'Vocational', category: 'Job Skills' },
  { id: 'vs_video_editing', title: 'Video Editing for Social Media', description: 'Learn to edit simple videos for Instagram Reels and YouTube Shorts.', icon: <Video />, image: { src: 'https://placehold.co/600x400.png', hint: 'video editing' }, duration: '10 hours', level: 'Vocational', category: 'Job Skills' },
  { id: 'vs_web_dev', title: 'Introduction to Web Development', description: 'Learn the basics of HTML, CSS, and how websites work.', icon: <Code />, image: { src: 'https://placehold.co/600x400.png', hint: 'coding screen' }, duration: '15 hours', level: 'Advanced', category: 'Job Skills' },
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
          style={{ objectFit: 'cover' }}
          data-ai-hint={module.image.hint}
        />
         <div className="absolute top-2 right-2 bg-primary/80 text-primary-foreground rounded-full p-2 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
          </div>
      </div>
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="text-primary">{module.icon}</div>
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
                style={{ objectFit: 'cover' }}
                data-ai-hint={module.image.hint}
            />
        </div>
        <CardHeader>
            <div className="flex items-start gap-4">
            <div className="text-primary">{module.icon}</div>
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
//learning done