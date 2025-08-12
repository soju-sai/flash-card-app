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

interface AddCardDialogProps {
  deckId: number;
  trigger?: React.ReactNode;
}

export function AddCardDialog({ deckId, trigger }: AddCardDialogProps) {
  const [open, setOpen] = useState(false);

  const defaultTrigger = (
    <Button>
      <Plus className="w-4 h-4 mr-2" />
      Add Card
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Card</DialogTitle>
          <DialogDescription>
            Create a new flashcard for this deck.
          </DialogDescription>
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
            <label htmlFor="frontSide" className="text-sm font-medium">
              Front Side
            </label>
            <Textarea
              id="frontSide"
              name="frontSide"
              placeholder="Enter the question or prompt..."
              required
              maxLength={1000}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              What will be shown to the learner initially
            </p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="backSide" className="text-sm font-medium">
              Back Side
            </label>
            <Textarea
              id="backSide"
              name="backSide"
              placeholder="Enter the answer or explanation..."
              required
              maxLength={1000}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              What will be revealed when the learner checks the answer
            </p>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Card</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
