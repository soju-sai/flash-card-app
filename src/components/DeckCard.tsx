'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Deck } from '@/lib/validations/deck';
import { formatDateHuman } from '@/lib/utils/date';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

interface DeckCardProps {
  deck: Deck & { cardCount: number };
}

export function DeckCard({ deck }: DeckCardProps) {
  const { t } = useI18n();
  return (
    <Link href={`/deck/${deck.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
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
              {deck.cardCount} {t('deck.cardCountSuffix')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            {t('common.updated')} {formatDateHuman(deck.updatedAt)}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
