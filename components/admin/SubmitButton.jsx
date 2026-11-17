"use client";
import { useFormStatus } from "react-dom";

export default function SubmitButton({ children }) {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending}
      className="rounded-full bg-[#0d0c22] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-pink-500 hover:shadow-lg hover:shadow-pink-500/30 disabled:opacity-60">
      {pending ? "Menyimpan…" : children}
    </button>
  );
}