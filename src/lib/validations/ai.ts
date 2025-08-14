import { z } from 'zod'

export const aiCardSchema = z.object({
  frontSide: z.string().min(1).max(280),
  backSide: z.string().min(1).max(2000),
})

export type AICard = z.infer<typeof aiCardSchema>


