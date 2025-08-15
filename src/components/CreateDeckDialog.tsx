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
import { createDeck } from '@/lib/actions/deck';
import { Plus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useI18n } from '@/lib/i18n';

export function CreateDeckDialog() {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button aria-label={t('dialogs.createDeck.tooltip')}>
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>{t('dialogs.createDeck.tooltip')}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('dialogs.createDeck.title')}</DialogTitle>
          <DialogDescription>{t('dialogs.createDeck.desc')}</DialogDescription>
        </DialogHeader>
        <form 
          action={async (formData) => {
            await createDeck(formData);
            setOpen(false);
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">{t('dialogs.createDeck.titleLabel')}</label>
            <Input
              id="title"
              name="title"
              placeholder={t('dialogs.createDeck.titlePh')}
              required
              maxLength={255}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">{t('dialogs.createDeck.descLabel')}</label>
            <Textarea
              id="description"
              name="description"
              placeholder={t('dialogs.createDeck.descPh')}
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
              {t('dialogs.createDeck.cancel')}
            </Button>
            <Button type="submit">{t('dialogs.createDeck.submit')}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
