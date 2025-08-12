import { z } from 'zod';
import { decksTable } from '@/db/schema';

// TypeScript types derived from database schema
export type Deck = typeof decksTable.$inferSelect;
export type NewDeck = typeof decksTable.$inferInsert;

// Zod validation schemas for deck operations
export const createDeckSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters'),
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .nullable()
    .transform(val => val === '' ? null : val),
});

export const updateDeckSchema = z.object({
  id: z.number().positive('Invalid deck ID'),
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters')
    .optional(),
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
});

export const deleteDeckSchema = z.object({
  id: z.number().positive('Invalid deck ID'),
});

// Export types for use in components
export type CreateDeckInput = z.infer<typeof createDeckSchema>;
export type UpdateDeckInput = z.infer<typeof updateDeckSchema>;
export type DeleteDeckInput = z.infer<typeof deleteDeckSchema>;
