ALTER TABLE "email_aliases" RENAME COLUMN "description" TO "notes";--> statement-breakpoint
ALTER TABLE "email_aliases" ALTER COLUMN "url" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "email_aliases" ADD COLUMN "title" text NOT NULL;