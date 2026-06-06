"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/Icon";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="mx-auto flex max-w-md items-center justify-center gap-3 rounded-card border border-success/40 bg-success/10 px-5 py-4 text-success">
        <Icon name="check" size={20} />
        <span className="text-sm font-medium">You&apos;re on the list — we&apos;ll be in touch soon.</span>
      </div>
    );
  }

  return (
    <form
      className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        if (email.includes("@")) setDone(true);
      }}
    >
      <Input
        type="email"
        required
        placeholder="you@channel.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" size="md" className="shrink-0">
        Join waitlist
        <Icon name="arrow-right" size={16} />
      </Button>
    </form>
  );
}
