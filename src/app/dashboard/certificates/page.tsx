import { Card, CardContent } from '@/components/ui/card';
import { Award, CheckCircle } from 'lucide-react';
import Logo from '@/components/app/logo';

const earnedCertificates = [
  {
    title: 'Certificate of Completion: Digital Literacy Basics',
    date: 'Issued on: May 20, 2024',
  },
  {
    title: 'Certificate of Achievement: Financial Management',
    date: 'Issued on: June 15, 2024',
  },
];

export default function CertificatesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold font-headline tracking-tight">Your Certificates</h2>
        <p className="text-muted-foreground">
          A collection of your earned credentials and achievements.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {earnedCertificates.length > 0 ? (
          earnedCertificates.map((cert, index) => (
            <Card key={index} className="bg-white border-2 border-primary shadow-lg relative">
              <CardContent className="p-8 text-center aspect-[1.414/1] flex flex-col justify-between">
                <div className="absolute top-4 left-4">
                  <Logo />
                </div>
                <div className="absolute top-6 right-6">
                  <Award className="h-16 w-16 text-yellow-400" />
                </div>

                <div className="mt-24">
                  <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Certificate of Completion</p>
                  <h3 className="text-3xl font-bold font-headline text-primary mt-4">{cert.title.split(': ')[1]}</h3>
                  <p className="mt-8 text-lg">is hereby awarded to</p>
                  <p className="text-2xl font-headline font-semibold mt-2">Valued User</p>
                </div>

                <div className="flex justify-between items-end mt-12 text-sm text-muted-foreground">
                   <div className="text-left">
                     <p className="font-semibold border-t-2 pt-1 border-foreground">SkillBridge Authorized</p>
                     <p>Verification ID: SB-CERT-{1024 + index}</p>
                   </div>
                   <div className="text-right">
                     <p className="font-semibold border-t-2 pt-1 border-foreground">{cert.date}</p>
                     <p>Date of Issue</p>
                   </div>
                </div>

                <div className="absolute inset-0 border-[10px] border-secondary m-2 rounded-md pointer-events-none"></div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full py-12">
            <CardContent className="text-center">
              <Award className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No Certificates Yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Complete learning modules to earn your first certificate.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
