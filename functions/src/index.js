const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

// Initialize Firebase Admin
admin.initializeApp();

// Create transporter using Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: functions.config().gmail.user, // Your Gmail address
    pass: functions.config().gmail.pass, // Your Gmail app password
  },
});

// Scheduled medication reminder function
exports.scheduledMedicationReminder = functions.pubsub
  .schedule("every 5 minutes")
  .timeZone("UTC")
  .onRun(async (context) => {
    console.log("Starting medication reminder check...");

    try {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
      const currentDate = now.toISOString().split("T")[0]; // YYYY-MM-DD format

      console.log(`Checking for medications at ${currentTime}`);

      // Query for active medications with current time
      const medicationsSnapshot = await admin
        .firestore()
        .collection("medications")
        .where("isActive", "==", true)
        .where("times", "array-contains", currentTime)
        .get();

      if (medicationsSnapshot.empty) {
        console.log("No medications found for current time");
        return null;
      }

      const notifications = [];
      const batch = admin.firestore().batch();

      medicationsSnapshot.forEach((doc) => {
        const med = doc.data();
        notifications.push({
          userId: med.userId,
          medicationId: doc.id,
          medicationName: med.name,
          dosage: med.dosage,
          time: currentTime,
        });

        // Create medication log entry
        const logRef = admin.firestore().collection("medicationLogs").doc();
        batch.set(logRef, {
          userId: med.userId,
          medicationId: doc.id,
          medicationName: med.name,
          dosage: med.dosage,
          scheduledTime: currentTime,
          reminderSentAt: admin.firestore.FieldValue.serverTimestamp(),
          status: "reminder_sent",
          date: currentDate,
        });
      });

      // Commit the batch
      await batch.commit();
      console.log(`Created ${notifications.length} medication log entries`);

      // Send email reminders
      const emailPromises = notifications.map((notification) =>
        sendMedicationReminderEmail(notification)
      );

      await Promise.all(emailPromises);
      console.log(`Sent ${notifications.length} email reminders`);

      return null;
    } catch (error) {
      console.error("Error in scheduledMedicationReminder:", error);
      throw error;
    }
  });

