import { db } from "@/drizzle/db";
import { emailAliases } from "@/drizzle/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// DELETE an email alias
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: clerkUserId } = auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!params.id) {
      return NextResponse.json({ error: "Missing alias ID" }, { status: 400 });
    }

    // Verify ownership
    const existingAliases = await db
      .select()
      .from(emailAliases)
      .where(eq(emailAliases.id, params.id));

    if (!existingAliases.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await db.delete(emailAliases).where(eq(emailAliases.id, params.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete email alias: " + error },
      { status: 500 }
    );
  }
}
