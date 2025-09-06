CREATE TYPE "public"."GameType" AS ENUM('splendor');--> statement-breakpoint
CREATE TABLE "Lobby" (
	"code" varchar(6) NOT NULL,
	"gameType" "GameType" NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Lobby_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "LobbyParticipant" (
	"code" varchar(6) NOT NULL,
	"userId" uuid NOT NULL,
	"joinedAt" timestamp DEFAULT now() NOT NULL,
	"owner" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "LobbyParticipant" ADD CONSTRAINT "LobbyParticipant_code_Lobby_code_fk" FOREIGN KEY ("code") REFERENCES "public"."Lobby"("code") ON DELETE cascade ON UPDATE no action;