-- CreateTable
CREATE TABLE "check_in" (
    "id" serial NOT NULL PRIMARY KEY,
    "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attendee_id" INTEGER NOT NULL,
    CONSTRAINT "check_in_attendee_id_fkey" FOREIGN KEY ("attendee_id") REFERENCES "Attendee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "check_in_attendee_id_key" ON "check_in"("attendee_id");
