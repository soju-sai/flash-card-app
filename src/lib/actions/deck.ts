'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { decksTable } from '@/db/schema';
import { createDeckSchema, updateDeckSchema, deleteDeckSchema } from '@/lib/validations/deck';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq, and } from 'drizzle-orm';

export async function createDeck(formData: FormData) {
  // Authentication check
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }
  
  // Extract and validate data
  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
  };
  
  // Zod validation with TypeScript types
  const validatedData = createDeckSchema.parse(rawData);
  
  try {
    // Database operation with validated data
    await db.insert(decksTable).values({
      ...validatedData,
      userId, // Always include authenticated user ID
    });
    
    revalidatePath('/dashboard');
    redirect('/dashboard');
  } catch (error) {
    throw new Error('Failed to create deck');
  }
}

export async function updateDeck(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }
  
  const rawData = {
    id: Number(formData.get('id')),
    title: formData.get('title'),
    description: formData.get('description'),
  };
  
  const validatedData = updateDeckSchema.parse(rawData);
  
  try {
    await db.update(decksTable)
      .set(validatedData)
      .where(and(
        eq(decksTable.id, validatedData.id),
        eq(decksTable.userId, userId) // Ensure user owns the deck
      ));
      
    revalidatePath('/dashboard');
  } catch (error) {
    throw new Error('Failed to update deck');
  }
}

export async function deleteDeck(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }
  
  const rawData = {
    id: Number(formData.get('id')),
  };
  
  const validatedData = deleteDeckSchema.parse(rawData);
  
  try {
    await db.delete(decksTable)
      .where(and(
        eq(decksTable.id, validatedData.id),
        eq(decksTable.userId, userId)
      ));
      
    revalidatePath('/dashboard');
  } catch (error) {
    throw new Error('Failed to delete deck');
  }
}
