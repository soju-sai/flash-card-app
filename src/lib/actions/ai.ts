'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { cardsTable, decksTable } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'
import { openai } from '@ai-sdk/openai'
import { generateObject, NoObjectGeneratedError } from 'ai'
import { aiCardSchema } from '@/lib/validations/ai'

const requestSchema = z.object({
  deckId: z.number().positive('Invalid deck ID'),
  count: z.number().min(1).max(200),
})

export async function generateAICards(formData: FormData) {
  const { userId, has } = await auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const raw = {
    deckId: Number(formData.get('deckId')),
    count: Number(formData.get('count')),
  }
  const { deckId, count } = requestSchema.parse(raw)

  const canUseAI = has({ feature: 'ai_deck' })
  if (!canUseAI) {
    throw new Error('AI deck feature required')
  }

  const [deck] = await db
    .select()
    .from(decksTable)
    .where(and(eq(decksTable.id, deckId), eq(decksTable.userId, userId)))
    .limit(1)

  if (!deck) {
    throw new Error('Deck not found or not authorized')
  }

  if (!deck.title || !deck.description) {
    throw new Error('Deck title and description are required for AI generation')
  }

  try {
    type AICard = z.infer<typeof aiCardSchema>
    const { object: cards } = await generateObject<AICard>({
      model: openai('gpt-4o-mini'),
      output: 'array',
      schema: aiCardSchema,
      mode: 'json',
      temperature: 1.1,
      maxTokens: 800,
      maxRetries: 1,
      prompt: [
        'You are an assistant that creates flashcards.',
        `Create exactly ${count} diverse and non-redundant flashcards.`,
        `Title: ${deck.title}`,
        `Description: ${deck.description}`,
        'Only return an array of objects with keys: frontSide, backSide. No extra fields.',
      ].join('\n'),
      experimental_repairText: async ({ text }) => text,
    })

    if (!Array.isArray(cards) || cards.length !== count) {
      throw new Error(`AI must return exactly ${count} cards`)
    }

    await db.transaction(async (tx) => {
      for (const card of cards) {
        await tx.insert(cardsTable).values({
          deckId,
          frontSide: card.frontSide,
          backSide: card.backSide,
        })
      }
    })

    revalidatePath('/dashboard')
    revalidatePath(`/deck/${deckId}`)
  } catch (error) {
    if (NoObjectGeneratedError.isInstance(error)) {
      console.error('AI generation failed', {
        cause: error.cause,
        text: error.text,
        response: error.response,
        usage: error.usage,
      })
      throw new Error('Failed to generate cards')
    }
    throw error
  }
}


