import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { decksTable, cardsTable } from '@/db/schema';
import { eq, count, desc } from 'drizzle-orm';
import { DeckCard } from '@/components/DeckCard';
import { CreateDeckDialog } from '@/components/CreateDeckDialog';

export default async function DashboardPage() {
  // Check authentication
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/');
  }

  // Fetch user's decks with card counts
  const userDecksWithCounts = await db
    .select({
      id: decksTable.id,
      title: decksTable.title,
      description: decksTable.description,
      userId: decksTable.userId,
      createdAt: decksTable.createdAt,
      updatedAt: decksTable.updatedAt,
      cardCount: count(cardsTable.id),
    })
    .from(decksTable)
    .leftJoin(cardsTable, eq(decksTable.id, cardsTable.deckId))
    .where(eq(decksTable.userId, userId))
    .groupBy(decksTable.id)
    .orderBy(desc(decksTable.updatedAt));

  // Calculate deck count for display
  const totalDecks = userDecksWithCounts.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Manage your flashcard decks and track your learning progress
            </p>
          </div>
          {totalDecks > 0 && <CreateDeckDialog />}
        </div>

        {/* Decks Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Your Decks</h2>
            {totalDecks > 0 && (
              <span className="text-sm text-gray-500">{totalDecks} deck{totalDecks !== 1 ? 's' : ''}</span>
            )}
          </div>

          {totalDecks === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No decks yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Create your first flashcard deck to start learning!
                </p>
                <CreateDeckDialog />
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {userDecksWithCounts.map((deck) => (
                <DeckCard key={deck.id} deck={deck} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
