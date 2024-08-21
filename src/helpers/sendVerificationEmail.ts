import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendverificationEmail(email:string,
    username: string,
    verifyCode:string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: 'email',
            subject: 'MysteryBox | Verification Code',
            react: VerificationEmail({ username, otp: verifyCode}),
          });
        return{ success: true, message:' vericaion email send successfully'}
        
    } catch (emailError) {
        console.error("Error sending verification email",emailError)
        return{ success: false, message:'failed to send vericaion email'}
    }
}