import { z } from "zod";

export const usernameValidation = z
        .string()
        .min(2, " username must be atleast 2 charcters")
        .max(20," username must be no more than 20 chracters")
        .regex(/^[a-zA-Z0-9_]+$/, "username must not contain special chracters")

 export const signUpSchema = z.object({
        username:usernameValidation,
        email: z.string().email({ message: "invalid email address"}),
        password: z.string().min(6, {message:"password must be atleast 6 chracters "})
 })       