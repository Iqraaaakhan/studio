
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { LayoutDashboard, Briefcase, GraduationCap, Award, Home, Handshake } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: <Home /> },
  { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard /> },
  { href: '/dashboard/jobs', label: 'Job Matching', icon: <Briefcase /> },
  { href: '/dashboard/learning', label: 'Learning', icon: <GraduationCap /> },
  { href: '/dashboard/mentorship', label: 'Mentorship', icon: <Handshake /> },
  { href: '/dashboard/certificates', label: 'Credentials', icon: <Award /> },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            className="data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
            tooltip={item.label}
          >
            <Link href={item.href}>
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
