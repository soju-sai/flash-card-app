import { auth } from '@clerk/nextjs/server';
import { redirect, notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { decksTable, cardsTable } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import StudyInterface from '@/components/StudyInterface';
import { Trans } from '@/components/Trans';

interface StudyPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function StudyPage({ params }: StudyPageProps) {
  // Check authentication
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/');
  }

  const { id } = await params;
  const deckId = parseInt(id);
  
  if (isNaN(deckId)) {
    notFound();
  }

  // Fetch deck with its cards
  const [deck] = await db
    .select()
    .from(decksTable)
    .where(and(
      eq(decksTable.id, deckId),
      eq(decksTable.userId, userId)
    ));

  if (!deck) {
    notFound();
  }

  // Fetch cards for this deck
  const cards = await db
    .select()
    .from(cardsTable)
    .where(eq(cardsTable.deckId, deckId))
    .orderBy(cardsTable.createdAt);

  if (cards.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
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
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2"><Trans k="study.noCardsTitle" /></h1>
          <p className="text-gray-600 mb-6"><Trans k="study.noCardsDesc" /></p>
          <a
            href={`/deck/${deckId}`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Trans k="study.backToDeck" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StudyInterface deck={deck} cards={cards} />
    </div>
  );
}
