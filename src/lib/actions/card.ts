'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { cardsTable, decksTable } from '@/db/schema';
import { createCardSchema, updateCardSchema, deleteCardSchema } from '@/lib/validations/card';
import { revalidatePath } from 'next/cache';
import { eq, and } from 'drizzle-orm';

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
  } catch (error) {
    throw new Error('Failed to create card');
  }
}

export async function updateCard(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }
  
  const rawData = {
    id: Number(formData.get('id')),
    frontSide: formData.get('frontSide'),
    backSide: formData.get('backSide'),
  };
  
  const validatedData = updateCardSchema.parse(rawData);
  
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
    
    await db.update(cardsTable)
      .set(validatedData)
      .where(eq(cardsTable.id, validatedData.id));
      
    revalidatePath('/dashboard');
    revalidatePath(`/deck/${cardWithDeck[0].deckId}`);
  } catch (error) {
    throw new Error('Failed to update card');
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
  } catch (error) {
    throw new Error('Failed to delete card');
  }
}
