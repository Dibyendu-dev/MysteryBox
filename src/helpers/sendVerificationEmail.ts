import { ApiResponse } from "@/types/ApiResponse";
import nodemailer from "nodemailer";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'earnest.farrell@ethereal.email',
            pass: 'DSwzQUJ4XY9ZW4qaKN'
        }
    });

    const MailOptions = {
      from: "ddas4548@gmail.com",
      to: email,
      subject: "Verification Code: " + verifyCode,
      html: `<h1>Hello, ${username}</h1>
      <p>Thank you for registering. Please use the following verification code to complete your registration</p>
     <strong>${verifyCode}</strong>
     <p>If you did not request this code, please ignore this email.</p>
      
      `,
    };
    const mailResponse = await transporter.sendMail(MailOptions);
    console.log("Email sent: ", mailResponse);
    return {
      success: true,
      message: "Verification Code sent successfully",
    };
  } catch (error: any) {
    console.error("Error sending email:", error);
    return {
      success: false,
      message: "Failed to send verification email" + error.message,
    };
  }
}