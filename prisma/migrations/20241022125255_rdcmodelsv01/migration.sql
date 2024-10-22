-- CreateTable
CREATE TABLE "Player" (
    "player_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "player_name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Game" (
    "game_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "game_name" TEXT NOT NULL,
    "release_date" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "GameStats" (
    "stat_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "game_id" INTEGER NOT NULL,
    "stat_name" TEXT NOT NULL,
    "stat_value" TEXT NOT NULL,
    "recorded_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GameStats_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game" ("game_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PlayerGameStats" (
    "player_game_stat_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "player_id" INTEGER NOT NULL,
    "game_id" INTEGER NOT NULL,
    "stat_id" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "date_played" DATETIME NOT NULL,
    CONSTRAINT "PlayerGameStats_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player" ("player_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlayerGameStats_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game" ("game_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlayerGameStats_stat_id_fkey" FOREIGN KEY ("stat_id") REFERENCES "GameStats" ("stat_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
