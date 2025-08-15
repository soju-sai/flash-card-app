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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { updateDeck } from '@/lib/actions/deck';
import { Edit } from 'lucide-react';
import type { Deck } from '@/lib/validations/deck';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useI18n } from '@/lib/i18n';

interface EditDeckDialogProps {
  deck: Deck;
}

export function EditDeckDialog({ deck }: EditDeckDialogProps) {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="outline" aria-label={t('dialogs.editDeck.tooltip')}>
                <Edit className="w-4 h-4" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>{t('dialogs.editDeck.tooltip')}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('dialogs.editDeck.title')}</DialogTitle>
          <DialogDescription>{t('dialogs.editDeck.desc')}</DialogDescription>
        </DialogHeader>
        <form 
          action={async (formData) => {
            await updateDeck(formData);
            setOpen(false);
          }}
          className="space-y-4"
        >
          {/* Hidden input for deck ID */}
          <input type="hidden" name="id" value={deck.id} />
          
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">{t('dialogs.editDeck.titleLabel')}</label>
            <Input
              id="title"
              name="title"
              placeholder={t('dialogs.editDeck.titlePh')}
              defaultValue={deck.title}
              required
              maxLength={255}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">{t('dialogs.editDeck.descLabel')}</label>
            <Textarea
              id="description"
              name="description"
              placeholder={t('dialogs.editDeck.descPh')}
              defaultValue={deck.description || ''}
              maxLength={1000}
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              {t('dialogs.editDeck.cancel')}
            </Button>
            <Button type="submit">{t('dialogs.editDeck.submit')}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
