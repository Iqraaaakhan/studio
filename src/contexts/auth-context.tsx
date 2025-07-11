
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const AuthGuard = ({ children }: { children: ReactNode }) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isCheckingProfile, setIsCheckingProfile] = useState(true);

    useEffect(() => {
        if (loading) return; // Wait until Firebase auth state is loaded

        const isAuthPage = pathname === '/login' || pathname === '/signup';

        if (!user && !isAuthPage) {
            router.push('/login');
            setIsCheckingProfile(false);
            return;
        }

        if (user) {
            if(isAuthPage) {
                router.push('/dashboard');
                setIsCheckingProfile(false);
                return;
            }

            // If user is logged in, check for aptitude profile
            const checkProfile = async () => {
                const userDocRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(userDocRef);
                if (docSnap.exists() && !docSnap.data().aptitudeProfile) {
                    if (pathname !== '/assessment') {
                        router.push('/assessment');
                    }
                }
                setIsCheckingProfile(false);
            }
            checkProfile();
        } else {
             setIsCheckingProfile(false);
        }

    }, [user, loading, router, pathname]);

    if (loading || isCheckingProfile) {
        return (
             <div className="flex min-h-screen flex-col items-center justify-center bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        )
    }

    return <>{children}</>;
};
