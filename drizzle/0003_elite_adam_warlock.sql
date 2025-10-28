CREATE TABLE `churchMembers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`churchId` int NOT NULL,
	`userId` int NOT NULL,
	`role` enum('member','admin','pastor') NOT NULL DEFAULT 'member',
	`status` enum('pending','verified','rejected') NOT NULL DEFAULT 'pending',
	`verifiedBy` int,
	`verifiedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `churchMembers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `emailPreferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`weeklyDigest` int NOT NULL DEFAULT 1,
	`dailyDigest` int NOT NULL DEFAULT 0,
	`newPrayers` int NOT NULL DEFAULT 1,
	`prayerUpdates` int NOT NULL DEFAULT 1,
	`answeredPrayers` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `emailPreferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `emailPreferences_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `prayerGroupMembers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`groupId` int NOT NULL,
	`userId` int NOT NULL,
	`role` enum('member','leader') NOT NULL DEFAULT 'member',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `prayerGroupMembers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `prayerGroups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`churchId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`isPublic` int NOT NULL DEFAULT 1,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `prayerGroups_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `prayers` ADD `groupId` int;