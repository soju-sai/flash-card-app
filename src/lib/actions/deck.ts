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
  
  try {
    // Extract and validate data
    const rawData = {
      title: formData.get('title'),
      description: formData.get('description'),
    };
    
    // Zod validation with TypeScript types
    const validatedData = createDeckSchema.parse(rawData);
    
    // Database operation with validated data
    await db.insert(decksTable).values({
      ...validatedData,
      userId, // Always include authenticated user ID
    });
    
  } catch (error) {
    console.error('Create deck error:', error);
    
    // Handle Zod validation errors
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      const zodError = error as { errors?: Array<{ path: string[]; message: string }> };
      const errorMessages = zodError.errors?.map((err) => 
        `${err.path.join('.')}: ${err.message}`
      ).join(', ') || 'Invalid form data';
      throw new Error(`Validation failed: ${errorMessages}`);
    }
    
    // Handle database connection errors
    if (error instanceof Error && error.message.includes('CONNECTION')) {
      throw new Error('Database connection failed. Please check your DATABASE_URL.');
    }
    
    // Handle other specific errors
    if (error instanceof Error) {
      throw new Error(`Failed to create deck: ${error.message}`);
    }
    
    throw new Error('Failed to create deck: Unknown error');
  }
  
  // These should only run if the database operation succeeded
  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function updateDeck(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }
  
  try {
    const rawData = {
      id: Number(formData.get('id')),
      title: formData.get('title'),
      description: formData.get('description'),
    };
    
    const validatedData = updateDeckSchema.parse(rawData);
    
    // Only include fields that are provided
    const updateData: { title?: string; description?: string } = {};
    if (validatedData.title !== undefined) {
      updateData.title = validatedData.title;
    }
    if (validatedData.description !== undefined) {
      updateData.description = validatedData.description;
    }
    
    await db.update(decksTable)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(and(
        eq(decksTable.id, validatedData.id),
        eq(decksTable.userId, userId) // Ensure user owns the deck
      ));
      
    revalidatePath('/dashboard');
    revalidatePath(`/deck/${validatedData.id}`);
  } catch (error) {
    console.error('Update deck error:', error);
    
    // Handle Zod validation errors
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      const zodError = error as { errors?: Array<{ path: string[]; message: string }> };
      const errorMessages = zodError.errors?.map((err) => 
        `${err.path.join('.')}: ${err.message}`
      ).join(', ') || 'Invalid form data';
      throw new Error(`Validation failed: ${errorMessages}`);
    }
    
    if (error instanceof Error) {
      throw new Error(`Failed to update deck: ${error.message}`);
    }
    
    throw new Error('Failed to update deck: Unknown error');
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
  } catch {
    throw new Error('Failed to delete deck');
  }
}
