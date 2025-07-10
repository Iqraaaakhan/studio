import { GraduationCap } from 'lucide-react';

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <GraduationCap className="h-8 w-8 text-primary" />
      <h1 className="text-2xl font-bold text-foreground font-headline">DigiDisha</h1>
    </div>
  );
}
