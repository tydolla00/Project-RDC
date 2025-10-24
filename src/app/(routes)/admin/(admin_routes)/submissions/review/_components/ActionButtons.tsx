"use client";
import {
  approveEditRequest,
  rejectEditRequest,
} from "@/app/actions/editSession";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const ApproveButton = ({ editId }: { editId: number }) => {
  const [note, setNote] = useState("");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button">Approve</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve Edit Request</DialogTitle>
        </DialogHeader>
        <Input value={note} onChange={(e) => setNote(e.target.value)} />
        <Button
          type="button"
          onClick={async () => {
            await approveEditRequest(editId, note || undefined);
          }}
        >
          Confirm
        </Button>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const DeclineButton = ({ editId }: { editId: number }) => {
  const [note, setNote] = useState("");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="destructive">
          Decline
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Decline Edit Request</DialogTitle>
        </DialogHeader>
        <Input value={note} onChange={(e) => setNote(e.target.value)} />
        <Button
          type="button"
          variant="destructive"
          onClick={async () => {
            await rejectEditRequest(editId, note || undefined);
          }}
        >
          Confirm
        </Button>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
