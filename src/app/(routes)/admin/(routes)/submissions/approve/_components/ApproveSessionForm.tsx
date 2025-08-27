"use client";

import { Form } from "@/components/ui/form";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { approveSession } from "@/app/actions/adminAction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FormValues } from "@/app/(routes)/admin/_utils/form-helpers";
import { FormSummary } from "@/app/(routes)/admin/_components/form/Summary";
import { useState } from "react";

export function ApproveSessionForm({
  defaultValues,
  sessionId,
}: {
  defaultValues: FormValues;
  sessionId: number;
}) {
  const form = useForm<FormValues>({
    defaultValues,
  });
  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState(false);

  const onApprove = async () => {
    setIsDisabled(true);
    const { error } = await approveSession(sessionId);

    if (error) {
      toast.error(error);
      return;
    }
    setIsDisabled(false);

    toast.success("Session approved successfully");
    router.refresh();
    router.push("/admin/submissions");
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form action={onApprove}>
          <FormSummary />
          <div className="mt-6 flex justify-end">
            <Button disabled={isDisabled} type="submit">
              Approve Session
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}
