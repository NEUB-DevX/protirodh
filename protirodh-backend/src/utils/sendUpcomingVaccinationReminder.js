import { sendCustomEmail } from '../configs/emailConfig.js';
import User from '../models/User.model.js';
import { buildVaccinationReminderEmail } from './reminderEmailTemplate.js';

export async function sendUpcomingVaccinationReminder() {
  try {
    const users = await User.find({}); // Fetch all users

    users.forEach(user => {
      if (Array.isArray(user.vaccines)) {
        user.vaccines.forEach(vaccine => {
          if (Array.isArray(vaccine.doses)) {
            vaccine.doses.forEach(dose => {
              if (dose.status !== 'Taken' && dose.date) {
                const timeLeft = new Date(dose.date) - new Date();

                // Less than 48 hours left
                if (timeLeft > 0 && timeLeft <= 48 * 60 * 60 * 1000) {
                    console.log(`User: ${user.email}, Vaccine: ${dose.name}`);
                    
                    const html = buildVaccinationReminderEmail({
                        userName: user.name,
                        vaccineName: dose.name,
                        centerName: vaccine.center?.name || 'your registered center',
                        date: dose.date,
                        additionalInfo: "Please bring your vaccination card and arrive 15 minutes early.",
                      });

                  sendCustomEmail(
                    user.email,
                    'Upcoming Vaccination Reminder',
                    html
                  );
                }
              }
            });
          }
        });
      }
    });
  } catch (error) {
    console.error('Error while sending vaccination reminders:', error);
  }
}
