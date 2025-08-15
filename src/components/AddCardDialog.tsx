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
import { createCard } from '@/lib/actions/card';
import { Plus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useI18n } from '@/lib/i18n';

interface AddCardDialogProps {
  deckId: number;
  trigger?: React.ReactNode;
}

export function AddCardDialog({ deckId, trigger }: AddCardDialogProps) {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  const defaultTrigger = (
    <Button aria-label={t('dialogs.addCard.tooltip')}>
      <Plus className="w-4 h-4" />
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
            <TooltipContent>{t('dialogs.addCard.tooltip')}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('dialogs.addCard.title')}</DialogTitle>
          <DialogDescription>{t('dialogs.addCard.desc')}</DialogDescription>
        </DialogHeader>
        <form 
          action={async (formData) => {
            await createCard(formData);
            setOpen(false);
          }}
          className="space-y-4"
        >
          {/* Hidden input for deckId */}
          <input type="hidden" name="deckId" value={deckId} />
          
          <div className="space-y-2">
            <label htmlFor="frontSide" className="text-sm font-medium">{t('dialogs.addCard.frontLabel')}</label>
            <Textarea
              id="frontSide"
              name="frontSide"
              placeholder={t('dialogs.addCard.frontPh')}
              required
              maxLength={1000}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              {t('dialogs.addCard.frontHint')}
            </p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="backSide" className="text-sm font-medium">{t('dialogs.addCard.backLabel')}</label>
            <Textarea
              id="backSide"
              name="backSide"
              placeholder={t('dialogs.addCard.backPh')}
              required
              maxLength={1000}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              {t('dialogs.addCard.backHint')}
            </p>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              {t('dialogs.addCard.cancel')}
            </Button>
            <Button type="submit">{t('dialogs.addCard.submit')}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
