'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, GraduationCap, Award, ArrowRight, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function DashboardPage() {
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
          setAptitudeProfile(docSnap.data().aptitudeProfile || null);
        }
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold font-headline tracking-tight">Dashboard</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold font-headline flex items-center gap-2">
              <Sparkles className="text-primary" />
              Your AI-Powered Aptitude Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2 pt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : aptitudeProfile ? (
              <p className="text-sm text-muted-foreground pt-4">{aptitudeProfile}</p>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground mb-4">Complete the assessment to reveal your profile.</p>
                <Button asChild>
                  <Link href="/assessment">Take Assessment</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Quick Actions</CardTitle>
            <CardDescription>Continue your journey.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/jobs">
                <Briefcase className="mr-2" /> Find Job Matches
                <ArrowRight className="ml-auto" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/learning">
                <GraduationCap className="mr-2" /> Explore Learning
                <ArrowRight className="ml-auto" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/certificates">
                <Award className="mr-2" /> View Certificates
                <ArrowRight className="ml-auto" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
