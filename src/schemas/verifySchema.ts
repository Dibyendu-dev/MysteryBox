import { z } from "zod";

export const verifySchema = z.object({
    code: z.string().length(6, 'verificatin must be 6 digits')
})