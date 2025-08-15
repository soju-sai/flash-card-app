'use client';

import { Button } from '@/components/ui/button';
import { deleteDeck } from '@/lib/actions/deck';
import { Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useI18n } from '@/lib/i18n';

interface DeleteDeckButtonProps {
  deckId: number;
  deckTitle: string;
}

export function DeleteDeckButton({ deckId, deckTitle }: DeleteDeckButtonProps) {
  const { t } = useI18n();
  const handleDelete = () => {
    if (confirm(t('dialogs.deleteDeck.confirm').replace('{{title}}', deckTitle))) {
      const formData = new FormData();
      formData.append('id', deckId.toString());
      deleteDeck(formData);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            aria-label={t('dialogs.deleteDeck.aria')}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('dialogs.deleteDeck.tooltip')}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
