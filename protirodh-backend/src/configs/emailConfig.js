import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, //
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // this must be a Gmail App Password
  },
});



export const sendVerificationEmail = async (email, code) => {
  const mailOptions = {
    from: {
      name: 'Protirodh Team',
      address: process.env.EMAIL_USER,
    },
    to: email,
    subject: 'Verification Code — Do Not Reply',
    text: 
      `Your verification code is: ${code}\n\n` +
      `This code will expire in 10 minutes.\n\n` +
      `—\n` +
      `Please do *not reply* to this email. ` +
      `This mailbox is not monitored.`,
  };

  await transporter.sendMail(mailOptions);
};

export const sendCustomEmail = async (email, subject, bodyHtml, plainText) => {
  const mailOptions = {
    from: {
      name: 'Protirodh Team',
      address: process.env.EMAIL_USER,
    },
    to: email,
    subject,
    html: bodyHtml,
    // use provided plain-text fallback or strip HTML tags
    text: plainText || (typeof bodyHtml === 'string' ? bodyHtml.replace(/<[^>]*>/g, '') : undefined),
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};


export default sendVerificationEmail;