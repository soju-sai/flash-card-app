'use client';

import { Button } from '@/components/ui/button';
import { deleteCard } from '@/lib/actions/card';
import { Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useI18n } from '@/lib/i18n';

interface DeleteCardButtonProps {
  cardId: number;
  cardNumber: number;
}

export function DeleteCardButton({ cardId, cardNumber }: DeleteCardButtonProps) {
  const { t } = useI18n();
  const handleDelete = () => {
    if (confirm(t('dialogs.deleteCard.confirm').replace('{{n}}', String(cardNumber)))) {
      const formData = new FormData();
      formData.append('id', cardId.toString());
      deleteCard(formData);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleDelete}
            aria-label={t('dialogs.deleteCard.aria')}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('dialogs.deleteCard.tooltip')}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
