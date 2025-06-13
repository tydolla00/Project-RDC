import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllSessions } from "../../../../../prisma/lib/admin";
import Link from "next/link";

export const SubmissionTable = async () => {
  const sessions = await getAllSessions();

  if (!sessions.success || !sessions.data) sessions.data = [];
  return (
    <>
      <Table>
        <TableCaption>A list of recent submissions</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Session ID</TableHead>
            <TableHead>Session Name</TableHead>
            <TableHead>Game</TableHead>
            <TableHead>Session URL</TableHead>
            <TableHead>Created At (EST)</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.data.map((session) => (
            <TableRow key={session.sessionId}>
              <TableCell>{session.sessionId}</TableCell>
              <TableCell>{session.sessionName}</TableCell>
              <TableCell>{session.Game.gameName}</TableCell>
              <TableCell className="hover:underline">
                <Link href={session.sessionUrl}>{session.sessionUrl}</Link>
              </TableCell>
              <TableCell>{`${new Date(session.createdAt).toLocaleString()}`}</TableCell>
              <TableCell>
                {session.isApproved ? "Approved" : "Pending"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter></TableFooter>
      </Table>
    </>
  );
};
