'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { jobMapping, type JobMappingOutput } from '@/ai/flows/job-mapping';
import { Sparkles, Loader2, MapPin, Globe } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

type Job = JobMappingOutput['localOpportunities'][0] | JobMappingOutput['remoteOpportunities'][0];

const JobCard = ({ job }: { job: Job }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">{job.title}</CardTitle>
      <CardDescription>{job.company} {('location' in job && job.location) ? `- ${job.location}` : ''}</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground line-clamp-3">{job.description}</p>
    </CardContent>
  </Card>
);

export default function JobMappingPage() {
  const [aptitudeProfile, setAptitudeProfile] = useState<string | null>(null);
  const [jobOpportunities, setJobOpportunities] = useState<JobMappingOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const profile = localStorage.getItem('aptitudeProfile');
      setAptitudeProfile(profile);
    }
  }, []);

  const handleFindJobs = async () => {
    if (!aptitudeProfile) {
      setError("Please complete the aptitude assessment first to get job recommendations.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setJobOpportunities(null);
    try {
      const result = await jobMapping({ aptitudeProfile });
      setJobOpportunities(result);
    } catch (err) {
      setError("An error occurred while fetching job opportunities. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold font-headline tracking-tight">AI Job Matching</h2>
        <p className="text-muted-foreground">
          Let our AI find the best job opportunities based on your unique aptitude profile.
        </p>
      </div>
      
      {!aptitudeProfile ? (
        <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertTitle>Profile Not Found</AlertTitle>
            <AlertDescription>
                We couldn't find your aptitude profile. Please complete the assessment to unlock job matching.
                <Button asChild variant="link" className="p-1 h-auto">
                    <Link href="/">Take Assessment</Link>
                </Button>
            </AlertDescription>
        </Alert>
      ) : (
        <div className="flex items-center space-x-2">
            <Button onClick={handleFindJobs} disabled={isLoading}>
            {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Sparkles className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Searching...' : 'Find My Job Matches'}
            </Button>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {jobOpportunities && (
        <Tabs defaultValue="local" className="space-y-4">
          <TabsList>
            <TabsTrigger value="local"><MapPin className="mr-2" /> Local Opportunities</TabsTrigger>
            <TabsTrigger value="remote"><Globe className="mr-2" /> Remote Opportunities</TabsTrigger>
          </TabsList>
          <TabsContent value="local" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {jobOpportunities.localOpportunities.length > 0 ? (
                jobOpportunities.localOpportunities.map((job, index) => <JobCard key={`local-${index}`} job={job} />)
              ) : <p className="text-muted-foreground col-span-full">No local jobs found matching your profile.</p>}
            </div>
          </TabsContent>
          <TabsContent value="remote" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {jobOpportunities.remoteOpportunities.length > 0 ? (
                jobOpportunities.remoteOpportunities.map((job, index) => <JobCard key={`remote-${index}`} job={job} />)
              ) : <p className="text-muted-foreground col-span-full">No remote jobs found matching your profile.</p>}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
