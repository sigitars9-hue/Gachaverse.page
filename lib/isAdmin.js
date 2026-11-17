import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

export async function isAdmin() {
  const got = (await cookies()).get("gv_admin")?.value ?? "";
  const want = createHmac("sha256", process.env.ADMIN_SECRET)
    .update("gachaverse-admin")
    .digest("hex");
  return got.length === want.length && timingSafeEqual(Buffer.from(got), Buffer.from(want));
}