import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, token } from "@/lib/auth";

export default async function Login({ searchParams }) {
  const { error } = await searchParams;

  async function doLogin(fd) {
    "use server";
    if (String(fd.get("password")) !== process.env.ADMIN_PASSWORD) redirect("/admin/login?error=1");
    (await cookies()).set(COOKIE, token(), {
      httpOnly: true, sameSite: "lax", path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    });
    redirect("/admin");
  }

return (
  <main className="flex min-h-screen items-center justify-center bg-[#f6f6fa] px-4 text-[#0d0c22]">
    <form action={doLogin} className="animate-fade-up w-full max-w-sm space-y-4 rounded-2xl bg-white p-7 shadow-sm ring-1 ring-black/5">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0d0c22] font-bold text-white">G</div>
      <h1 className="text-xl font-extrabold">Dashboard Gachaverse</h1>
      <input type="password" name="password" placeholder="Password" required
        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100" />
      {error && <p className="text-sm text-red-600">Password salah.</p>}
      <button className="w-full rounded-full bg-[#0d0c22] py-2.5 text-sm font-bold text-white transition hover:bg-pink-500">Masuk</button>
    </form>
  </main>
);
}