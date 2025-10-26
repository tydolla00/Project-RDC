"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { submitFeedback } from "@/app/actions/feedback";
import { toast } from "sonner";

export type FeedbackType = "bug" | "feature" | "general" | "other";

// TODO Use React Form Semantics
export default function Page() {
  const [type, setType] = useState<FeedbackType>("general");
  const [otherType, setOtherType] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!message.trim()) {
      setError("Please enter your feedback message.");
      return;
    }

    setLoading(true);
    try {
      const res = await submitFeedback(type, message.trim());

      if (!res) {
        throw new Error("Failed to submit feedback");
      }

      toast.success("Thanks — your feedback was sent.", { richColors: true });
      setMessage("");
      setOtherType("");
      setType("general");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Feedback</h1>

      <form
        onSubmit={handleSubmit}
        aria-label="Feedback form"
        className="space-y-4"
      >
        <div className="grid gap-1">
          <Label htmlFor="feedback-type">Type</Label>
          <Select
            value={type}
            onValueChange={(v) => setType(v as FeedbackType)}
          >
            <SelectTrigger id="feedback-type" className="w-full">
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General feedback</SelectItem>
              <SelectItem value="bug">Bug report</SelectItem>
              <SelectItem value="feature">Feature request</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {type === "other" && (
          <div className="grid gap-1">
            <Label htmlFor="other-type">Please specify</Label>
            <Input
              id="other-type"
              value={otherType}
              onChange={(e) => setOtherType(e.target.value)}
              placeholder="e.g. billing, accessibility"
            />
          </div>
        )}

        <div className="grid gap-1">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[140px]"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Sending…" : "Send feedback"}
          </Button>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
