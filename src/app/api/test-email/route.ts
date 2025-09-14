import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET(request: NextRequest) {
  try {
    // Create test account (free for testing)
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const mailOptions = {
      from: '"MedLove Reminders" <test@ethereal.email>',
      to: "pratikmishra79@gmail.com",
      subject: "💊 Test Email from MedLove",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f24ff0, #ff6b6b); padding: 30px; border-radius: 15px; text-align: center; color: white;">
            <h1 style="margin: 0;">💊 Test Email</h1>
            <p>If you receive this, your email system is working!</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    const previewUrl = nodemailer.getTestMessageUrl(info);

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      previewUrl: previewUrl,
      message: "Test email sent successfully!",
    });
  } catch (error) {
    console.error("Failed to send test email:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send test email" },
      { status: 500 }
    );
  }
}
