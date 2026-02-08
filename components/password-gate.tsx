"use client";

import { useEffect, useState, useRef } from "react";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PasswordGateProps {
  children: React.ReactNode;
}

export function PasswordGate({ children }: PasswordGateProps) {
  const [status, setStatus] = useState<"checking" | "locked" | "unlocked">(
    "checking"
  );
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/auth")
      .then((r) => r.json())
      .then((data) => setStatus(data.authenticated ? "unlocked" : "locked"))
      .catch(() => setStatus("locked"));
  }, []);

  useEffect(() => {
    if (status === "locked") {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [status]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setStatus("unlocked");
        toast.success("Access granted");
      } else {
        toast.error("Wrong password");
        setPassword("");
        inputRef.current?.focus();
      }
    } catch {
      toast.error("Connection error");
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (status === "locked") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="w-full max-w-xs space-y-6 px-4">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Lock className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold">Admin Access</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Enter password to manage translations
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="admin-pw" className="text-xs text-muted-foreground">
                Password
              </Label>
              <Input
                ref={inputRef}
                id="admin-pw"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-9 bg-background"
                autoComplete="current-password"
              />
            </div>
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={submitting || !password.trim()}
            >
              {submitting ? "Verifying..." : "Unlock"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
