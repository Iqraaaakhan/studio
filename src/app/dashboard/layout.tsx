'use client';

import type { ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import Logo from '@/components/app/logo';
import { SidebarNav } from '@/components/app/sidebar-nav';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, LogOut } from 'lucide-react';
import { AuthGuard, useAuth } from '@/contexts/auth-context';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

function LanguageSwitcher() {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('selectedLanguage', lang);
  }

  return (
    <div className="w-32">
      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="bg-card h-9">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="hi">हिंदी</SelectItem>
          <SelectItem value="kn">ಕನ್ನಡ</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function TopBar() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
            <div className="mr-4 hidden md:flex">
                <SidebarTrigger />
            </div>
            <div className="flex flex-1 items-center justify-end space-x-4">
                <LanguageSwitcher />
                 <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="https://placehold.co/40x40.png" alt="User" data-ai-hint="person portrait" />
                      <AvatarFallback>{user?.email?.[0].toUpperCase() ?? 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-col hidden sm:flex">
                      <span className="text-sm font-medium">{user?.email}</span>
                      <Button variant="ghost" size="sm" onClick={handleLogout} className="h-auto p-0 justify-start text-xs text-muted-foreground">
                        <LogOut className="mr-1 h-3 w-3" />
                        Logout
                      </Button>
                    </div>
                  </div>
            </div>
        </div>
    </header>
  )
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarNav />
          </SidebarContent>
          <SidebarFooter>
            <Button variant="outline" asChild>
              <Link href="/">
                Back to Home <ArrowRight className="ml-auto" />
              </Link>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="min-h-screen flex flex-col bg-background">
            <TopBar />
            <div className="flex-1">{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
