import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, timingSafeEqual } from "node:crypto";

export const COOKIE = "gv_admin";

export const token = () =>
  createHmac("sha256", process.env.ADMIN_SECRET).update("gachaverse-admin").digest("hex");

export async function isAdmin() {
  const got = (await cookies()).get(COOKIE)?.value ?? "";
  const want = token();
  return got.length === want.length && timingSafeEqual(Buffer.from(got), Buffer.from(want));
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}