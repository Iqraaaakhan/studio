'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Award, CheckCircle, Share2, Download, ShieldCheck } from 'lucide-react';
import Logo from '@/components/app/logo';
import { Button } from '@/components/ui/button';

const truncateHash = (hash: string, start: number = 6, end: number = 4) => {
    if (!hash) return '';
    return `${hash.substring(0, start)}...${hash.substring(hash.length - end)}`;
}

const earnedCertificates = [
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
];

export default function CertificatesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold font-headline tracking-tight">Your Verifiable Credentials</h2>
        <p className="text-muted-foreground">
          A collection of your blockchain-secured achievements. Immutable and globally recognized.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
        {earnedCertificates.length > 0 ? (
          earnedCertificates.map((cert, index) => (
            <Card key={index} className="bg-card border-2 border-primary/50 shadow-lg overflow-hidden group">
              <div className="p-1 bg-gradient-to-r from-accent to-primary"></div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <Logo />
                  <div className="text-right">
                    <ShieldCheck className="h-10 w-10 text-primary" />
                    <p className="text-xs text-muted-foreground mt-1">Verified on-chain</p>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Certificate of Completion</p>
                  <h3 className="text-2xl md:text-3xl font-bold font-headline text-foreground mt-4">{cert.title}</h3>
                  <p className="mt-6 text-lg text-muted-foreground">is hereby awarded to</p>
                  <p className="text-xl md:text-2xl font-headline font-semibold mt-2 text-primary">Valued User</p>
                </div>

                <div className="mt-8 text-sm text-muted-foreground space-y-4">
                   <div className="flex justify-between items-center">
                     <span className="font-semibold">Date Issued</span>
                     <span>{cert.date}</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="font-semibold">Verification Tx</span>
                     <a 
                        href="#" 
                        className="font-mono text-primary hover:underline"
                        title={cert.transactionHash}
                    >
                        {truncateHash(cert.transactionHash)}
                    </a>
                   </div>
                </div>
                
                <div className="mt-8 flex gap-2">
                    <Button variant="outline" className="w-full">
                        <Share2 className="mr-2" /> Share
                    </Button>
                    <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                        <Download className="mr-2" /> Download
                    </Button>
                </div>

              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full py-12">
            <CardContent className="text-center">
              <Award className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No Certificates Yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Complete learning modules to earn your first verifiable certificate.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
