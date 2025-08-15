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

export async function generateAICards(
  formData: FormData
): Promise<{ success: true } | { success: false; error: string }> {
  let stage = 'start'
  try {
    console.log('[generateAICards] start', { t: new Date().toISOString() })
    stage = 'auth'
    const { userId, has } = await auth()
    if (!userId) {
      console.error('[generateAICards] no userId (unauthorized)')
      throw new Error('Unauthorized')
    }

    stage = 'parse'
    const raw = {
      deckId: Number(formData.get('deckId')),
      count: Number(formData.get('count')),
    }
    console.log('[generateAICards] raw form data', raw)
    const { deckId, count } = requestSchema.parse(raw)
    console.log('[generateAICards] parsed input', { deckId, count })

    stage = 'feature_check'
    const canUseAI = has({ feature: 'ai_deck' })
    console.log('[generateAICards] feature check', { canUseAI })
    if (!canUseAI) {
      throw new Error('AI deck feature required')
    }

    stage = 'deck_fetch'
    const [deck] = await db
      .select()
      .from(decksTable)
      .where(and(eq(decksTable.id, deckId), eq(decksTable.userId, userId)))
      .limit(1)

    console.log('[generateAICards] deck fetch', { found: Boolean(deck), deckId })
    if (!deck) {
      throw new Error('Deck not found or not authorized')
    }

    stage = 'pre_ai_checks'
    if (!deck.title || !deck.description) {
      console.error('[generateAICards] deck missing title/description', {
        hasTitle: Boolean(deck.title),
        hasDescription: Boolean(deck.description),
      })
      throw new Error('Deck title and description are required for AI generation')
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('[generateAICards] OPENAI_API_KEY is not set')
      throw new Error('AI provider not configured')
    }

    stage = 'ai_call'
    type AICard = z.infer<typeof aiCardSchema>
    console.log('[generateAICards] ai call start', {
      model: 'gpt-4o-mini',
      count,
    })
    const { object: cards } = await generateObject<AICard>({
      model: openai('gpt-4o-mini'),
      output: 'array',
      schema: aiCardSchema,
      temperature: 1.1,
      maxTokens: 800,
      maxRetries: 1,
      prompt: [
        'You are an assistant that creates flashcards.',
        `Create at least ${count} diverse and non-redundant flashcards (not fewer than ${count}).`,
        `Title: ${deck.title}`,
        `Description: ${deck.description}`,
        'Only return an array of objects with keys: frontSide, backSide. No extra fields.',
      ].join('\n'),
      experimental_repairText: async ({ text }) => text,
    })
    console.log('[generateAICards] ai call done', {
      received: Array.isArray(cards) ? cards.length : null,
    })

    if (!Array.isArray(cards) || cards.length < count) {
      console.error('[generateAICards] insufficient ai result length', {
        expectedMin: count,
        got: Array.isArray(cards) ? cards.length : null,
      })
      throw new Error(`AI must return at least ${count} cards`)
    }

    stage = 'db_insert'
    const toInsert = cards.slice(0, count)
    console.log('[generateAICards] db batch insert start', { toInsert: toInsert.length })
    await db
      .insert(cardsTable)
      .values(
        toInsert.map((card) => ({
          deckId,
          frontSide: card.frontSide,
          backSide: card.backSide,
        }))
      )
    console.log('[generateAICards] db batch insert done')

    stage = 'revalidate'
    revalidatePath('/dashboard')
    revalidatePath(`/deck/${deckId}`)
    console.log('[generateAICards] revalidated paths for deck', { deckId })
    return { success: true }
  } catch (error: unknown) {
    console.error('[generateAICards] error caught', {
      stage,
      message: error instanceof Error ? error.message : String(error),
      name: error instanceof Error ? error.name : 'Unknown',
      status: (error as { status?: number; response?: { status?: number } })?.status ?? (error as { status?: number; response?: { status?: number } })?.response?.status,
    })
    if (NoObjectGeneratedError.isInstance(error)) {
      console.error('AI generation failed', {
        cause: error.cause,
        text: error.text,
        response: error.response,
        usage: error.usage,
      })
      return { success: false, error: 'Failed to generate cards (stage: ai_call)' }
    }

    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid input (stage: parse)' }
    }

    const status = (error as { status?: number; response?: { status?: number } })?.status ?? (error as { status?: number; response?: { status?: number } })?.response?.status
    const message = error instanceof Error ? error.message : String(error)
    if (status === 429 || /quota|billing|insufficient_quota/i.test(message)) {
      return { success: false, error: 'AI quota exceeded. Please check your plan and billing and try again later.' }
    }

    const knownMessages = new Set([
      'Unauthorized',
      'AI deck feature required',
      'Deck not found or not authorized',
      'Deck title and description are required for AI generation',
      'AI provider not configured',
    ])
    if (error instanceof Error) {
      if (knownMessages.has(error.message) || /AI must return at least/.test(error.message)) {
        return { success: false, error: `${error.message} (stage: ${stage})` }
      }
    }

    return { success: false, error: `Failed to generate cards (stage: ${stage})` }
  }
}


