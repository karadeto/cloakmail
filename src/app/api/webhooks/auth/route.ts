import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { WebhookEvent } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

export async function POST(request: Request) {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  const wh = new Webhook(SIGNING_SECRET);

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  const payload = await request.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  const { id } = evt.data;
  const eventType = evt.type;
  console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
  console.log("Webhook payload:", body);

  if (eventType === "user.created" || eventType === "user.updated") {
    const emailAddress = evt.data.email_addresses?.[0]?.email_address;
    if (!emailAddress) {
      return new Response("User must have an email address", {
        status: 400,
      });
    }

    if (eventType === "user.created") {
      await db.insert(users).values({
        clerkUserId: evt.data.id,
        email: emailAddress,
        firstName: evt.data.first_name ?? "",
        lastName: evt.data.last_name ?? "",
      });
    } else {
      await db
        .update(users)
        .set({
          email: emailAddress,
          firstName: evt.data.first_name ?? "",
          lastName: evt.data.last_name ?? "",
        })
        .where(eq(users.clerkUserId, evt.data.id));
    }
  }

  if (eventType === "user.deleted") {
    await db.delete(users).where(eq(users.clerkUserId, evt.data.id));
  }

  console.log("Webhook Secret:", process.env.CLERK_WEBHOOK_SECRET);

  return NextResponse.json({ success: true });
}
