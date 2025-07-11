
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Briefcase, GraduationCap } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import Logo from '@/components/app/logo';

export default function AssessmentResultsPage() {
  const [aptitudeProfile, setAptitudeProfile] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        setIsLoading(true);
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setAptitudeProfile(docSnap.data().aptitudeProfile || "Could not retrieve your profile. Please try again.");
        }
        setIsLoading(false);
      } else {
        // Handle case where user is not logged in but reaches this page
        setIsLoading(false);
        setAptitudeProfile("You must be logged in to view your assessment results.");
      }
    };

    fetchProfile();
  }, [user]);

  const profileParts = aptitudeProfile?.split('\n') || [];
  const skillLevel = profileParts[0] || '';
  const profileSummary = profileParts.slice(1).join('\n');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-secondary p-4 sm:p-8">
       <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-2xl"
       >
        <Card className="shadow-2xl bg-background border-border/50 text-center">
            <CardHeader>
                <div className="mx-auto bg-primary/20 text-primary p-3 rounded-full mb-4">
                    <Sparkles className="size-8" />
                </div>
                <CardTitle className="text-2xl font-headline">Your Results Are In!</CardTitle>
                <CardDescription>Here's what we discovered about your potential.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {isLoading ? (
                    <div className="space-y-4 text-left">
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                ) : (
                    <div className="p-4 bg-muted rounded-lg text-left space-y-4">
                        <h3 className="text-lg font-semibold text-primary">{skillLevel}</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{profileSummary}</p>
                    </div>
                )}
                
                <div className="pt-4 space-y-3">
                     <h3 className="text-lg font-headline">What's Next?</h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <Button variant="outline" asChild>
                            <Link href="/dashboard/jobs">
                                <Briefcase className="mr-2" /> View Job Matches
                            </Link>
                         </Button>
                         <Button variant="outline" asChild>
                             <Link href="/dashboard/learning">
                                <GraduationCap className="mr-2" /> Start Learning
                            </Link>
                         </Button>
                     </div>
                     <Button asChild className="w-full">
                        <Link href="/dashboard">
                            Go to Dashboard <ArrowRight className="ml-2" />
                        </Link>
                     </Button>
                </div>
            </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
