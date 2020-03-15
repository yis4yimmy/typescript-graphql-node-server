import { Redis } from "ioredis";
import { EmailParams } from "../../services/sendMail";
import { createConfirmEmailIUrl } from "../createConfirmEmailUrl";

interface ConfirmEmailParams {
  userId: string;
  userEmail: string;
}

export const confirmEmail = async (
  confirmEmailParams: ConfirmEmailParams,
  redisClient: Redis
): Promise<EmailParams> => {
  const { userId, userEmail } = confirmEmailParams;

  const confirmEmailUrl = await createConfirmEmailIUrl(
    { id: userId },
    redisClient
  );

  const text = `Thank you for registering with App. Before you can start using your account, we need to confirm your email. Please follow this link to verify your email address: ${confirmEmailUrl}`;

  const html = `<p>Thank you for registering with App. Before you can start using your account, we need to confirm your email.</p>
    <p>Click "Verify Email" below to verify your email address:</p>
    <a href=${confirmEmailUrl}>Verify email</a>`;

  return {
    from: '"Confirm Email" <noreply@app.com>',
    to: userEmail,
    subject: "App - Confirm your email address",
    text,
    html
  };
};
