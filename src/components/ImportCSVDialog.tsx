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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Upload } from 'lucide-react';
import { importCardsFromCSV } from '@/lib/actions/card';
import { useI18n } from '@/lib/i18n';

interface ImportCSVDialogProps {
  deckId: number;
}

export function ImportCSVDialog({ deckId }: ImportCSVDialogProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useI18n();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="outline" aria-label={t('dialogs.importCSV.tooltip')}>
                <Upload className="w-4 h-4" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>{t('dialogs.importCSV.tooltip')}</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{t('dialogs.importCSV.title')}</DialogTitle>
          <DialogDescription>{t('dialogs.importCSV.desc')}</DialogDescription>
        </DialogHeader>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <form
          action={async (formData) => {
            try {
              const result = await importCardsFromCSV(formData);
              if (result && 'success' in result && result.success) {
                setError(null);
                setOpen(false);
              } else {
                const message = (result && 'error' in result) ? result.error : t('errors.invalidInput');
                setError(message);
              }
            } catch (e: unknown) {
              // Best-effort error mapping
              let msg = e instanceof Error ? e.message : t('errors.invalidInput');
              const map: Array<[RegExp, string]> = [
                [/Unauthorized/i, 'errors.unauthorized'],
                [/Deck not found or not authorized/i, 'errors.deckNotFoundOrNotAuthorized'],
                [/CSV/i, 'errors.csvParseFailed'],
                [/Invalid input/i, 'errors.invalidInput'],
              ];
              for (const [re, key] of map) {
                if (re.test(msg)) {
                  msg = t(key);
                  break;
                }
              }
              setError(msg);
            }
          }}
          className="space-y-4"
        >
          <input type="hidden" name="deckId" value={deckId} />

          <div className="space-y-2">
            <label htmlFor="file" className="text-sm font-medium">{t('dialogs.importCSV.fileLabel')}</label>
            <Input id="file" name="file" type="file" accept=".csv" required />
            <p className="text-xs text-gray-500">{t('dialogs.importCSV.fileHint')}</p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>{t('dialogs.importCSV.cancel')}</Button>
            <Button type="submit">{t('dialogs.importCSV.submit')}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}


