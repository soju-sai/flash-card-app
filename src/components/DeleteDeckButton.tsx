'use client';

import { Button } from '@/components/ui/button';
import { deleteDeck } from '@/lib/actions/deck';
import { Trash2 } from 'lucide-react';

interface DeleteDeckButtonProps {
  deckId: number;
  deckTitle: string;
}

export function DeleteDeckButton({ deckId, deckTitle }: DeleteDeckButtonProps) {
  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${deckTitle}"? This will also delete all cards in this deck.`)) {
      const formData = new FormData();
      formData.append('id', deckId.toString());
      deleteDeck(formData);
    }
  };

  return (
    <Button 
      variant="destructive" 
      onClick={handleDelete}
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
