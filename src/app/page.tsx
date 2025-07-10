'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BrainCircuit, Briefcase, GraduationCap } from 'lucide-react';
import Logo from '@/components/app/logo';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Image from 'next/image';
import Autoplay from "embla-carousel-autoplay"

function LanguageSwitcher({ onLanguageChange, value }: { onLanguageChange: (lang: string) => void; value: string }) {
  return (
    <div className="w-32">
      <Select value={value} onValueChange={onLanguageChange}>
        <SelectTrigger className="bg-background/80 border-border text-foreground">
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

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-primary/20 text-center">
      <CardHeader className="items-center">
        <div className="p-4 bg-primary/20 rounded-full text-primary">
          {icon}
        </div>
        <CardTitle className="font-headline text-xl mt-4">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground">
        {description}
      </CardContent>
    </Card>
  )
}

const carouselImages = [
    { src: "https://placehold.co/1200x800.png", alt: "Women learning vocational skills", hint: "women learning" },
    { src: "https://placehold.co/1200x800.png", alt: "Young person using a laptop in a rural setting", hint: "rural technology" },
    { src: "https://placehold.co/1200x800.png", alt: "Community group working together on a project", hint: "community project" },
    { src: "https://placehold.co/1200x800.png", alt: "A person receiving a certificate of completion", hint: "certificate achievement" }
];

export default function HomePage() {
  const router = useRouter();
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

  const handleStartAssessment = () => {
    // The language is already saved in localStorage by handleLanguageChange
    router.push('/assessment');
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Logo />
            </Link>
          </div>
          <nav className="flex-1 items-center space-x-6 text-sm font-medium hidden md:flex">
            <Link href="#features" className="text-muted-foreground transition-colors hover:text-foreground">Features</Link>
            <Link href="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">Dashboard</Link>
          </nav>
          <div className="flex items-center justify-end space-x-4 flex-1">
            <LanguageSwitcher onLanguageChange={handleLanguageChange} value={language} />
            <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="hidden sm:inline-flex bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/signup">Get Started <ArrowRight className="ml-2" /></Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center text-white overflow-hidden">
            <Carousel 
                className="absolute inset-0 w-full h-full"
                plugins={[
                    Autoplay({
                      delay: 5000,
                    }),
                ]}
                opts={{ loop: true }}
            >
                <CarouselContent className="h-full">
                    {carouselImages.map((image, index) => (
                    <CarouselItem key={index} className="h-full">
                        <div className="relative w-full h-full">
                            <Image 
                                src={image.src} 
                                alt={image.alt} 
                                layout="fill"
                                objectFit="cover"
                                className="object-cover" 
                                data-ai-hint={image.hint} 
                            />
                            <div className="absolute inset-0 bg-black/50" />
                        </div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            <div className="relative container text-center z-10">
                <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter">
                    Unlock Your True Potential
                </h1>
                <p className="mt-6 max-w-xl mx-auto text-lg text-gray-200">
                    Discover your innate talents with our quick, fun AI-powered assessment and unlock job opportunities tailored just for you.
                </p>
                <div className="mt-8">
                    <Button size="lg" onClick={handleStartAssessment} className="bg-accent text-accent-foreground hover:bg-accent/90">
                        Start Your Journey <ArrowRight className="ml-2" />
                    </Button>
                </div>
            </div>
        </section>

        <section id="features" className="py-20 md:py-32 bg-secondary">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">How DigiDisha Works</h2>
              <p className="mt-4 max-w-xl mx-auto text-muted-foreground">A simple, powerful path to your future career.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                <FeatureCard 
                    icon={<BrainCircuit className="size-8" />}
                    title="Gamified Assessment"
                    description="A mobile-first, vernacular-language test that identifies innate talents, presented as a fun game."
                />
                <FeatureCard 
                    icon={<Briefcase className="size-8" />}
                    title="AI Job Mapping"
                    description="Our AI maps your aptitude profile against a real-time database of local and remote job demands."
                />
                <FeatureCard 
                    icon={<GraduationCap className="size-8" />}
                    title="Adaptive Micro-Learning"
                    description="Bite-sized modules that work on any smartphone, even with patchy internet, to build skills for your matched jobs."
                />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-border/40">
        <div className="container text-center text-muted-foreground text-sm">
            © {new Date().getFullYear()} DigiDisha. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
