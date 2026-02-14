-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Idea" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ideaNumber" INTEGER NOT NULL,
    "globalCounter" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "opportunity" TEXT NOT NULL DEFAULT '',
    "stageGate" TEXT NOT NULL DEFAULT 'IDEA',
    "isSidelined" BOOLEAN NOT NULL DEFAULT false,
    "ownerId" TEXT NOT NULL,
    "teamId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Idea_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Idea_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Idea" ("createdAt", "description", "globalCounter", "id", "ideaNumber", "isSidelined", "ownerId", "stageGate", "teamId", "title", "updatedAt") SELECT "createdAt", "description", "globalCounter", "id", "ideaNumber", "isSidelined", "ownerId", "stageGate", "teamId", "title", "updatedAt" FROM "Idea";
DROP TABLE "Idea";
ALTER TABLE "new_Idea" RENAME TO "Idea";
CREATE UNIQUE INDEX "Idea_globalCounter_key" ON "Idea"("globalCounter");
CREATE INDEX "Idea_teamId_ideaNumber_idx" ON "Idea"("teamId", "ideaNumber");
CREATE INDEX "Idea_teamId_stageGate_idx" ON "Idea"("teamId", "stageGate");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
