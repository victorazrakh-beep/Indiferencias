CREATE TABLE `confirmed_receipts` (
	`report_id` text PRIMARY KEY NOT NULL,
	`sha256` text NOT NULL,
	`normalized_reference` text NOT NULL,
	`confirmed_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`report_id`) REFERENCES `yappy_reports`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `confirmed_receipts_sha256_unique` ON `confirmed_receipts` (`sha256`);--> statement-breakpoint
CREATE UNIQUE INDEX `confirmed_receipts_normalized_reference_unique` ON `confirmed_receipts` (`normalized_reference`);--> statement-breakpoint
CREATE TABLE `receipt_files` (
	`report_id` text PRIMARY KEY NOT NULL,
	`object_key` text NOT NULL,
	`mime` text NOT NULL,
	`sha256` text NOT NULL,
	`normalized_reference` text NOT NULL,
	`ocr_text` text DEFAULT '' NOT NULL,
	`review_note` text,
	`reviewed_at` text,
	FOREIGN KEY (`report_id`) REFERENCES `yappy_reports`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `receipt_sha_idx` ON `receipt_files` (`sha256`);--> statement-breakpoint
CREATE INDEX `receipt_ref_idx` ON `receipt_files` (`normalized_reference`);