
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { jobMapping, type JobMappingOutput } from '@/ai/flows/job-mapping';
import { generateJobDescription } from '@/ai/flows/job-description-generation';
import { Sparkles, Loader2, MapPin, Globe, Building, Briefcase } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

type Job = JobMappingOutput['localOpportunities'][0] | JobMappingOutput['remoteOpportunities'][0];

const JobCard = ({ job, onApplyClick }: { job: Job; onApplyClick: (job: Job) => void }) => (
  <Card className="flex flex-col">
    <CardHeader>
      <CardTitle className="text-lg flex items-center gap-2">
        <Briefcase className="text-primary" /> {job.title}
      </CardTitle>
      <CardDescription className="flex items-center gap-2 pt-1">
        <Building className="size-4" /> {job.company}{' '}
        {'location' in job && job.location ? ` - ${job.location}` : ''}
      </CardDescription>
    </CardHeader>
    <CardContent className="flex-grow">
      <p className="text-sm text-muted-foreground line-clamp-3">{job.description}</p>
    </CardContent>
    <CardFooter>
      <Button className="w-full" onClick={() => onApplyClick(job)}>
        View & Apply
      </Button>
    </CardFooter>
  </Card>
);

export default function JobMappingPage() {
  const [aptitudeProfile, setAptitudeProfile] = useState<string | null>(null);
  const [jobOpportunities, setJobOpportunities] = useState<JobMappingOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [detailedDescription, setDetailedDescription] = useState('');
  const [isDescriptionLoading, setIsDescriptionLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setAptitudeProfile(docSnap.data().aptitudeProfile || null);
        }
      }
    };
    fetchProfile();
  }, [user]);

  const handleFindJobs = async () => {
    if (!aptitudeProfile) {
      setError('Please complete the aptitude assessment first to get job recommendations.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setJobOpportunities(null);
    try {
      const result = await jobMapping({ aptitudeProfile });
      setJobOpportunities(result);
    } catch (err) {
      setError('An error occurred while fetching job opportunities. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyClick = async (job: Job) => {
    setSelectedJob(job);
    setIsDialogOpen(true);
    setIsDescriptionLoading(true);
    setDetailedDescription('');
    try {
      const result = await generateJobDescription({
        jobTitle: job.title,
        industryTrends: 'Current trends in the digital economy and local manufacturing.',
        requiredSkills: 'Based on user aptitude profile, focus on digital literacy, communication, and basic vocational skills.',
      });
      setDetailedDescription(result.jobDescription);
    } catch (err) {
      console.error('Error generating detailed description:', err);
      setDetailedDescription(job.description + "\n\n(Could not load full description.)");
    } finally {
      setIsDescriptionLoading(false);
    }
  };

  const handleConfirmApply = () => {
    setIsDialogOpen(false);
    toast({
        title: "Application Submitted!",
        description: `Your application for ${selectedJob?.title} has been sent.`,
    });
    setSelectedJob(null);
  }

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
              <Link href="/assessment">Take Assessment</Link>
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
            <TabsTrigger value="local">
              <MapPin className="mr-2" /> Local Opportunities
            </TabsTrigger>
            <TabsTrigger value="remote">
              <Globe className="mr-2" /> Remote Opportunities
            </TabsTrigger>
          </TabsList>
          <TabsContent value="local" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {jobOpportunities.localOpportunities.length > 0 ? (
                jobOpportunities.localOpportunities.map((job, index) => (
                  <JobCard key={`local-${index}`} job={job} onApplyClick={handleApplyClick} />
                ))
              ) : (
                <p className="text-muted-foreground col-span-full">No local jobs found matching your profile.</p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="remote" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {jobOpportunities.remoteOpportunities.length > 0 ? (
                jobOpportunities.remoteOpportunities.map((job, index) => (
                  <JobCard key={`remote-${index}`} job={job} onApplyClick={handleApplyClick} />
                ))
              ) : (
                <p className="text-muted-foreground col-span-full">No remote jobs found matching your profile.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline">{selectedJob?.title}</DialogTitle>
            <DialogDescription>
              {selectedJob?.company} {'location' in (selectedJob || {}) && (selectedJob as any).location ? `- ${(selectedJob as any).location}` : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
            <h4 className="font-semibold">Job Description</h4>
            {isDescriptionLoading ? (
                <div className="space-y-2">
                    <Loader2 className="animate-spin" />
                    <p>Generating detailed description with AI...</p>
                </div>
            ) : (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{detailedDescription}</p>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleConfirmApply}>
              Apply Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
