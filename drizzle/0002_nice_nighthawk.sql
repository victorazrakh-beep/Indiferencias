CREATE TABLE `funding_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`case_id` text NOT NULL,
	`raffle_id` text,
	`intent_id` text,
	`source` text NOT NULL,
	`amount_cents` integer NOT NULL,
	`quantity` integer,
	`status` text DEFAULT 'pending' NOT NULL,
	`provider_reference` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`case_id`) REFERENCES `monthly_cases`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`raffle_id`) REFERENCES `raffles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`intent_id`) REFERENCES `raffle_intents`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `funding_entries_provider_reference_unique` ON `funding_entries` (`provider_reference`);--> statement-breakpoint
CREATE TABLE `monthly_cases` (
	`id` text PRIMARY KEY NOT NULL,
	`place` text NOT NULL,
	`month` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `monthly_cases_month_unique` ON `monthly_cases` (`month`);--> statement-breakpoint
CREATE TABLE `raffle_intents` (
	`id` text PRIMARY KEY NOT NULL,
	`request_key` text NOT NULL,
	`raffle_id` text NOT NULL,
	`name` text NOT NULL,
	`whatsapp` text NOT NULL,
	`quantity` integer NOT NULL,
	`price_cents` integer,
	`status` text DEFAULT 'intent' NOT NULL,
	`consent_version` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`raffle_id`) REFERENCES `raffles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `raffle_intents_request_key_unique` ON `raffle_intents` (`request_key`);--> statement-breakpoint
CREATE TABLE `raffles` (
	`id` text PRIMARY KEY NOT NULL,
	`case_id` text NOT NULL,
	`month` text,
	`status` text DEFAULT 'planning' NOT NULL,
	`prize` text,
	`prize_image` text,
	`prize_value_cents` integer,
	`prize_donor` text,
	`price_cents` integer,
	`total_tickets` integer,
	`historical_sold` integer,
	`draw_at` text,
	`winner_display` text,
	`evidence_url` text,
	`rules` text,
	`yappy` text,
	`bank_instructions` text,
	`whatsapp` text,
	FOREIGN KEY (`case_id`) REFERENCES `monthly_cases`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `raffles_case_id_unique` ON `raffles` (`case_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `raffles_month_unique` ON `raffles` (`month`);