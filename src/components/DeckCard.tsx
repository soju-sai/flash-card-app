'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { deleteDeck } from '@/lib/actions/deck';
import { Deck } from '@/lib/validations/deck';
import { Trash2, Edit, Play } from 'lucide-react';
import Link from 'next/link';

interface DeckCardProps {
  deck: Deck & { cardCount: number };
}

export function DeckCard({ deck }: DeckCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{deck.title}</CardTitle>
            {deck.description && (
              <CardDescription className="text-sm">
                {deck.description}
              </CardDescription>
            )}
          </div>
          <Badge variant="secondary" className="ml-2">
            {deck.cardCount} cards
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Created {new Date(deck.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center space-x-2">
            <Link href={`/study/${deck.id}`}>
              <Button size="sm" variant="default">
                <Play className="w-4 h-4 mr-1" />
                Study
              </Button>
            </Link>
            <Link href={`/deck/${deck.id}`}>
              <Button size="sm" variant="outline">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </Link>
            <form action={deleteDeck}>
              <input type="hidden" name="id" value={deck.id} />
              <Button 
                size="sm" 
                variant="destructive" 
                type="submit"
                onClick={(e) => {
                  if (!confirm('Are you sure you want to delete this deck?')) {
                    e.preventDefault();
                  }
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
