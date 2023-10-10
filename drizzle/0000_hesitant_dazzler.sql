CREATE TABLE `aggregated` (
	`id` integer PRIMARY KEY NOT NULL,
	`slug` text,
	`name` text,
	`quantity` integer,
	`price` integer
);
--> statement-breakpoint
CREATE TABLE `aggregated_processed` (
	`id` integer PRIMARY KEY NOT NULL,
	`id_aggregated` integer,
	`id_order` text,
	FOREIGN KEY (`id_aggregated`) REFERENCES `aggregated`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `slugIdx` ON `aggregated` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `idOrderIdx` ON `aggregated_processed` (`id_order`);