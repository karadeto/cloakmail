import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

const createdAt = timestamp("created_at").defaultNow().notNull();
const updatedAt = timestamp("updated_at")
  .defaultNow()
  .notNull()
  .$onUpdate(() => new Date());

// Tables
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkUserId: text("clerk_user_id").unique().notNull(),
  email: text("email").unique().notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt,
  updatedAt,
});

export const emailAliases = pgTable("email_aliases", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  aliasEmail: text("alias_email").notNull(),
  url: text("url"),
  notes: text("notes"),
  title: text("title").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  isFavorite: boolean("is_favorite").default(false).notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  createdAt,
  updatedAt,
});

export const domains = pgTable("domains", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  createdAt,
  updatedAt,
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  emailAliases: many(emailAliases),
}));

export const emailAliasesRelations = relations(emailAliases, ({ one }) => ({
  user: one(users, {
    fields: [emailAliases.userId],
    references: [users.id],
  }),
}));
