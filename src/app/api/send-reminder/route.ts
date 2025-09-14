import { NextRequest, NextResponse } from "next/server";
import { sendMedicationReminder } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { userEmail, userName, medicationName, dosage, time, medicationId } =
      await request.json();

    // Use the centralized email function
    const info = await sendMedicationReminder({
      userEmail,
      userName,
      medicationName,
      dosage,
      time,
      medicationId,
    });

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
