"use client";

import { deleteAccount } from "@/app/actions/profileAction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

export const DeleteAccountForm = ({
  email,
}: {
  email: string | null | undefined;
}) => {
  const { pending, data } = useFormStatus();
  const [userEmail, setUserEmail] = useState("");

  const isMatch = userEmail === email;

  const handleFormSubmitted = async (fd: FormData) => {
    try {
      await deleteAccount(fd);
    } catch (error) {
      console.log(error);
      toast.error(
        "We encountered an error trying to delete your account. Please try again.",
        { richColors: true },
      );
      //   ! POSTHOG Log Error
    }
  };

  return (
    <form action={handleFormSubmitted}>
      <Input
        value={userEmail}
        onChange={(event) => setUserEmail(event.target.value)}
        type="text"
        name="email"
      />
      <Button className="mt-5" disabled={!isMatch || pending} type="submit">
        Save changes
      </Button>
    </form>
  );
};
