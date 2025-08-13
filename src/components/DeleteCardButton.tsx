'use client';

import { Button } from '@/components/ui/button';
import { deleteCard } from '@/lib/actions/card';
import { Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DeleteCardButtonProps {
  cardId: number;
  cardNumber: number;
}

export function DeleteCardButton({ cardId, cardNumber }: DeleteCardButtonProps) {
  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete Card #${cardNumber}?`)) {
      const formData = new FormData();
      formData.append('id', cardId.toString());
      deleteCard(formData);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleDelete}
            aria-label="Delete Card"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Delete Card
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
