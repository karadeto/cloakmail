import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId: clerkUserId } = auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.clerkUserId, clerkUserId));

    if (existingUser) {
      return NextResponse.json(existingUser);
    }

    const { email, firstName, lastName } = await request.json();

    // Create new user
    const newUser = await db
      .insert(users)
      .values({
        clerkUserId,
        email,
        firstName,
        lastName,
      })
      .returning();

    return NextResponse.json(newUser[0], { status: 201 });
  } catch (error) {
    console.error("Failed to create user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
