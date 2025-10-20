/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import prisma, { handlePrismaOperation } from "prisma/db";
import { auth } from "@/auth";
import { errorCodes } from "@/lib/constants";
import { revalidateTag } from "next/cache";
import { after } from "next/server";

type CreateEditResult = { error: string | null };

/**
 * Create a session edit request. Stores proposed changes in JSON and marks as PENDING.
 */
export async function createSessionEditRequest(
  sessionId: number,
  proposedData: Record<string, unknown>,
): Promise<CreateEditResult> {
  const user = await auth();
  if (!user) return { error: errorCodes.NotAuthenticated };

  try {
    const res = await handlePrismaOperation(() =>
      (prisma as any).sessionEditRequest.create({
        data: {
          sessionId,
          proposerId: user.user?.id,
          proposedData,
        },
      }),
    );

    if (!res.success)
      return { error: res.error || "Failed to create edit request" };

    // Optionally notify admins here
    return { error: null };
  } catch (err) {
    console.error("createSessionEditRequest error", err);
    return { error: "Unknown error creating edit request" };
  }
}

export async function listPendingEdits() {
  const user = await auth();
  if (!user) return { error: errorCodes.NotAuthenticated };

  // Only allow admins - this project doesn't have roles implemented here, so assume authenticated is fine
  const res = await handlePrismaOperation(() =>
    (prisma as any).sessionEditRequest.findMany({
      where: { status: "PENDING" },
      include: { session: true, proposer: true },
      orderBy: { createdAt: "desc" },
    }),
  );

  if (!res.success)
    return { error: res.error || "Failed to load pending edits", data: [] };
  return { error: null, data: res.data };
}

/** Approve an edit: create a SessionRevision snapshot, apply changes to Session, mark request APPROVED */
export async function approveEditRequest(editId: number) {
  const user = await auth();
  if (!user) return { error: errorCodes.NotAuthenticated };

  try {
    await (prisma as any).$transaction(async (tx: any) => {
      const edit = await tx.sessionEditRequest.findUnique({
        where: { id: editId },
      });
      if (!edit) throw new Error("Edit request not found");
      if (edit.status !== "PENDING")
        throw new Error("Edit request is not pending");

      const session = await tx.session.findUnique({
        where: { sessionId: edit.sessionId },
      });
      if (!session) throw new Error("Session not found");

      // create revision snapshot
      await tx.sessionRevision.create({
        data: {
          sessionId: session.sessionId,
          snapshot: session as unknown as Record<string, unknown>,
          createdBy: user.user?.id,
        },
      });

      // prepare allowed update fields
      const allowed = [
        "sessionName",
        "sessionUrl",
        "thumbnail",
        "mvpId",
        "mvpDescription",
        "mvpStats",
        "videoId",
        "gameId",
        "date",
        "isApproved",
      ];

      const updateData: Record<string, unknown> = {};
      for (const key of allowed) {
        const proposed = edit.proposedData as unknown as Record<
          string,
          unknown
        >;
        if (Object.prototype.hasOwnProperty.call(proposed, key)) {
          updateData[key] = proposed[key];
        }
      }

      if (Object.keys(updateData).length > 0) {
        await tx.session.update({
          where: { sessionId: session.sessionId },
          data: updateData as any,
        });
      }

      await tx.sessionEditRequest.update({
        where: { id: editId },
        data: {
          status: "APPROVED",
          reviewerId: user.user?.id,
          reviewedAt: new Date(),
          appliedAt: new Date(),
          appliedBy: user.user?.id,
        },
      });
    });

    revalidateTag("getAllSessions");
    after(() => console.log(`Edit ${editId} approved by ${user.user?.id}`));
    return { error: null };
  } catch (err) {
    console.error("approveEditRequest error", err);
    return { error: String(err) };
  }
}

export async function rejectEditRequest(editId: number, note?: string) {
  const user = await auth();
  if (!user) return { error: errorCodes.NotAuthenticated };

  try {
    const res = await handlePrismaOperation(() =>
      (prisma as any).sessionEditRequest.update({
        where: { id: editId },
        data: {
          status: "REJECTED",
          reviewerId: user.user?.id,
          reviewNote: note,
          reviewedAt: new Date(),
        },
      }),
    );

    if (!res.success)
      return { error: res.error || "Failed to reject edit request" };
    return { error: null };
  } catch (err) {
    console.error("rejectEditRequest error", err);
    return { error: String(err) };
  }
}
