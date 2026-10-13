CREATE TABLE `yappy_reports` (
	`id` text PRIMARY KEY NOT NULL,
	`request_key` text NOT NULL,
	`case_ref` text NOT NULL,
	`name` text NOT NULL,
	`contact` text NOT NULL,
	`reference` text NOT NULL,
	`amount_cents` integer NOT NULL,
	`status` text DEFAULT 'pending_review' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `yappy_reports_request_key_unique` ON `yappy_reports` (`request_key`);