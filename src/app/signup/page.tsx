'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import Logo from '@/components/app/logo';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === '') {
      toast({
        variant: 'destructive',
        title: 'Name is required',
        description: 'Please enter your name.',
      });
      return;
    }
    setLoading(true);
    try {
      // Create a dummy user for "Sapna"
      if (email === 'sapna@example.com') {
          await setDoc(doc(db, "users", 'dummy-sapna-uid'), {
          email: 'sapna@example.com',
          name: 'Sapna',
          createdAt: new Date(),
          aptitudeProfile: "Sapna is a highly motivated individual with a natural aptitude for creative problem-solving and a strong desire to learn practical skills. Her assessment indicates a high level of visual-spatial reasoning, making her an excellent candidate for design-oriented vocations. She is also diligent and detail-oriented, with a collaborative spirit. Key strengths include creativity, attention to detail, and a proactive learning attitude. She would excel in roles that involve craftsmanship, design, and financial management.",
          certificates: [
            {
              title: 'Digital Literacy Basics',
              date: 'May 20, 2024',
              transactionHash: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f'
            },
            {
              title: 'Financial Management',
              date: 'June 15, 2024',
              transactionHash: '0x9f8e7d6c5b4a39281706f5e4d3c2b1a0f9e8d7c6b5a49382710f9e8d7c6b5a49'
            },
          ]
        });
      }


      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        name: name,
        createdAt: new Date(),
        aptitudeProfile: null,
        certificates: [],
      });

      toast({
        title: 'Account Created!',
        description: `Welcome, ${name}! Taking you to the assessment...`,
      });
      // AuthGuard will handle the redirect
    } catch (error: any) {
      let description = error.message;
      if (error.code === 'auth/email-already-in-use') {
        description = 'This email is already registered. Please log in instead.';
      }
      toast({
        variant: 'destructive',
        title: 'Sign-up Failed',
        description: description,
      });
    } finally {
      setLoading(false);
    }
  };

  const createSapnaUser = async () => {
    setLoading(true);
    try {
        // This is a 'fake' user ID, but we need it to associate the doc.
        // In a real scenario, you'd use the actual auth UID.
        const sapnaUID = "dummy-sapna-uid-12345";
        
        await setDoc(doc(db, "users", sapnaUID), {
          email: "sapna@example.com",
          name: "Sapna",
          createdAt: new Date(),
          aptitudeProfile: "Sapna is a highly motivated individual with a natural aptitude for creative problem-solving and a strong desire to learn practical skills. Her assessment indicates a high level of visual-spatial reasoning, making her an excellent candidate for design-oriented vocations. She is also diligent and detail-oriented, with a collaborative spirit. Key strengths include creativity, attention to detail, and a proactive learning attitude. She would excel in roles that involve craftsmanship, design, and financial management.",
          certificates: [
            {
              title: 'Digital Literacy Basics',
              date: 'May 20, 2024',
              transactionHash: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f'
            },
            {
              title: 'Financial Management',
              date: 'June 15, 2024',
              transactionHash: '0x9f8e7d6c5b4a39281706f5e4d3c2b1a0f9e8d7c6b5a49382710f9e8d7c6b5a49'
            },
          ]
        });

        await createUserWithEmailAndPassword(auth, 'sapna@example.com', 'password123');

        toast({
          title: "Sapna's Demo User Created",
          description: "You can now log in as sapna@example.com",
        });
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        toast({
          variant: 'default',
          title: "Demo User Exists",
          description: "Sapna's demo account is ready. You can log in.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to create demo user",
          description: error.message,
        });
      }
    } finally {
        setLoading(false);
    }
  }


  if (authLoading || user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-secondary p-4 sm:p-8">
      <div className="absolute top-6 left-6">
        <Link href="/" aria-label="Back to Home">
          <Logo />
        </Link>
      </div>
      <Card className="w-full max-w-sm shadow-2xl border-border/50 bg-background">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
          <CardDescription>Join DigiDisha and unlock your potential</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Sapna Devi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-purple-500 text-primary-foreground hover:opacity-90 shadow-lg"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign Up
            </Button>
          </form>
           <Button variant="link" onClick={createSapnaUser} className="w-full mt-2" disabled={loading}>
                Create Sapna's Demo User
            </Button>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
