
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Handshake, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const mentors = [
  {
    name: 'Aarav Sharma',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'man portrait',
    title: 'Digital Marketing Expert',
    expertise: ['Social Media', 'SEO', 'Content Creation'],
    description: '10+ years of experience helping small businesses grow their online presence. Passionate about empowering rural entrepreneurs.',
  },
  {
    name: 'Priya Patel',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'woman portrait',
    title: 'Handicrafts & E-commerce Guru',
    expertise: ['Etsy', 'Shopify', 'Product Photography'],
    description: 'Turned my passion for local handicrafts into a successful online brand. I can help you do the same.',
  },
  {
    name: 'Vikram Singh',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'man portrait professional',
    title: 'Financial Literacy Coach',
    expertise: ['Budgeting', 'Micro-loans', 'Digital Payments'],
    description: 'A former bank manager dedicated to improving financial literacy and helping you manage your money effectively.',
  },
   {
    name: 'Anika Reddy',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'woman portrait professional',
    title: 'Vocational Skills Trainer',
    expertise: ['Tailoring', 'Beauty Services', 'Customer Relations'],
    description: 'Certified vocational trainer with a focus on practical skills that lead to immediate employment opportunities.',
  },
];

export default function MentorshipPage() {
  const { toast } = useToast();

  const handleRequestMentorship = (mentorName: string) => {
    toast({
      title: 'Mentorship Request Sent!',
      description: `Your request to connect with ${mentorName} has been sent. They will reach out to you soon.`,
    });
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold font-headline tracking-tight flex items-center">
          <Handshake className="mr-3 text-primary" /> Mentorship Hub
        </h2>
        <p className="text-muted-foreground">
          Connect with experienced professionals to guide you on your career journey.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {mentors.map((mentor) => (
          <Card key={mentor.name} className="flex flex-col">
            <CardHeader className="items-center text-center">
              <Avatar className="h-24 w-24 mb-4 border-4 border-primary/50">
                <AvatarImage src={mentor.avatar} alt={mentor.name} data-ai-hint={mentor.dataAiHint} />
                <AvatarFallback>{mentor.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <CardTitle className="font-headline text-xl">{mentor.name}</CardTitle>
              <CardDescription>{mentor.title}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                {mentor.description}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {mentor.expertise.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleRequestMentorship(mentor.name)}>
                <MessageCircle className="mr-2" /> Request Mentorship
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
