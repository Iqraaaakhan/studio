import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smartphone, BarChart2, MessageSquare, PenTool } from 'lucide-react';
import Image from 'next/image';

const learningModules = [
  {
    title: 'Digital Literacy Basics',
    description: 'Learn to use smartphones and essential apps for daily tasks.',
    icon: <Smartphone className="h-8 w-8 text-primary" />,
    image: { src: 'https://placehold.co/600x400.png', hint: 'person using phone' },
  },
  {
    title: 'Financial Management',
    description: 'Understand budgeting, savings, and digital payment methods.',
    icon: <BarChart2 className="h-8 w-8 text-primary" />,
    image: { src: 'https://placehold.co/600x400.png', hint: 'charts graphs' },
  },
  {
    title: 'Effective Communication',
    description: 'Improve your communication skills for better job prospects.',
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    image: { src: 'https://placehold.co/600x400.png', hint: 'people talking' },
  },
  {
    title: 'Vocational Skills: Tailoring',
    description: 'Master the basics of tailoring and dressmaking.',
    icon: <PenTool className="h-8 w-8 text-primary" />,
    image: { src: 'https://placehold.co/600x400.png', hint: 'sewing machine' },
  },
];

export default function LearningPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold font-headline tracking-tight">Adaptive Micro-Learning</h2>
        <p className="text-muted-foreground">
          Bite-sized modules to help you learn new skills, anytime, anywhere.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {learningModules.map((module, index) => (
          <Card key={index} className="flex flex-col overflow-hidden">
            <div className="relative h-40 w-full">
              <Image 
                src={module.image.src} 
                alt={module.title}
                layout="fill"
                objectFit="cover"
                data-ai-hint={module.image.hint}
              />
            </div>
            <CardHeader>
              <div className="flex items-start gap-4">
                {module.icon}
                <div className="flex-1">
                  <CardTitle className="text-lg font-headline">{module.title}</CardTitle>
                  <CardDescription className="mt-1">{module.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Start Learning</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
