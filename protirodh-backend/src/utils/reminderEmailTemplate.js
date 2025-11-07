
export function buildVaccinationReminderEmail(params) {
    const {
      userName = "Valued User",
      vaccineName = "your vaccine",
      centerName = "your registered center",
      date,
      additionalInfo = "",
      actionUrl = ""
    } = params || {};
  
    // small sanitizer for plain text -> HTML
    const escapeHTML = (s) =>
      String(s || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
  
    // format date nicely
    const formatDate = (d) => {
      if (!d) return "";
      const dt = d instanceof Date ? d : new Date(d);
      if (isNaN(dt)) return escapeHTML(String(d));
      // Example: Sunday, Nov 9, 2025 at 10:00 AM
      return dt.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    };
  
    const safeName = escapeHTML(userName);
    const safeVaccine = escapeHTML(vaccineName);
    const safeCenter = escapeHTML(centerName);
    const safeDate = escapeHTML(formatDate(date));
    const safeAdditional = escapeHTML(additionalInfo);
    const safeActionUrl = escapeHTML(actionUrl);
  
    // Inline CSS and table layout for email compatibility
    return `
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Vaccination Reminder</title>
      <style>
        /* Client-safe reset */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; }
  
        /* Basic styling */
        body {
          margin: 0;
          padding: 0;
          background-color: #f4faf6; /* very light green */
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial;
          color: #1f2933;
          -webkit-font-smoothing: antialiased;
        }
        .email-container {
          width: 100%;
          max-width: 680px;
          margin: 24px auto;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 6px 18px rgba(31,41,51,0.06);
          border: 1px solid #e6f3ea;
        }
        .header {
          background: linear-gradient(90deg, #e6f7ec 0%, #d7f2e3 100%);
          padding: 22px 28px;
          text-align: left;
        }
        .brand {
          font-weight: 700;
          color: #127a3a;
          font-size: 20px;
          letter-spacing: 0.2px;
        }
        .hero {
          padding: 28px;
        }
        h1 {
          margin: 0 0 8px 0;
          font-size: 22px;
          color: #0f5132;
        }
        p {
          margin: 8px 0 16px 0;
          line-height: 1.45;
        }
        .badge {
          display: inline-block;
          background: #eaf6ee;
          color: #0f5132;
          padding: 8px 12px;
          border-radius: 999px;
          font-weight: 600;
          font-size: 13px;
          margin-bottom: 12px;
        }
        .info-card {
          background: #f8fffb;
          border: 1px solid #e6f3ea;
          padding: 14px 16px;
          border-radius: 8px;
          margin-bottom: 16px;
        }
        .row {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }
        .label {
          font-size: 12px;
          color: #6b7280;
        }
        .value {
          font-weight: 700;
          font-size: 15px;
          color: #0f5132;
        }
        .cta {
          display: inline-block;
          background: #16a34a;
          color: #fff;
          padding: 12px 18px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 700;
        }
        .footer {
          padding: 16px 28px;
          font-size: 13px;
          color: #6b7280;
          text-align: center;
          background: #fbfffc;
        }
        @media (max-width: 520px) {
          .hero { padding: 18px; }
          .header { padding: 16px; }
        }
      </style>
    </head>
    <body>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #f4faf6; width:100%;">
        <tr>
          <td align="center">
            <div class="email-container" role="article" aria-roledescription="email">
              <div class="header" style="text-align:left;">
                <div class="brand">Protirodh</div>
              </div>
  
              <div class="hero">
                <span class="badge">Vaccination Reminder</span>
                <h1>Hi ${safeName},</h1>
                <p>
                  This is a friendly reminder that your <strong>${safeVaccine}</strong> vaccination is coming up soon.
                </p>
  
                <div class="info-card">
                  <div style="margin-bottom:8px;">
                    <div class="label">Vaccine</div>
                    <div class="value">${safeVaccine}</div>
                  </div>
  
                  <div style="margin-bottom:8px;">
                    <div class="label">When</div>
                    <div class="value">${safeDate}</div>
                  </div>
  
                  <div style="margin-bottom:8px;">
                    <div class="label">Where</div>
                    <div class="value">${safeCenter}</div>
                  </div>
  
                  ${safeAdditional ? `
                    <div style="margin-top:8px;">
                      <div class="label">Note</div>
                      <div class="value" style="font-weight:500; font-size:14px;">${safeAdditional}</div>
                    </div>
                  ` : ""}
                </div>
  
                ${safeActionUrl ? `
                  <p style="margin-bottom:0;">
                    <a class="cta" href="${safeActionUrl}" target="_blank" rel="noopener noreferrer">View appointment details</a>
                  </p>
                ` : ""}
  
                <p style="margin-top:18px; color:#475569; font-size:14px;">
                  If you have already attended or rescheduled, please ignore this message.
                </p>
              </div>
  
              <div class="footer">
                <div style="margin-bottom:6px;">Protirodh Team</div>
                <div style="font-size:12px; color:#9aa4a3;">
                  Need help? Reply to this email or visit our app.
                </div>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
  }
  
  /* -----------------------
   Example usage:
  
   import { buildVaccinationReminderEmail } from './emailTemplates.js';
  
   const html = buildVaccinationReminderEmail({
     userName: "Rohit Sen",
     vaccineName: "Hepatitis B (2nd dose)",
     centerName: "Dhaka Health Center",
     date: "2025-11-09T10:00:00Z",
     additionalInfo: "Bring your vaccination card and wear a mask.",
     actionUrl: "https://protirodh.app/appointments/abc123"
   });
  
   sendCustomEmail(user.email, "Upcoming Vaccination Reminder", html);
  
  ------------------------- */
  