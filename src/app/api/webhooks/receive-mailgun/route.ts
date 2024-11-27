import { resolveProxyEmail } from "@/lib/services/emailResolver";
import { sendEmail } from "@/lib/services/resend";
import crypto from "crypto";
import { NextResponse } from "next/server";

const WEBHOOK_SIGNING_KEY = process.env.MAILGUN_WEBHOOK_SIGNING_KEY;

function verifyWebhookSignature(
  timestamp: string,
  token: string,
  signature: string
): boolean {
  const encodedToken = crypto
    .createHmac("sha256", WEBHOOK_SIGNING_KEY!)
    .update(timestamp.concat(token))
    .digest("hex");
  return encodedToken === signature;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const timestamp = formData.get("timestamp") as string;
    const token = formData.get("token") as string;
    const signature = formData.get("signature") as string;

    if (!verifyWebhookSignature(timestamp, token, signature)) {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    const emailData = {
      from: formData.get("from"),
      sender: formData.get("sender"),
      subject: formData.get("subject"),
      recipient: formData.get("recipient"),
      bodyPlain: formData.get("body-plain"),
      bodyHtml: formData.get("body-html"),
      attachments: formData.getAll("attachment-[1-9]+"),
    };

    const resolvedEmail = await resolveProxyEmail(
      emailData.recipient as string
    );

    if(!resolvedEmail) {
      return NextResponse.json({ error: "Proxy email not found" }, { status: 400 });
    }

    await sendEmail({
      to: resolvedEmail,
      subject: emailData.subject as string,
      html: emailData.bodyHtml as string,
    });

    return NextResponse.json({ success: true, resolvedEmail });
  } catch (error) {
    console.error("Mailgun webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error: " + error },
      { status: 500 }
    );
  }
}
