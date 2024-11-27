import { resolveProxyEmail } from "@/lib/services/emailResolver";
import { sendEmail } from "@/lib/services/resend";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();

    const emailData = JSON.parse(rawBody);

    const resolvedEmail = await resolveProxyEmail(
      emailData.ToFull[0].Email as string
    );

    if(!resolvedEmail) {
      return NextResponse.json({ error: "Proxy email not found" }, { status: 400 });
    }

    await sendEmail({
      to: resolvedEmail,
      subject: emailData.Subject,
      html: emailData.HtmlBody || emailData.TextBody,
    });

    return NextResponse.json({ success: true, resolvedEmail });
  } catch (error) {
    console.error("Postmark webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error: " + error },
      { status: 500 }
    );
  }
}
