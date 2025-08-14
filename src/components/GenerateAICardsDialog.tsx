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
import { generateAICards } from '@/lib/actions/ai';

interface GenerateAICardsDialogProps {
  deckId: number;
  hasTitle: boolean;
  hasDescription: boolean;
}

export function GenerateAICardsDialog({ deckId, hasTitle, hasDescription }: GenerateAICardsDialogProps) {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState<number>(50);
  const [error, setError] = useState<string | null>(null);

  const disabledReason = !hasTitle || !hasDescription
    ? 'Please fill in title and description to use AI generation'
    : undefined;

  const triggerButton = (
    <Button aria-label="Generate AI cards" disabled={Boolean(disabledReason)}>
      Generate AI cards
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              {triggerButton}
            </DialogTrigger>
          </TooltipTrigger>
          {disabledReason && (
            <TooltipContent>
              {disabledReason}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Generate AI cards</DialogTitle>
          <DialogDescription>
            Enter how many cards to generate. Maximum 200.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <form
          action={async (formData) => {
            try {
              await generateAICards(formData);
              setError(null);
              setOpen(false);
            } catch (e: any) {
              setError(e?.message || 'Failed to generate cards');
            }
          }}
          className="space-y-4"
        >
          <input type="hidden" name="deckId" value={deckId} />
          <div className="space-y-2">
            <label htmlFor="count" className="text-sm font-medium">Count</label>
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
            <p className="text-xs text-gray-500">Between 1 and 200</p>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Generate</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}


