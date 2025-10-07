'use client';

import { useAppSelector } from '@/store/hooks';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

import type { RootState } from '@/store/store';

export default function MainLayout({ children }: MainLayoutProps) {
  const isAuthenticated = useAppSelector((state: RootState) => state.auth.isAuthenticated);
  const hasHydrated = useAppSelector((state: RootState) => state.auth.hasHydrated);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex">
        {hasHydrated && isAuthenticated && <Sidebar />}
        
        <main className={`flex-1 lg:ml-[200px]`}>
          {isHomePage ? (
            children
          ) : (
            <div className="p-2">
              {children}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}