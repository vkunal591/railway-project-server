import { transporter, mailOptions } from "#configs/nodeMailer"; // adjust path if needed

export const sendEmail = async (to, subject, html) => {
  const options = mailOptions(to, subject, html);
  try {
    const info = await transporter.sendMail(options);
    console.log("Email sent: " + info.response);
    return true;
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
};

