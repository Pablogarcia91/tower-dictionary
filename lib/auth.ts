import { NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD ?? "").trim();
const COOKIE_NAME = "tower-admin-token";

export function isAuthenticated(req: NextRequest): boolean {
  if (!ADMIN_PASSWORD) return false;
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;

  const dot = token.indexOf(".");
  if (dot === -1) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac("sha256", ADMIN_PASSWORD)
    .update(payload)
    .digest("hex");
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}
