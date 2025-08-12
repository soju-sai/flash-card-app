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

interface EditCardDialogProps {
  card: Card;
  cardNumber: number;
  trigger?: React.ReactNode;
}

export function EditCardDialog({ card, cardNumber, trigger }: EditCardDialogProps) {
  const [open, setOpen] = useState(false);

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Edit className="w-3 h-3" />
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Card #{cardNumber}</DialogTitle>
          <DialogDescription>
            Update the content of this flashcard.
          </DialogDescription>
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
            <label htmlFor="frontSide" className="text-sm font-medium">
              Front Side
            </label>
            <Textarea
              id="frontSide"
              name="frontSide"
              placeholder="Enter the question or prompt..."
              defaultValue={card.frontSide}
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
              defaultValue={card.backSide}
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
            <Button type="submit">Update Card</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
