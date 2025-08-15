"use client";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LayoutDashboard } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function Home() {
  const { t } = useI18n();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{t('home.title')}</h1>
        
        <SignedOut>
          <div className="mb-8">
            <p className="text-lg text-gray-600 mb-6">{t('home.signedOutLead')}</p>
            <Card className="max-w-md mx-auto bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-900">{t('home.getStarted')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700">{t('home.getStartedDesc')}</p>
              </CardContent>
            </Card>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="mb-8">
            <p className="text-lg text-gray-600 mb-6">{t('home.welcomeBack')}</p>
            <div className="mb-6">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/dashboard">
                      <Button size="lg" className="px-8 py-3" aria-label={t('home.goToDashboard')}>
                        <LayoutDashboard className="w-5 h-5" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>{t('home.goToDashboard')}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">{t('home.createCardsTitle')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{t('home.createCardsDesc')}</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">{t('home.studyModeTitle')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{t('home.studyModeDesc')}</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">{t('home.trackProgressTitle')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{t('home.trackProgressDesc')}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </SignedIn>
      </div>
    </div>
  );
}
