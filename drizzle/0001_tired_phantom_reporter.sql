CREATE TABLE `churches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`address` text,
	`city` varchar(100),
	`state` varchar(50),
	`country` varchar(100),
	`zipCode` varchar(20),
	`contactEmail` varchar(320),
	`contactPhone` varchar(50),
	`website` varchar(500),
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`submittedBy` int NOT NULL,
	`reviewedBy` int,
	`reviewNotes` text,
	`reviewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `churches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `prayerResponses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`prayerId` int NOT NULL,
	`userId` int,
	`content` text NOT NULL,
	`isAnswer` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `prayerResponses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `prayers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`userId` int,
	`churchId` int,
	`isAnonymous` int NOT NULL DEFAULT 0,
	`anonymousName` varchar(100),
	`isPublic` int NOT NULL DEFAULT 1,
	`status` enum('active','answered','archived') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `prayers_id` PRIMARY KEY(`id`)
);
