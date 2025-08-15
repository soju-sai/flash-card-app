import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LayoutDashboard } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Welcome to Flash Card
        </h1>
        
        <SignedOut>
          <div className="mb-8">
            <p className="text-lg text-gray-600 mb-6">
              Learn efficiently with interactive flash cards. Sign in to get started!
            </p>
            <Card className="max-w-md mx-auto bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-900">
                  Get Started
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700">
                  Create an account or sign in to start creating and studying your flash cards.
                </p>
              </CardContent>
            </Card>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="mb-8">
            <p className="text-lg text-gray-600 mb-6">
              Welcome back! Ready to continue your learning journey?
            </p>
            <div className="mb-6">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/dashboard">
                      <Button size="lg" className="px-8 py-3" aria-label="Go to Dashboard">
                        <LayoutDashboard className="w-5 h-5" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    Go to Dashboard
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">
                    Create Cards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Build your own flash card decks for any subject.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">
                    Study Mode
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Practice with your cards using our smart study system.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">
                    Track Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Monitor your learning progress and achievements.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </SignedIn>
      </div>
    </div>
  );
}
