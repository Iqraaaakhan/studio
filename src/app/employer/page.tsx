'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, UserCheck, CheckCircle } from 'lucide-react';
import Link from 'next/link';

// This is a FAKE search result for demo purposes
const fakeCandidate = {
  name: "Priya Sharma",
  location: "Bijnor, Uttar Pradesh",
  skills: ["Digital Marketing", "Content Creation", "Social Media Management"],
  aptitudeProfile: "A highly creative and proactive individual with excellent communication skills. Eager to apply digital skills in a practical setting.",
  verifiedCredentials: [
    { name: "Aptitude Assessment Completion", verified: true },
    { name: "Social Media Marketing Basics", verified: true }
  ]
};

export default function EmployerPortalPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (searchQuery) {
      setSearched(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-primary">Employer Portal</h1>
            <Button variant="outline" asChild><Link href="/">Back to Main Site</Link></Button>
        </div>
        <p className="text-lg text-muted-foreground mb-8">Find verified, skilled, and motivated talent from rural India.</p>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search for Talent</CardTitle>
            <CardDescription>Enter a skill or location to find qualified candidates.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input 
                type="text" 
                placeholder="e.g., 'Graphic Design' or 'Jaipur'"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button onClick={handleSearch}>
                <Search className="mr-2 h-4 w-4" /> Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {searched && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Search Results for "{searchQuery}"</h2>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <UserCheck /> {fakeCandidate.name}
                            </CardTitle>
                            <CardDescription>{fakeCandidate.location}</CardDescription>
                        </div>
                        <Button>Contact Candidate</Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2">Skills:</h4>
                        <div className="flex flex-wrap gap-2">
                            {fakeCandidate.skills.map(skill => <Badge key={skill}>{skill}</Badge>)}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">AI Aptitude Summary:</h4>
                        <p className="text-muted-foreground italic">"{fakeCandidate.aptitudeProfile}"</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Verifiable Credentials:</h4>
                        <ul className="list-none space-y-1">
                          {fakeCandidate.verifiedCredentials.map(cred => (
                            <li key={cred.name} className="flex items-center gap-2 text-green-600 dark:text-green-400">
                              <CheckCircle className="h-4 w-4" /> {cred.name} (Verified)
                            </li>
                          ))}
                        </ul>
                    </div>
                </CardContent>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}