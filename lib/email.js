import { Resend } from "resend";

// Initialize Resend client lazily to prevent static build crashes on Vercel
let resendClient = null;

function getResendClient() {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    resendClient = new Resend(apiKey || "re_dummy_key_for_vercel_builds");
  }
  return resendClient;
}

/**
 * Send appointment confirmation receipt email
 */
export async function sendAppointmentReceipt({
  patientEmail,
  patientName,
  doctorName,
  doctorSpecialty,
  appointmentDate,
  appointmentTime,
  amountPaid,
  transactionId,
  appointmentId,
}) {
  try {
    const resend = getResendClient();
    const { data, error } = await resend.emails.send({
      from: "Docfone <onboarding@resend.dev>",
      to: [patientEmail],
      subject: `✅ Appointment Confirmed - Dr. ${doctorName} | Docfone`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Appointment Receipt</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0f1a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0f1a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:linear-gradient(135deg,#0d1f2d 0%,#0a1628 100%);border-radius:20px;border:1px solid rgba(16,185,129,0.2);overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#065f46 0%,#047857 50%,#059669 100%);padding:40px 40px 30px;text-align:center;">
              <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:50%;padding:16px;margin-bottom:16px;">
                <span style="font-size:36px;">✅</span>
              </div>
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">Appointment Confirmed!</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:16px;">Your booking is confirmed. See you soon!</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              
              <p style="color:#94a3b8;font-size:15px;margin:0 0 24px;">Hello <strong style="color:#10b981;">${patientName}</strong>,</p>
              <p style="color:#94a3b8;font-size:15px;margin:0 0 32px;line-height:1.6;">
                Your appointment with <strong style="color:#ffffff;">Dr. ${doctorName}</strong> has been successfully booked and your payment has been received. Please find your appointment details below.
              </p>

              <!-- Appointment Details Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(16,185,129,0.05);border:1px solid rgba(16,185,129,0.2);border-radius:16px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;border-bottom:1px solid rgba(16,185,129,0.15);">
                    <p style="margin:0;color:#6b7280;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Appointment Details</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                          <span style="color:#6b7280;font-size:14px;">👨‍⚕️ Doctor</span>
                          <br/><strong style="color:#ffffff;font-size:15px;">Dr. ${doctorName}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                          <span style="color:#6b7280;font-size:14px;">🏥 Specialty</span>
                          <br/><strong style="color:#10b981;font-size:15px;">${doctorSpecialty}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                          <span style="color:#6b7280;font-size:14px;">📅 Date</span>
                          <br/><strong style="color:#ffffff;font-size:15px;">${appointmentDate}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0;">
                          <span style="color:#6b7280;font-size:14px;">🕐 Time</span>
                          <br/><strong style="color:#ffffff;font-size:15px;">${appointmentTime}</strong>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Payment Receipt Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.3);border-radius:16px;overflow:hidden;margin-bottom:32px;">
                <tr>
                  <td style="padding:20px 24px;border-bottom:1px solid rgba(16,185,129,0.2);background:rgba(16,185,129,0.1);">
                    <p style="margin:0;color:#10b981;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">💳 Payment Receipt</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                          <table width="100%">
                            <tr>
                              <td style="color:#9ca3af;font-size:14px;">Consultation Fee</td>
                              <td align="right" style="color:#ffffff;font-size:14px;">₹${amountPaid}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                          <table width="100%">
                            <tr>
                              <td style="color:#9ca3af;font-size:14px;">Payment Method</td>
                              <td align="right" style="color:#ffffff;font-size:14px;">UPI</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                          <table width="100%">
                            <tr>
                              <td style="color:#9ca3af;font-size:14px;">Transaction ID</td>
                              <td align="right" style="color:#10b981;font-size:13px;font-family:monospace;">${transactionId}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:12px 0 0;">
                          <table width="100%" style="background:rgba(16,185,129,0.1);border-radius:8px;padding:12px;">
                            <tr>
                              <td style="color:#10b981;font-size:15px;font-weight:700;">Total Paid</td>
                              <td align="right" style="color:#10b981;font-size:22px;font-weight:800;">₹${amountPaid}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Important Note -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(251,191,36,0.05);border:1px solid rgba(251,191,36,0.2);border-radius:12px;margin-bottom:32px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 8px;color:#fbbf24;font-size:13px;font-weight:700;">⚠️ IMPORTANT REMINDERS</p>
                    <ul style="margin:0;padding-left:20px;color:#9ca3af;font-size:13px;line-height:2;">
                      <li>Please join the video call 5 minutes before your appointment time.</li>
                      <li>Keep your medical records / reports ready to share with the doctor.</li>
                      <li>You can view and join your appointment from the <strong style="color:#10b981;">My Appointments</strong> section.</li>
                      <li>For any queries, contact us on WhatsApp: <strong style="color:#10b981;">+91 8115462049</strong></li>
                    </ul>
                  </td>
                </tr>
              </table>

              <p style="color:#6b7280;font-size:13px;text-align:center;margin:0;">
                Booking ID: <span style="color:#10b981;font-family:monospace;">${appointmentId}</span>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
              <p style="margin:0 0 8px;color:#10b981;font-size:18px;font-weight:700;">🏥 Docfone</p>
              <p style="margin:0;color:#4b5563;font-size:12px;">Your Trusted Healthcare Partner</p>
              <p style="margin:8px 0 0;color:#374151;font-size:11px;">This is an automated email. Please do not reply to this email.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });

    if (error) {
      console.error("Failed to send receipt email:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Email sending error:", err);
    return { success: false, error: err.message };
  }
}
