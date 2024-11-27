import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not defined");
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export type EmailPayload = {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string;
};

export async function sendEmail(payload: EmailPayload) {
  const { to, subject, html, text, from, replyTo } = payload;

  return resend.emails.send({
    from: from || "info@cloakmail.co",
    to,
    subject,
    html: html ?? "",
    text: text ?? "",
    replyTo,
  });
}
