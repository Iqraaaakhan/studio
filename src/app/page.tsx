'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Image from 'next/image';

function LanguageSwitcher() {
  const [language, setLanguage] = useState('en');

  return (
    <div className="w-32">
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className="bg-transparent border-muted-foreground text-foreground">
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
    <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
      <CardHeader className="items-center">
        <div className="p-4 bg-primary/20 rounded-full">
          {icon}
        </div>
        <CardTitle className="font-headline text-xl mt-4">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center text-muted-foreground">
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

  const handleStartAssessment = () => {
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
            <LanguageSwitcher />
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
        <section className="relative py-20 md:py-32">
            <div className="container grid lg:grid-cols-2 gap-12 items-center">
                <div className="text-center lg:text-left">
                    <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter">
                        Unlock Your True Potential
                    </h1>
                    <p className="mt-6 max-w-xl mx-auto lg:mx-0 text-lg text-muted-foreground">
                        Discover your innate talents with our quick, fun AI-powered assessment and unlock job opportunities tailored just for you.
                    </p>
                    <div className="mt-8 flex justify-center lg:justify-start">
                        <Button size="lg" onClick={handleStartAssessment} className="bg-accent text-accent-foreground hover:bg-accent/90">
                            Start Your Journey <ArrowRight className="ml-2" />
                        </Button>
                    </div>
                </div>
                 <div className="relative mx-auto max-w-2xl lg:max-w-none">
                    <Carousel className="w-full">
                        <CarouselContent>
                            {carouselImages.map((image, index) => (
                            <CarouselItem key={index}>
                                <div className="p-1">
                                <Card>
                                    <CardContent className="flex aspect-video items-center justify-center p-0 overflow-hidden rounded-lg">
                                        <Image 
                                            src={image.src} 
                                            alt={image.alt} 
                                            width={1200} 
                                            height={800} 
                                            className="object-cover" 
                                            data-ai-hint={image.hint} 
                                        />
                                    </CardContent>
                                </Card>
                                </div>
                            </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-2" />
                        <CarouselNext className="right-2"/>
                    </Carousel>
                </div>
            </div>
        </section>

        <section id="features" className="py-20 md:py-32 bg-secondary/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">How SkillBridge Works</h2>
              <p className="mt-4 max-w-xl mx-auto text-muted-foreground">A simple, powerful path to your future career.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                <FeatureCard 
                    icon={<BrainCircuit className="size-8 text-primary" />}
                    title="Gamified Assessment"
                    description="A mobile-first, vernacular-language test that identifies innate talents, presented as a fun game."
                />
                <FeatureCard 
                    icon={<Briefcase className="size-8 text-primary" />}
                    title="AI Job Mapping"
                    description="Our AI maps your aptitude profile against a real-time database of local and remote job demands."
                />
                <FeatureCard 
                    icon={<GraduationCap className="size-8 text-primary" />}
                    title="Adaptive Micro-Learning"
                    description="Bite-sized modules that work on any smartphone, even with patchy internet, to build skills for your matched jobs."
                />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-border/40">
        <div className="container text-center text-muted-foreground text-sm">
            © {new Date().getFullYear()} SkillBridge. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
