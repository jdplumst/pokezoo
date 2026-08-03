ALTER TABLE "account" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "providerAccountId" TO "account_id";--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "provider" TO "provider_id";--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "expires_at" TO "access_token_expires_at";--> statement-breakpoint
ALTER TABLE "session" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "session" RENAME COLUMN "sessionToken" TO "token";--> statement-breakpoint
ALTER TABLE "session" RENAME COLUMN "expires" TO "expires_at";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "emailVerified" TO "email_verified";--> statement-breakpoint
ALTER TABLE "verificationToken" RENAME COLUMN "token" TO "value";--> statement-breakpoint
ALTER TABLE "verificationToken" RENAME COLUMN "expires" TO "expires_at";--> statement-breakpoint
ALTER TABLE "account" DROP CONSTRAINT "account_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT "session_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "account" DROP CONSTRAINT "account_provider_providerAccountId_pk";--> statement-breakpoint
ALTER TABLE "verificationToken" DROP CONSTRAINT "verificationToken_identifier_token_pk";--> statement-breakpoint
-- ALTER TABLE "user" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
-- backfill name before enforcing NOT NULL
UPDATE "user" SET "name" = COALESCE("name", split_part("email", '@', 1)) WHERE "name" IS NULL;
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "email" SET DATA TYPE varchar(255);--> statement-breakpoint
-- ALTER TABLE "account" ADD COLUMN "id" text PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "id" text;
--> statement-breakpoint
UPDATE "account" SET "id" = gen_random_uuid()::text WHERE "id" IS NULL;
--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "account" ADD PRIMARY KEY ("id");
--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "refresh_token_expires_at" timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "password" text;--> statement-breakpoint
-- ALTER TABLE "account" ADD COLUMN "created_at" timestamp (6) with time zone NOT NULL;--> statement-breakpoint
-- ALTER TABLE "account" ADD COLUMN "updated_at" timestamp (6) with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "created_at" timestamp (6) with time zone;
--> statement-breakpoint
UPDATE "account" SET "created_at" = now() WHERE "created_at" IS NULL;
--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "created_at" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "updated_at" timestamp (6) with time zone;
--> statement-breakpoint
UPDATE "account" SET "updated_at" = now() WHERE "updated_at" IS NULL;
--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "updated_at" SET NOT NULL;
--> statement-breakpoint
-- ALTER TABLE "session" ADD COLUMN "id" text PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "id" text;
--> statement-breakpoint
UPDATE "session" SET "id" = gen_random_uuid()::text WHERE "id" IS NULL;
--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT "session_pkey";
--> statement-breakpoint
ALTER TABLE "session" ADD PRIMARY KEY ("id");
--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "ip_address" text;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "user_agent" text;--> statement-breakpoint
-- ALTER TABLE "session" ADD COLUMN "created_at" timestamp (6) with time zone NOT NULL;--> statement-breakpoint
-- ALTER TABLE "session" ADD COLUMN "updated_at" timestamp (6) with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "created_at" timestamp (6) with time zone;
--> statement-breakpoint
UPDATE "session" SET "created_at" = now() WHERE "created_at" IS NULL;
--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "created_at" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "updated_at" timestamp (6) with time zone;
--> statement-breakpoint
UPDATE "session" SET "updated_at" = now() WHERE "updated_at" IS NULL;
--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "updated_at" SET NOT NULL;
--> statement-breakpoint
-- ALTER TABLE "user" ADD COLUMN "created_at" timestamp (6) with time zone NOT NULL;--> statement-breakpoint
-- ALTER TABLE "user" ADD COLUMN "updated_at" timestamp (6) with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "created_at" timestamp (6) with time zone;
--> statement-breakpoint
UPDATE "user" SET "created_at" = now() WHERE "created_at" IS NULL;
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "created_at" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "updated_at" timestamp (6) with time zone;
--> statement-breakpoint
UPDATE "user" SET "updated_at" = now() WHERE "updated_at" IS NULL;
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "updated_at" SET NOT NULL;
--> statement-breakpoint
-- ALTER TABLE "verificationToken" ADD COLUMN "id" text PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "verificationToken" ADD COLUMN "id" text;
--> statement-breakpoint
UPDATE "verificationToken" SET "id" = gen_random_uuid()::text WHERE "id" IS NULL;
--> statement-breakpoint
ALTER TABLE "verificationToken" ALTER COLUMN "id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "verificationToken" ADD PRIMARY KEY ("id");
--> statement-breakpoint
-- ALTER TABLE "verificationToken" ADD COLUMN "created_at" timestamp (6) with time zone NOT NULL;--> statement-breakpoint
-- ALTER TABLE "verificationToken" ADD COLUMN "updated_at" timestamp (6) with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "verificationToken" ADD COLUMN "created_at" timestamp (6) with time zone;
--> statement-breakpoint
UPDATE "verificationToken" SET "created_at" = now() WHERE "created_at" IS NULL;
--> statement-breakpoint
ALTER TABLE "verificationToken" ALTER COLUMN "created_at" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "verificationToken" ADD COLUMN "updated_at" timestamp (6) with time zone;
--> statement-breakpoint
UPDATE "verificationToken" SET "updated_at" = now() WHERE "updated_at" IS NULL;
--> statement-breakpoint
ALTER TABLE "verificationToken" ALTER COLUMN "updated_at" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "type";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "token_type";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "session_state";--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_token_unique" UNIQUE("token");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_email_unique" UNIQUE("email");