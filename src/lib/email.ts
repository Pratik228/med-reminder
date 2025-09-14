import nodemailer from "nodemailer";

// Create transporter using Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your Gmail app password
  },
});

export interface EmailReminderData {
  userEmail: string;
  userName: string;
  medicationName: string;
  dosage: string;
  time: string;
  medicationId: string;
}

export const sendMedicationReminder = async (data: EmailReminderData) => {
  try {
    const { userEmail, userName, medicationName, dosage, time, medicationId } =
      data;

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
              process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
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
    return info;
  } catch (error) {
    console.error("Failed to send medication reminder email:", error);
    throw error;
  }
};

export const sendFollowUpReminder = async (
  data: EmailReminderData & { reminderCount: number }
) => {
  try {
    const {
      userEmail,
      userName,
      medicationName,
      dosage,
      time,
      medicationId,
      reminderCount,
    } = data;

    const mailOptions = {
      from: `"MedLove Reminders" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `⏰ Gentle Reminder: ${medicationName} (${reminderCount}${
        reminderCount === 2 ? "nd" : reminderCount === 3 ? "rd" : "th"
      } reminder)`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ff9500, #ff6b6b); padding: 30px; border-radius: 15px; text-align: center; color: white; margin-bottom: 20px;">
            <h1 style="margin: 0; font-size: 28px;">⏰ Gentle Reminder</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Hi ${userName}! Just checking in about your medication</p>
          </div>
          
          <div style="background: #fff3cd; padding: 25px; border-radius: 15px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
            <h2 style="color: #856404; margin-top: 0;">${medicationName}</h2>
            <p style="color: #856404; font-size: 18px; margin: 10px 0;">
              <strong>Dosage:</strong> ${dosage}
            </p>
            <p style="color: #856404; font-size: 18px; margin: 10px 0;">
              <strong>Scheduled Time:</strong> ${time}
            </p>
            <p style="color: #856404; font-size: 16px; margin: 10px 0;">
              <strong>This is your ${reminderCount}${
        reminderCount === 2 ? "nd" : reminderCount === 3 ? "rd" : "th"
      } reminder</strong>
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${
              process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
            }?markTaken=${medicationId}" 
               style="background: linear-gradient(135deg, #ff9500, #ff6b6b); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              ✅ Mark as Taken
            </a>
          </div>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin-top: 20px;">
            <p style="color: #856404; margin: 0; text-align: center; font-size: 14px;">
              💕 No worries if you're running late! Your health journey is important to us.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>This follow-up reminder was sent by MedLove</p>
            <p>If you've already taken this medication, please click "Mark as Taken" above</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Follow-up email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Failed to send follow-up reminder email:", error);
    throw error;
  }
};
