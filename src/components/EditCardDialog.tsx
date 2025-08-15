'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { updateCard } from '@/lib/actions/card';
import { Edit } from 'lucide-react';
import { Card } from '@/lib/validations/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useI18n } from '@/lib/i18n';

interface EditCardDialogProps {
  card: Card;
  cardNumber: number;
  trigger?: React.ReactNode;
}

export function EditCardDialog({ card, cardNumber, trigger }: EditCardDialogProps) {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  const defaultTrigger = (
    <Button variant="outline" size="sm" aria-label={t('dialogs.editCard.tooltip')}>
      <Edit className="w-3 h-3" />
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                {defaultTrigger}
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>{t('dialogs.editCard.tooltip')}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('dialogs.editCard.title').replace('{{n}}', String(cardNumber))}</DialogTitle>
          <DialogDescription>{t('dialogs.editCard.desc')}</DialogDescription>
        </DialogHeader>
        <form 
          action={async (formData) => {
            await updateCard(formData);
            setOpen(false);
          }}
          className="space-y-4"
        >
          {/* Hidden input for cardId */}
          <input type="hidden" name="id" value={card.id} />
          
          <div className="space-y-2">
            <label htmlFor="frontSide" className="text-sm font-medium">{t('dialogs.editCard.frontLabel')}</label>
            <Textarea
              id="frontSide"
              name="frontSide"
              placeholder={t('dialogs.editCard.frontPh')}
              defaultValue={card.frontSide}
              required
              maxLength={1000}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              {t('dialogs.editCard.frontHint')}
            </p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="backSide" className="text-sm font-medium">{t('dialogs.editCard.backLabel')}</label>
            <Textarea
              id="backSide"
              name="backSide"
              placeholder={t('dialogs.editCard.backPh')}
              defaultValue={card.backSide}
              required
              maxLength={1000}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              {t('dialogs.editCard.backHint')}
            </p>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              {t('dialogs.editCard.cancel')}
            </Button>
            <Button type="submit">{t('dialogs.editCard.submit')}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
