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
import { Sparkles } from 'lucide-react';
import { generateAICards } from '@/lib/actions/ai';
import { useI18n } from '@/lib/i18n';

interface GenerateAICardsDialogProps {
  deckId: number;
  hasTitle: boolean;
  hasDescription: boolean;
  locked?: boolean;
}

export function GenerateAICardsDialog({ deckId, hasTitle, hasDescription, locked }: GenerateAICardsDialogProps) {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState<number>(50);
  const [error, setError] = useState<string | null>(null);
  const { t } = useI18n();

  const disabledReason = locked
    ? t('ai.upgradeToUseAI')
    : (!hasTitle || !hasDescription ? t('ai.needTitleDesc') : undefined);

  const tooltipContent = disabledReason || t('ai.generateAICards');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex" aria-hidden={false}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  aria-label={t('ai.generateAICards')}
                  disabled={Boolean(disabledReason)}
                >
                  <Sparkles className="w-4 h-4" />
                </Button>
              </DialogTrigger>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>{t('ai.dialogTitle')}</DialogTitle>
          <DialogDescription>
            {t('ai.dialogDesc')}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <form
          action={async (formData) => {
            try {
              const result = await generateAICards(formData);
              console.log('generateAICards result:', result);
              if (result && 'success' in result && result.success) {
                setError(null);
                setOpen(false);
              } else {
                const message = (result && 'error' in result) ? result.error : 'Failed to generate cards';
                setError(message);
              }
            } catch (e: unknown) {
              // Log the full error for debugging in browser console
              console.error('generateAICards client catch:', e);
              let errorMessage = e instanceof Error ? e.message : t('ai.failed');
              const map: Array<[RegExp, string]> = [
                [/Unauthorized/i, 'errors.unauthorized'],
                [/AI deck feature required/i, 'errors.aiFeatureRequired'],
                [/Deck not found or not authorized/i, 'errors.deckNotFoundOrNotAuthorized'],
                [/title and description/i, 'errors.deckTitleAndDescriptionRequired'],
                [/provider not configured/i, 'errors.aiProviderNotConfigured'],
                [/quota/i, 'errors.aiQuotaExceeded'],
                [/Invalid input/i, 'errors.invalidInput'],
                [/Failed to generate cards/i, 'errors.failedToGenerateCards'],
                [/AI must return at least/i, 'errors.aiMustReturnAtLeast'],
              ];
              for (const [re, key] of map) {
                if (re.test(errorMessage)) {
                  errorMessage = t(key);
                  break;
                }
              }
              setError(errorMessage);
            }
          }}
          className="space-y-4"
        >
          <input type="hidden" name="deckId" value={deckId} />
          <div className="space-y-2">
            <label htmlFor="count" className="text-sm font-medium">{t('ai.countLabel')}</label>
            <Input
              id="count"
              name="count"
              type="number"
              min={1}
              max={200}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              required
            />
            <p className="text-xs text-gray-500">{t('ai.between')}</p>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>{t('common.cancel')}</Button>
            <Button type="submit">{t('common.generate')}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}


