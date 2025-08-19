'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { cardsTable, decksTable } from '@/db/schema';
import { createCardSchema, updateCardSchema, deleteCardSchema } from '@/lib/validations/card';
import { revalidatePath } from 'next/cache';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

export async function createCard(formData: FormData) {
  // Authentication check
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }
  
  // Extract and validate data
  const rawData = {
    deckId: Number(formData.get('deckId')),
    frontSide: formData.get('frontSide'),
    backSide: formData.get('backSide'),
  };
  
  // Zod validation
  const validatedData = createCardSchema.parse(rawData);
  
  try {
    // Verify that the deck belongs to the authenticated user
    const deck = await db.select()
      .from(decksTable)
      .where(and(
        eq(decksTable.id, validatedData.deckId),
        eq(decksTable.userId, userId)
      ))
      .limit(1);
    
    if (deck.length === 0) {
      throw new Error('Deck not found or not authorized');
    }
    
    // Create the card
    await db.insert(cardsTable).values(validatedData);
    
    revalidatePath('/dashboard');
    revalidatePath(`/deck/${validatedData.deckId}`);
  } catch {
    throw new Error('Failed to create card');
  }
}

export async function updateCard(formData: FormData) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error('Unauthorized');
    }
    
    const rawData = {
      id: Number(formData.get('id')),
      frontSide: formData.get('frontSide'),
      backSide: formData.get('backSide'),
    };
    
    // Validate the form data
    let validatedData;
    try {
      validatedData = updateCardSchema.parse(rawData);
    } catch (error) {
      console.error('Validation error:', error);
      throw new Error('Invalid form data provided');
    }
    
    // First get the card to verify ownership through deck
    const cardWithDeck = await db.select({
      cardId: cardsTable.id,
      deckId: cardsTable.deckId,
      userId: decksTable.userId,
    })
      .from(cardsTable)
      .leftJoin(decksTable, eq(cardsTable.deckId, decksTable.id))
      .where(eq(cardsTable.id, validatedData.id))
      .limit(1);
    
    if (cardWithDeck.length === 0) {
      throw new Error('Card not found');
    }
    
    if (cardWithDeck[0].userId !== userId) {
      throw new Error('Not authorized to update this card');
    }
    
    // Update the card
    await db.update(cardsTable)
      .set({
        frontSide: validatedData.frontSide,
        backSide: validatedData.backSide,
        updatedAt: new Date(),
      })
      .where(eq(cardsTable.id, validatedData.id));
      
    revalidatePath('/dashboard');
    revalidatePath(`/deck/${cardWithDeck[0].deckId}`);
    
  } catch (error) {
    console.error('Error updating card:', error);
    
    // Re-throw known errors with their original message
    if (error instanceof Error && 
        (error.message.includes('Unauthorized') || 
         error.message.includes('Not authorized') ||
         error.message.includes('Card not found') ||
         error.message.includes('Invalid form data'))) {
      throw error;
    }
    
    // For database errors and other unknown errors, provide a generic message
    throw new Error('Failed to update card. Please try again.');
  }
}

export async function deleteCard(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }
  
  const rawData = {
    id: Number(formData.get('id')),
  };
  
  const validatedData = deleteCardSchema.parse(rawData);
  
  try {
    // First get the card to verify ownership through deck
    const cardWithDeck = await db.select({
      cardId: cardsTable.id,
      deckId: cardsTable.deckId,
      userId: decksTable.userId,
    })
      .from(cardsTable)
      .leftJoin(decksTable, eq(cardsTable.deckId, decksTable.id))
      .where(eq(cardsTable.id, validatedData.id))
      .limit(1);
    
    if (cardWithDeck.length === 0 || cardWithDeck[0].userId !== userId) {
      throw new Error('Card not found or not authorized');
    }
    
    await db.delete(cardsTable)
      .where(eq(cardsTable.id, validatedData.id));
      
    revalidatePath('/dashboard');
    revalidatePath(`/deck/${cardWithDeck[0].deckId}`);
  } catch {
    throw new Error('Failed to delete card');
  }
}

// CSV import server action
const importCSVSchema = z.object({
  deckId: z.number().positive('Invalid deck ID'),
});

function parseCSVContent(text: string): Array<{ frontSide: string; backSide: string }> {
  // Simple CSV parser for two-column CSV without quotes; trims whitespace
  // Lines starting with # are ignored
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0 && !/^\s*#/.test(l));
  const cards: Array<{ frontSide: string; backSide: string }> = [];
  for (const line of lines) {
    const parts = line.split(',');
    if (parts.length < 2) {
      // Skip invalid row
      continue;
    }
    const front = parts[0]?.trim() ?? '';
    const back = parts.slice(1).join(',').trim();
    if (front.length === 0 || back.length === 0) continue;
    if (front.length > 1000 || back.length > 1000) continue;
    cards.push({ frontSide: front, backSide: back });
  }
  return cards;
}

export async function importCardsFromCSV(formData: FormData) {
  // Authentication check
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Extract and validate metadata
  const deckId = Number(formData.get('deckId'));
  const validated = importCSVSchema.parse({ deckId });

  // Verify deck ownership
  const deck = await db
    .select()
    .from(decksTable)
    .where(and(eq(decksTable.id, validated.deckId), eq(decksTable.userId, userId)))
    .limit(1);
  if (deck.length === 0) {
    throw new Error('Deck not found or not authorized');
  }

  // Get file
  const file = formData.get('file');
  if (!(file instanceof File)) {
    throw new Error('Invalid input: CSV file is required');
  }

  const text = await file.text();
  const rows = parseCSVContent(text);
  if (rows.length === 0) {
    throw new Error('CSV parse failed or no valid rows');
  }

  // Insert rows (Neon HTTP driver does not support transactions)
  try {
    await db.insert(cardsTable).values(
      rows.map((row) => ({
        deckId: validated.deckId,
        frontSide: row.frontSide,
        backSide: row.backSide,
      }))
    );
    revalidatePath('/dashboard');
    revalidatePath(`/deck/${validated.deckId}`);
    return { success: true } as const;
  } catch (error) {
    console.error('CSV import failed', error);
    return { success: false as const, error: 'Failed to import cards from CSV' };
  }
}
