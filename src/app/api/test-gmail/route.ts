import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Create transporter using Gmail (same as production)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your Gmail app password
  },
});

export async function GET(request: NextRequest) {
  try {
    const mailOptions = {
      from: `"MedLove Reminders" <${process.env.EMAIL_USER}>`,
      to: "pratikmishra79@gmail.com", // Your email to test
      subject: "💊 Test Email from MedLove (Gmail)",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f24ff0, #ff6b6b); padding: 30px; border-radius: 15px; text-align: center; color: white;">
            <h1 style="margin: 0;">💊 Gmail Test Email</h1>
            <p>If you receive this, your Gmail integration is working!</p>
            <p>This means medication reminders will work perfectly!</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Gmail test email sent successfully:", info.messageId);

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      message: "Gmail test email sent successfully! Check your inbox.",
    });
  } catch (error) {
    console.error("Failed to send Gmail test email:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send Gmail test email",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
