'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/lib/firebase';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Award } from 'lucide-react';

interface Credential {
  courseName: string;
  issueDate: string;
  transactionHash: string;
  verificationUrl: string;
}

export default function CredentialsPage() {
  const { user } = useAuth();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const credsRef = collection(db, "users", user.uid, "credentials");
      // Use onSnapshot for real-time updates
      const unsubscribe = onSnapshot(credsRef, (querySnapshot) => {
        const credsData = querySnapshot.docs.map(doc => doc.data() as Credential);
        setCredentials(credsData);
        setLoading(false);
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    }
  }, [user]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Your Verifiable Credentials</h1>
      <p className="text-muted-foreground mb-6">A collection of your blockchain-secured achievements. Immutable and globally recognized.</p>

      {loading ? (
        <Card className="text-center py-12">
            <p>Loading your credentials...</p>
        </Card>
      ) : credentials.length > 0 ? (
        <div className="grid gap-4">
          {credentials.map((cred, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Award className="text-primary"/> {cred.courseName}</CardTitle>
                <CardDescription>Issued on: {new Date(cred.issueDate).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground break-all">Transaction Hash: {cred.transactionHash}</p>
                <Button asChild variant="outline" className="mt-4">
                  <a href={cred.verificationUrl} target="_blank" rel="noopener noreferrer">
                    Verify on Blockchain <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <Award className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-xl font-semibold">No Certificates Yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">Complete learning modules to earn your first verifiable certificate.</p>
        </Card>
      )}
    </div>
  );
}