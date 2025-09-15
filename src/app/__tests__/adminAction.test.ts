import { insertNewSessionFromAdmin } from "../actions/adminAction";
import prisma from "prisma/db";
import { auth } from "@/auth";
import { errorCodes } from "@/lib/constants";

jest.mock("prisma/db");
jest.mock("@/auth");

describe("adminAction tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("insertNewSessionFromAdmin", () => {
    it("should insert a new session successfully", async () => {
      (auth as jest.Mock).mockResolvedValue(true);
      (prisma.game.findFirst as jest.Mock).mockResolvedValue({ gameId: 1 });
      (prisma.session.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.session.create as jest.Mock).mockResolvedValue({ sessionId: 1 });
      (prisma.gameSet.create as jest.Mock).mockResolvedValue({ setId: 1 });
      (prisma.match.create as jest.Mock).mockResolvedValue({ matchId: 1 });
      (prisma.playerSession.create as jest.Mock).mockResolvedValue({
        playerSessionId: 1,
      });
      (prisma.playerStat.create as jest.Mock).mockResolvedValue({});

      const session: Parameters<typeof insertNewSessionFromAdmin>["0"] = {
        game: "Call of Duty",
        sessionName: "Session Name",
        sessionUrl: "http://example.com",
        thumbnail: "http://example.com/thumbnail.jpg",
        date: new Date("2023-10-01"),
        videoId: "video123",
        players: [{ playerId: 1, playerName: "Ben" }],
        sets: [
          {
            setId: 1,
            setWinners: [{ playerId: 1, playerName: "Ben" }],
            matches: [
              {
                matchWinners: [{ playerId: 1, playerName: "Ben" }],
                playerSessions: [
                  {
                    playerId: 1,
                    playerStats: [
                      { statId: "1", stat: "COD_SCORE", statValue: "100" },
                    ],
                    playerSessionName: "",
                  },
                ],
              },
            ],
          },
        ],
      };

      const result = await insertNewSessionFromAdmin(session);
      expect(result).toEqual({ error: null });
    });

    it("should return an error if not authenticated", async () => {
      (auth as jest.Mock).mockResolvedValue(false);

      const session: Parameters<typeof insertNewSessionFromAdmin>["0"] = {
        game: "Call of Duty",
        sessionName: "Session Name",
        sessionUrl: "http://example.com",
        thumbnail: "http://example.com/thumbnail.jpg",
        date: new Date("2023-10-01"),
        videoId: "video123",
        sets: [],
        players: [{ playerId: 1, playerName: "Ben" }],
      };

      const result = await insertNewSessionFromAdmin(session);
      expect(result).toEqual({ error: errorCodes.NotAuthenticated });
    });

    it("should return an error if game not found", async () => {
      (auth as jest.Mock).mockResolvedValue(true);
      (prisma.game.findFirst as jest.Mock).mockResolvedValue(null);

      const session: Parameters<typeof insertNewSessionFromAdmin>["0"] = {
        game: "Call of Duty",
        sessionName: "Session Name",
        sessionUrl: "http://example.com",
        thumbnail: "http://example.com/thumbnail.jpg",
        date: new Date("2023-10-01"),
        videoId: "video123",
        sets: [],
        players: [{ playerId: 1, playerName: "Ben" }],
      };

      const result = await insertNewSessionFromAdmin(session);
      expect(result).toEqual({ error: "Game not found." });
    });

    it("should return an error if video already exists", async () => {
      (auth as jest.Mock).mockResolvedValue(true);
      (prisma.game.findFirst as jest.Mock).mockResolvedValue({ gameId: 1 });
      (prisma.session.findFirst as jest.Mock).mockResolvedValue({});

      const session: Parameters<typeof insertNewSessionFromAdmin>["0"] = {
        game: "Call of Duty",
        sessionName: "Session Name",
        sessionUrl: "http://example.com",
        thumbnail: "http://example.com/thumbnail.jpg",
        date: new Date("2023-10-01"),
        videoId: "video123",
        sets: [],
        players: [{ playerId: 1, playerName: "Ben" }],
      };

      const result = await insertNewSessionFromAdmin(session);
      expect(result).toEqual({ error: "Video already exists." });
    });

    it("should return a generic error if an exception is thrown", async () => {
      (auth as jest.Mock).mockResolvedValue(true);
      (prisma.game.findFirst as jest.Mock).mockImplementation(() => {
        throw new Error("Unexpected error");
      });

      const session: Parameters<typeof insertNewSessionFromAdmin>["0"] = {
        game: "Call of Duty",
        sessionName: "Session Name",
        sessionUrl: "http://example.com",
        thumbnail: "http://example.com/thumbnail.jpg",
        date: new Date("2023-10-01"),
        videoId: "video123",
        sets: [],
        players: [{ playerId: 1, playerName: "Ben" }],
      };

      const result = await insertNewSessionFromAdmin(session);
      expect(result).toEqual({
        error: "Unknown error occurred. Please try again.",
      });
    });
  });

  // describe("insertNewSessionV2", () => {
  //   it("should insert a new session successfully", async () => {
  //     (auth as jest.Mock).mockResolvedValue(true);
  //     (prisma.session.findFirst as jest.Mock).mockResolvedValue(null);
  //     (prisma.session.create as jest.Mock).mockResolvedValue({ sessionId: 1 });
  //     (prisma.gameSet.update as jest.Mock).mockResolvedValue({});
  //     (prisma.playerSession.update as jest.Mock).mockResolvedValue({});
  //     (prisma.playerStat.update as jest.Mock).mockResolvedValue({});
  //     (prisma.$transaction as jest.Mock).mockImplementation((callback) =>
  //       callback(prisma),
  //     );

  //     const session: Parameters<typeof insertNewSessionFromAdmin>["0"] = {
  //       game: "Game Name",
  //       sessionName: "Session Name",
  //       sessionUrl: "http://example.com",
  //       thumbnail: "http://example.com/thumbnail.jpg",
  //       date: new Date("2023-10-01"),
  //       videoId: "video123",
  //       players: [{ playerId: 1, playerName: "Player 1" }],
  //       sets: [
  //         {
  //           setId: 1,
  //           setWinners: [{ playerId: 1, playerName: "Player 1" }],
  //           matches: [
  //             {
  //               matchWinners: [{ playerId: 1, playerName: "Player 1" }],
  //               playerSessions: [
  //                 {
  //                   playerSessionName: "",
  //                   playerId: 1,
  //                   playerStats: [
  //                     { statId: "1", stat: "Score", statValue: "100" },
  //                   ],
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //       ],
  //     };

  //     const result = await insertNewSessionV2(session);
  //     expect(result).toEqual({ error: null });
  //   });

  //   it("should return an error if not authenticated", async () => {
  //     (auth as jest.Mock).mockResolvedValue(false);

  //     const session: Parameters<typeof insertNewSessionFromAdmin>["0"] = {
  //       game: "Game Name",
  //       sessionName: "Session Name",
  //       sessionUrl: "http://example.com",
  //       thumbnail: "http://example.com/thumbnail.jpg",
  //       date: new Date("2023-10-01"),
  //       videoId: "video123",
  //       sets: [],
  //       players: [{ playerId: 1, playerName: "Player 1" }],
  //     };

  //     const result = await insertNewSessionV2(session);
  //     expect(result).toEqual({ error: errorCodes.NotAuthenticated });
  //   });

  //   it("should return an error if game not found", async () => {
  //     (auth as jest.Mock).mockResolvedValue(true);
  //     (prisma.session.findFirst as jest.Mock).mockResolvedValue(null);

  //     const session: Parameters<typeof insertNewSessionFromAdmin>["0"] = {
  //       game: "Nonexistent Game",
  //       sessionName: "Session Name",
  //       sessionUrl: "http://example.com",
  //       thumbnail: "http://example.com/thumbnail.jpg",
  //       date: new Date("2023-10-01"),
  //       videoId: "video123",
  //       sets: [],
  //       players: [{ playerId: 1, playerName: "Player 1" }],
  //     };

  //     const result = await insertNewSessionV2(session);
  //     expect(result).toEqual({ error: "Game not found." });
  //   });

  //   it("should return an error if video already exists", async () => {
  //     (auth as jest.Mock).mockResolvedValue(true);
  //     (prisma.session.findFirst as jest.Mock).mockResolvedValue({});

  //     const session: Parameters<typeof insertNewSessionFromAdmin>["0"] = {
  //       game: "Game Name",
  //       sessionName: "Session Name",
  //       sessionUrl: "http://example.com",
  //       thumbnail: "http://example.com/thumbnail.jpg",
  //       date: new Date("2023-10-01"),
  //       videoId: "video123",
  //       sets: [],
  //       players: [{ playerId: 1, playerName: "Player 1" }],
  //     };

  //     const result = await insertNewSessionV2(session);
  //     expect(result).toEqual({ error: "Video already exists." });
  //   });
  // });
});
