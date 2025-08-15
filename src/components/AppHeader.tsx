"use client";

import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useI18n } from '@/lib/i18n';

export function AppHeader() {
  const { t } = useI18n();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">
              <Link href="/dashboard">{t('common.appName')}</Link>
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <SignedOut>
              <SignInButton>
                <Button variant="outline">{t('common.signIn')}</Button>
              </SignInButton>
              <SignUpButton>
                <Button>{t('common.signUp')}</Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}


