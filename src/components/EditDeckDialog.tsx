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

interface EditDeckDialogProps {
  deck: Deck;
}

export function EditDeckDialog({ deck }: EditDeckDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Edit className="w-4 h-4 mr-2" />
          Edit Deck
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Deck</DialogTitle>
          <DialogDescription>
            Update your deck&apos;s title and description.
          </DialogDescription>
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
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              name="title"
              placeholder="Enter deck title"
              defaultValue={deck.title}
              required
              maxLength={255}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description (optional)
            </label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter deck description"
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
              Cancel
            </Button>
            <Button type="submit">Update Deck</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
