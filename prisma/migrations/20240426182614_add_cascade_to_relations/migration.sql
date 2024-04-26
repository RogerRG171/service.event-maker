-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Attendee" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "event_id" TEXT NOT NULL,
    CONSTRAINT "Attendee_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Attendee" ("created_at", "email", "event_id", "id", "name") SELECT "created_at", "email", "event_id", "id", "name" FROM "Attendee";
DROP TABLE "Attendee";
ALTER TABLE "new_Attendee" RENAME TO "Attendee";
CREATE UNIQUE INDEX "Attendee_event_id_email_key" ON "Attendee"("event_id", "email");
CREATE TABLE "new_check_in" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attendee_id" INTEGER NOT NULL,
    CONSTRAINT "check_in_attendee_id_fkey" FOREIGN KEY ("attendee_id") REFERENCES "Attendee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_check_in" ("attendee_id", "created_at", "id") SELECT "attendee_id", "created_at", "id" FROM "check_in";
DROP TABLE "check_in";
ALTER TABLE "new_check_in" RENAME TO "check_in";
CREATE UNIQUE INDEX "check_in_attendee_id_key" ON "check_in"("attendee_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
