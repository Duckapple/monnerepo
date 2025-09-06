ALTER TABLE "SplendorGame" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "SplendorGame" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "SplendorGame" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "SplendorGame" ALTER COLUMN "updatedAt" SET NOT NULL;