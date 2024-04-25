/*
  Warnings:

  - A unique constraint covering the columns `[event_id,email]` on the table `Attendee` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Attendee_event_id_email_key" ON "Attendee"("event_id", "email");
