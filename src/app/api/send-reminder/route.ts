import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Create transporter using Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your Gmail app password
  },
});

export async function POST(request: NextRequest) {
  try {
    const { userEmail, userName, medicationName, dosage, time, medicationId } =
      await request.json();

    // Send email reminder
    const mailOptions = {
      from: `"MedLove Reminders" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `💊 Time for ${medicationName}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f24ff0, #ff6b6b); padding: 30px; border-radius: 15px; text-align: center; color: white; margin-bottom: 20px;">
            <h1 style="margin: 0; font-size: 28px;">💊 Medication Reminder</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Hi ${userName}! It's time to take your medication</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 15px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">${medicationName}</h2>
            <p style="color: #666; font-size: 18px; margin: 10px 0;">
              <strong>Dosage:</strong> ${dosage}
            </p>
            <p style="color: #666; font-size: 18px; margin: 10px 0;">
              <strong>Scheduled Time:</strong> ${time}
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${
              process.env.NEXT_PUBLIC_APP_URL ||
              "https://med-love-reminder.vercel.app"
            }?markTaken=${medicationId}" 
               style="background: linear-gradient(135deg, #f24ff0, #ff6b6b); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              ✅ Mark as Taken
            </a>
          </div>
          
          <div style="background: #e3f2fd; padding: 20px; border-radius: 10px; margin-top: 20px;">
            <p style="color: #1976d2; margin: 0; text-align: center; font-size: 14px;">
              💕 Remember: Taking your medication on time helps you stay healthy and strong!
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>This reminder was sent by MedLove - Your caring medication companion</p>
            <p>If you've already taken this medication, please click "Mark as Taken" above</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      message: "Email reminder sent successfully!",
    });
  } catch (error) {
    console.error("Failed to send email reminder:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email reminder" },
      { status: 500 }
    );
  }
}
