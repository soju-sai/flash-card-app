import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Welcome to Flash Card App
        </h1>
        
        <SignedOut>
          <div className="mb-8">
            <p className="text-lg text-gray-600 mb-6">
              Learn efficiently with interactive flash cards. Sign in to get started!
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Get Started
              </h3>
              <p className="text-blue-700">
                Create an account or sign in to start creating and studying your flash cards.
              </p>
            </div>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="mb-8">
            <p className="text-lg text-gray-600 mb-6">
              Welcome back! Ready to continue your learning journey?
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Create Cards
                </h3>
                <p className="text-gray-600">
                  Build your own flash card decks for any subject.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Study Mode
                </h3>
                <p className="text-gray-600">
                  Practice with your cards using our smart study system.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Track Progress
                </h3>
                <p className="text-gray-600">
                  Monitor your learning progress and achievements.
                </p>
              </div>
            </div>
          </div>
        </SignedIn>
      </div>
    </div>
  );
}
