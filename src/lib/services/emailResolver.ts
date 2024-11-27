import { db } from "@/drizzle/db";
import { emailAliases, users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const resolveProxyEmail = async (proxyEmail: string) => {
  const alias = await db
    .select()
    .from(emailAliases)
    .where(eq(emailAliases.aliasEmail, proxyEmail))
    .then((res) => res[0]);

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, alias.userId))
    .then((res) => res[0]);

  return user.email;
};
