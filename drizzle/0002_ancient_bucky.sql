ALTER TABLE `prayers` ADD `categories` text;--> statement-breakpoint
ALTER TABLE `prayers` ADD `urgency` enum('low','medium','high');--> statement-breakpoint
ALTER TABLE `prayers` ADD `moderationStatus` enum('pending','approved','flagged','rejected') DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE `prayers` ADD `moderationConcerns` text;--> statement-breakpoint
ALTER TABLE `prayers` ADD `moderatedBy` int;--> statement-breakpoint
ALTER TABLE `prayers` ADD `moderatedAt` timestamp;