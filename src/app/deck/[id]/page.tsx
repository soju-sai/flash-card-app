import { auth } from '@clerk/nextjs/server';
import { redirect, notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { decksTable, cardsTable } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDateHuman } from '@/lib/utils/date';
import { DeleteDeckButton } from '@/components/DeleteDeckButton';
import { DeleteCardButton } from '@/components/DeleteCardButton';
import { EditDeckDialog } from '@/components/EditDeckDialog';
import { AddCardDialog } from '@/components/AddCardDialog';
import { EditCardDialog } from '@/components/EditCardDialog';
import { ArrowLeft, Play } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { GenerateAICardsDialog } from '@/components/GenerateAICardsDialog';

interface DeckPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DeckPage({ params }: DeckPageProps) {
  // Check authentication
  const { userId, has } = await auth();
  
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

  const canUseAI = has({ feature: 'ai_deck' });

  // Fetch cards for this deck
  const cards = await db
    .select()
    .from(cardsTable)
    .where(eq(cardsTable.deckId, deckId))
    .orderBy(cardsTable.createdAt);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm" aria-label="Back to Dashboard">
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  Back to Dashboard
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">{deck.title}</h1>
              {deck.description && (
                <p className="text-gray-600">{deck.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                <span>Created {formatDateHuman(deck.createdAt)}</span>
                <span>•</span>
                <span>Updated {formatDateHuman(deck.updatedAt)}</span>
                <span>•</span>
                <Badge variant="secondary">{cards.length} cards</Badge>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto sm:justify-end">
              {cards.length > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href={`/decks/${deck.id}/study`}>
                        <Button aria-label="Study">
                          <Play className="w-4 h-4" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      Study
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {canUseAI && (
                <GenerateAICardsDialog
                  deckId={deck.id}
                  hasTitle={Boolean(deck.title)}
                  hasDescription={Boolean(deck.description)}
                />
              )}
              <EditDeckDialog deck={deck} />
              <DeleteDeckButton deckId={deck.id} deckTitle={deck.title} />
            </div>
          </div>
        </div>

        {/* Cards Section */}
        <div className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Cards</h2>
            {cards.length > 0 && <AddCardDialog deckId={deck.id} />}
          </div>

          {cards.length === 0 ? (
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
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No cards yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Add your first flashcard to start learning!
                </p>
                <AddCardDialog deckId={deck.id} />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {cards.map((card, index) => (
                <Card key={card.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-base">Card #{index + 1}</CardTitle>
                        <CardDescription className="text-xs text-gray-500">
                          Created {formatDateHuman(card.createdAt)}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-1">
                        <EditCardDialog card={card} cardNumber={index + 1} />
                        <DeleteCardButton cardId={card.id} cardNumber={index + 1} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Front</h4>
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                          <p className="text-gray-900 whitespace-pre-wrap">{card.frontSide}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Back</h4>
                        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                          <p className="text-gray-900 whitespace-pre-wrap">{card.backSide}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
