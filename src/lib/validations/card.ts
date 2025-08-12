import { z } from 'zod';
import { cardsTable } from '@/db/schema';

// TypeScript types derived from database schema
export type Card = typeof cardsTable.$inferSelect;
export type NewCard = typeof cardsTable.$inferInsert;

// Zod validation schemas for card operations
export const createCardSchema = z.object({
  deckId: z.number().positive('Invalid deck ID'),
  frontSide: z.string()
    .min(1, 'Front side is required')
    .max(1000, 'Front side must be less than 1000 characters'),
  backSide: z.string()
    .min(1, 'Back side is required')
    .max(1000, 'Back side must be less than 1000 characters'),
});

export const updateCardSchema = z.object({
  id: z.number().positive('Invalid card ID'),
  frontSide: z.string()
    .min(1, 'Front side is required')
    .max(1000, 'Front side must be less than 1000 characters'),
  backSide: z.string()
    .min(1, 'Back side is required')
    .max(1000, 'Back side must be less than 1000 characters'),
});

export const deleteCardSchema = z.object({
  id: z.number().positive('Invalid card ID'),
});

// Export types for use in components
export type CreateCardInput = z.infer<typeof createCardSchema>;
export type UpdateCardInput = z.infer<typeof updateCardSchema>;
export type DeleteCardInput = z.infer<typeof deleteCardSchema>;
