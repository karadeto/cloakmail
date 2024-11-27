import { db } from "@/drizzle/db";
import { emailAliases } from "@/drizzle/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: clerkUserId } = auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const alias = await db
      .select()
      .from(emailAliases)
      .where(eq(emailAliases.id, params.id));

    if (!alias.length) {
      return NextResponse.json({ error: "Alias not found" }, { status: 404 });
    }

    const updatedAlias = await db
      .update(emailAliases)
      .set({
        isDeleted: !alias[0].isDeleted,
      })
      .where(eq(emailAliases.id, params.id))
      .returning();

    return NextResponse.json(updatedAlias[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to mark as deleted: " + error },
      { status: 500 }
    );
  }
}
