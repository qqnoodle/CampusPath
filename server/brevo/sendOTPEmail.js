require(`dotenv`).config();
const { brevoClient } = require('./brevoClient.js');

const renderHTMLTemplate = (OTP) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Verification Code</title>
        </head>

        <body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">

          <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;background:#f4f6f9;">
            <tr>
              <td align="center">

                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">

                  <!-- Header -->
                  <tr>
                    <td align="center" style="background:#2563eb;padding:32px;">
                      <h1 style="margin:0;color:#ffffff;font-size:28px;">
                      CampusPath
                      </h1>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding:48px 40px;">

                      <h2 style="margin-top:0;color:#222;font-size:28px;">
                        Verification Code
                      </h2>

                      <p style="font-size:16px;color:#555;line-height:1.6;">
                        Use the following one-time password (OTP) to continue.
                      </p>

                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding:30px 0;">
                            <div
                              style="
                                display:inline-block;
                                background:#f3f4f6;
                                border:2px dashed #2563eb;
                                border-radius:10px;
                                padding:18px 40px;
                                font-size:36px;
                                font-weight:bold;
                                letter-spacing:10px;
                                color:#2563eb;
                                font-family:Courier New, monospace;
                              "
                            >
                              ${OTP}
                            </div>
                          </td>
                        </tr>
                      </table>

                      <p style="font-size:16px;color:#555;line-height:1.6;">
                        This code expires in <strong>5 minutes</strong>.
                      </p>

                      <p style="font-size:16px;color:#555;line-height:1.6;">
                        If you didn't request this code, you can safely ignore this email.
                      </p>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td
                      align="center"
                      style="
                        padding:24px;
                        border-top:1px solid #eeeeee;
                        font-size:13px;
                        color:#888888;
                      "
                    >
                      Please do not reply to this email.<br>
                      ©CampusPathAdmin
                    </td>
                  </tr>

                </table>

              </td>
            </tr>
          </table>

        </body>
        </html>
    `;
}

/*
 * @params {string} recipientEmail - email of recipient
 * @params {number} OTP -  6 digit OTP meant to be sent in the email to recipient
 * 
 * @returns {Promise<
 *   | { success: true, messageId: string }
 *   | { success: false, message: string }
 * >}
 */
const sendOTPEmail = async (recipientEmail, OTP) => {
    try {
        const response = await brevoClient.transactionalEmails.sendTransacEmail(
            {
                sender: {
                    email: process.env.BREVO_SENDER_EMAIL,
                    name: process.env.BREVO_SENDER_NAME
                },
                to: [{ email: recipientEmail }],
                subject: "verification OTP CampusPath",
                htmlContent: renderHTMLTemplate(OTP),
            }
        );
        return {
            success: true,
            messageId: response.messageId
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

module.exports = {
    sendOTPEmail
};
