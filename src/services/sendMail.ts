import nodemailer, { SentMessageInfo } from "nodemailer";

export interface EmailParams {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

export const sendMail = async (
  emailParams: EmailParams
): Promise<SentMessageInfo> => {
  const account = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    ...account.smtp,
    auth: {
      user: account.user,
      pass: account.pass
    }
  });

  const sentMessageInfo = await transporter.sendMail(emailParams);

  return sentMessageInfo;
};
