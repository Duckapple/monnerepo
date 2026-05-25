CREATE TABLE "Account" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" UUID NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"access_token_expires_at" timestamp (6) with time zone,
	"refresh_token_expires_at" timestamp (6) with time zone,
	"scope" text,
	"id_token" text,
	"password" text,
	"created_at" timestamp (6) with time zone NOT NULL,
	"updated_at" timestamp (6) with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" UUID NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires_at" timestamp (6) with time zone NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp (6) with time zone NOT NULL,
	"updated_at" timestamp (6) with time zone NOT NULL,
	CONSTRAINT "Session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "Verification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp (6) with time zone NOT NULL,
	"created_at" timestamp (6) with time zone NOT NULL,
	"updated_at" timestamp (6) with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "User"
ADD COLUMN "email" varchar(255);
--> statement-breakpoint
UPDATE "User"
SET "email" = "userName" || '@auth.simon-green.dev'
WHERE "email" IS NULL;
--> statement-breakpoint
ALTER TABLE "User"
ALTER COLUMN "email"
SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "User"
ADD COLUMN "email_verified" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
ALTER TABLE "User"
ADD COLUMN "image" text;
--> statement-breakpoint
ALTER TABLE "User"
ADD COLUMN "created_at" timestamp (6) with time zone DEFAULT now() NOT NULL;
--> statement-breakpoint
ALTER TABLE "User"
ADD COLUMN "updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL;
--> statement-breakpoint
ALTER TABLE "User"
ADD COLUMN "display_username" varchar(64);
--> statement-breakpoint
ALTER TABLE "User"
ALTER COLUMN "bcrypt" DROP NOT NULL;
--> statement-breakpoint
ALTER TABLE "Account"
ADD CONSTRAINT "Account_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "Session"
ADD CONSTRAINT "Session_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "User"
ADD CONSTRAINT "User_email_unique" UNIQUE("email");
--> statement-breakpoint
INSERT INTO "Account" (
		provider_id,
		user_id,
		account_id,
		password,
		created_at,
		updated_at
	)
SELECT 'credential',
	s.id,
	s.id,
	s.bcrypt,
	now(),
	now()
FROM "User" s
WHERE s.bcrypt IS NOT NULL;