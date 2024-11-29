// pages/api/createSession.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { sessionName, sessionUrl, gameId, thumbnail, date } = req.body;
    try {
      const newSession = await prisma.session.create({
        data: {
          sessionName,
          sessionUrl,
          gameId,
          thumbnail,
          date,
        },
      });
      res.status(200).json(newSession);
    } catch (error) {
      res.status(500).json({ error: "Error creating session" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
// const handleCreateSession = async () => {
//     const response = await fetch('/api/createSession', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         sessionName: 'New Session',
//         sessionUrl: 'http://example.com',
//         gameId: 1,
//         thumbnail: 'http://example.com/thumbnail.jpg',
//         date: new Date(),
//       }),
//     });

//     const newSession = await response.json();
//     createSession(newSession.sessionId);
//   };
