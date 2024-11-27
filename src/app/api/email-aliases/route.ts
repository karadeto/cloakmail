import { db } from "@/drizzle/db";
import { domains, emailAliases, users } from "@/drizzle/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq, sql, like } from "drizzle-orm";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

// Helper function to get user's UUID from Clerk ID
async function getUserIdFromClerkId(clerkUserId: string) {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.clerkUserId, clerkUserId));

  if (!user) {
    throw new Error("User not found");
  }

  const userId = user[0]?.id;
  console.log("userId", userId);
  return userId;
}

// GET all email aliases for the authenticated user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeDeleted = searchParams.get("includeDeleted") === "true";

    const { userId: clerkUserId } = auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's UUID from their Clerk ID
    const userId = await getUserIdFromClerkId(clerkUserId);

    const userAliases = await db
      .select()
      .from(emailAliases)
      .where(
        includeDeleted
          ? eq(emailAliases.userId, userId)
          : and(
              eq(emailAliases.userId, userId),
              eq(emailAliases.isDeleted, false)
            )
      );

    return NextResponse.json(userAliases);
  } catch (error) {
    console.error("Failed to fetch email aliases:", error);
    return NextResponse.json(
      { error: "Failed to fetch email aliases" },
      { status: 500 }
    );
  }
}

// POST create a new email alias
export async function POST(request: Request) {
  try {
    const { userId: clerkUserId } = auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's UUID from their Clerk ID
    const userId = await getUserIdFromClerkId(clerkUserId);

    // Get domain with least aliases using a subquery
    const domainWithCount = await db
      .select({
        id: domains.id,
        name: domains.name,
        aliasCount: sql<number>`count(${emailAliases.id})`
      })
      .from(domains)
      .leftJoin(
        emailAliases,
        sql`${emailAliases.aliasEmail} like '%@' || ${domains.name}`
      )
      .groupBy(domains.id, domains.name)
      .orderBy(sql`count(${emailAliases.id})`)
      .limit(1);

    if (!domainWithCount.length) {
      return NextResponse.json(
        { error: "No domains available" },
        { status: 500 }
      );
    }

    const leastUsedDomain = domainWithCount[0];
    const aliasEmail = `${nanoid()}@${leastUsedDomain.name}`;
    const { title, notes, url } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newAlias = await db
      .insert(emailAliases)
      .values({
        userId,
        title,
        notes,
        aliasEmail,
        url,
        isActive: true,
      })
      .returning();

    return NextResponse.json(newAlias[0], { status: 201 });
  } catch (error) {
    console.error("Failed to create email alias:", error);
    return NextResponse.json(
      { error: "Failed to create email alias" },
      { status: 500 }
    );
  }
}

// PATCH update an email alias
export async function PATCH(request: Request) {
  try {
    const { userId: clerkUserId } = auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's UUID from their Clerk ID
    const userId = await getUserIdFromClerkId(clerkUserId);

    const { id, title, notes, url, isActive } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Missing alias ID" }, { status: 400 });
    }

    // Verify ownership
    const existingAlias = await db
      .select()
      .from(emailAliases)
      .where(and(eq(emailAliases.id, id), eq(emailAliases.userId, userId)));

    if (!existingAlias.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updatedAlias = await db
      .update(emailAliases)
      .set({
        url: url || existingAlias[0].url,
        title: title || existingAlias[0].title,
        notes: notes || existingAlias[0].notes,
        isActive: isActive ?? existingAlias[0].isActive,
      })
      .where(eq(emailAliases.id, id))
      .returning();

    return NextResponse.json(updatedAlias[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update email alias: " + error },
      { status: 500 }
    );
  }
}