// Function to send medication reminder email
async function sendMedicationReminderEmail(notification) {
  try {
    // Get user's email and preferences
    const userDoc = await admin
      .firestore()
      .collection("users")
      .doc(notification.userId)
      .get();

    if (!userDoc.exists) {
      console.log(`User ${notification.userId} not found`);
      return;
    }

    const userData = userDoc.data();
    const userEmail = userData.email;
    const userName = userData.name || userData.displayName || "there";

    if (!userEmail) {
      console.log(`No email found for user ${notification.userId}`);
      return;
    }

    // Check if user has already taken this medication today
    const today = new Date().toISOString().split("T")[0];
    const existingLog = await admin
      .firestore()
      .collection("medicationLogs")
      .where("userId", "==", notification.userId)
      .where("medicationId", "==", notification.medicationId)
      .where("date", "==", today)
      .where("status", "==", "taken")
      .get();

    if (!existingLog.empty) {
      console.log(
        `User ${notification.userId} already took ${notification.medicationName} today`
      );
      return;
    }

    // Send email reminder
    const mailOptions = {
      from: `"MedLove Reminders" <${functions.config().gmail.user}>`,
      to: userEmail,
      subject: `💊 Time for ${notification.medicationName}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f24ff0, #ff6b6b); padding: 30px; border-radius: 15px; text-align: center; color: white; margin-bottom: 20px;">
            <h1 style="margin: 0; font-size: 28px;">💊 Medication Reminder</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Hi ${userName}! It's time to take your medication</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 15px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">${notification.medicationName}</h2>
            <p style="color: #666; font-size: 18px; margin: 10px 0;">
              <strong>Dosage:</strong> ${notification.dosage}
            </p>
            <p style="color: #666; font-size: 18px; margin: 10px 0;">
              <strong>Scheduled Time:</strong> ${notification.time}
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://med-love-reminder.vercel.app?markTaken=${notification.medicationId}" 
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
    console.log(
      `Email sent successfully to user ${notification.userId}:`,
      info.messageId
    );

    // Update user's notification count
    await admin
      .firestore()
      .collection("users")
      .doc(notification.userId)
      .update({
        lastNotificationSent: admin.firestore.FieldValue.serverTimestamp(),
        notificationCount: admin.firestore.FieldValue.increment(1),
      });

    // Schedule follow-up reminder in 15 minutes
    await scheduleFollowUpReminder(notification, userEmail, userName, 1);
  } catch (error) {
    console.error(
      `Error sending email reminder to user ${notification.userId}:`,
      error
    );
  }
}

// Function to schedule follow-up email reminders
async function scheduleFollowUpReminder(
  notification,
  userEmail,
  userName,
  reminderCount
) {
  if (reminderCount > 3) {
    console.log(`Max reminders reached for user ${notification.userId}`);
    return;
  }

  // Schedule follow-up in 15 minutes
  setTimeout(async () => {
    try {
      // Check if user has taken the medication
      const today = new Date().toISOString().split("T")[0];
      const existingLog = await admin
        .firestore()
        .collection("medicationLogs")
        .where("userId", "==", notification.userId)
        .where("medicationId", "==", notification.medicationId)
        .where("date", "==", today)
        .where("status", "==", "taken")
        .get();

      if (!existingLog.empty) {
        console.log(
          `User ${notification.userId} has taken ${notification.medicationName}, no follow-up needed`
        );
        return;
      }

      // Send follow-up email
      const mailOptions = {
        from: `"MedLove Reminders" <${functions.config().gmail.user}>`,
        to: userEmail,
        subject: `⏰ Gentle Reminder: ${notification.medicationName} (${
          reminderCount + 1
        }${
          reminderCount + 1 === 2 ? "nd" : reminderCount + 1 === 3 ? "rd" : "th"
        } reminder)`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #ff9500, #ff6b6b); padding: 30px; border-radius: 15px; text-align: center; color: white; margin-bottom: 20px;">
              <h1 style="margin: 0; font-size: 28px;">⏰ Gentle Reminder</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Hi ${userName}! Just checking in about your medication</p>
            </div>
            
            <div style="background: #fff3cd; padding: 25px; border-radius: 15px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
              <h2 style="color: #856404; margin-top: 0;">${
                notification.medicationName
              }</h2>
              <p style="color: #856404; font-size: 18px; margin: 10px 0;">
                <strong>Dosage:</strong> ${notification.dosage}
              </p>
              <p style="color: #856404; font-size: 18px; margin: 10px 0;">
                <strong>Scheduled Time:</strong> ${notification.time}
              </p>
              <p style="color: #856404; font-size: 16px; margin: 10px 0;">
                <strong>This is your ${reminderCount + 1}${
          reminderCount + 1 === 2 ? "nd" : reminderCount + 1 === 3 ? "rd" : "th"
        } reminder</strong>
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://med-love-reminder.vercel.app?markTaken=${
                notification.medicationId
              }" 
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
      console.log(
        `Follow-up email sent to user ${notification.userId} (reminder ${
          reminderCount + 1
        }):`,
        info.messageId
      );

      // Schedule next follow-up if needed
      if (reminderCount < 3) {
        await scheduleFollowUpReminder(
          notification,
          userEmail,
          userName,
          reminderCount + 1
        );
      }
    } catch (error) {
      console.error(
        `Error in follow-up reminder for user ${notification.userId}:`,
        error
      );
    }
  }, 15 * 60 * 1000); // 15 minutes in milliseconds
}

// Function to handle medication taken
exports.markMedicationTaken = functions.https.onCall(async (data, context) => {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated"
    );
  }

  const { medicationId, dosage, time } = data;
  const userId = context.auth.uid;
  const today = new Date().toISOString().split("T")[0];

  try {
    // Check if already taken today
    const existingLog = await admin
      .firestore()
      .collection("medicationLogs")
      .where("userId", "==", userId)
      .where("medicationId", "==", medicationId)
      .where("date", "==", today)
      .where("status", "==", "taken")
      .get();

    if (!existingLog.empty) {
      throw new functions.https.HttpsError(
        "already-exists",
        "Medication already taken today"
      );
    }

    // Create medication log
    const logRef = admin.firestore().collection("medicationLogs").doc();
    await logRef.set({
      userId,
      medicationId,
      dosage,
      time,
      takenAt: admin.firestore.FieldValue.serverTimestamp(),
      status: "taken",
      date: today,
    });

    // Update streak
    await updateStreak(userId, medicationId);

    console.log(`Medication marked as taken for user ${userId}`);
    return { success: true, message: "Medication marked as taken!" };
  } catch (error) {
    console.error("Error marking medication as taken:", error);
    throw error;
  }
});

// Function to update user streak
async function updateStreak(userId, medicationId) {
  try {
    const streakRef = admin
      .firestore()
      .collection("streaks")
      .doc(`${userId}_${medicationId}`);
    const streakDoc = await streakRef.get();

    if (streakDoc.exists) {
      const streakData = streakDoc.data();
      const today = new Date();
      const lastTaken = streakData.lastTaken?.toDate();

      // Check if this is a consecutive day
      if (lastTaken) {
        const daysDiff = Math.floor(
          (today - lastTaken) / (1000 * 60 * 60 * 24)
        );
        if (daysDiff === 1) {
          // Consecutive day - increment streak
          await streakRef.update({
            currentStreak: admin.firestore.FieldValue.increment(1),
            lastTaken: admin.firestore.FieldValue.serverTimestamp(),
            longestStreak: admin.firestore.FieldValue.increment(1),
          });
        } else if (daysDiff > 1) {
          // Streak broken - reset
          await streakRef.update({
            currentStreak: 1,
            lastTaken: admin.firestore.FieldValue.serverTimestamp(),
          });
        }
        // If daysDiff === 0, already taken today, do nothing
      } else {
        // First time taking this medication
        await streakRef.set({
          userId,
          medicationId,
          currentStreak: 1,
          longestStreak: 1,
          lastTaken: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    } else {
      // Create new streak
      await streakRef.set({
        userId,
        medicationId,
        currentStreak: 1,
        longestStreak: 1,
        lastTaken: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  } catch (error) {
    console.error("Error updating streak:", error);
  }
}
