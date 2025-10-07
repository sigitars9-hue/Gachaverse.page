'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, Home } from 'lucide-react';

export default function FloatingHeaderControls({
  hideOnHome = true,
  containerMax = 'max-w-6xl',   // samakan dengan page yang ada Back/Home-nya
  topOffsetRem = 1.5,           // ~pt-6, aman untuk notch (iPhone)
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCanGoBack(window.history.length > 1);
    }
  }, [pathname]);

  // Fallback "kembali ke daftar" jika tidak bisa history.back()
  const fallbackBackHref = useMemo(() => {
    if (!pathname) return '/';
    if (pathname.startsWith('/admins/')) return '/admins';
    if (pathname.startsWith('/groups')) return '/groups';
    return '/';
  }, [pathname]);

  // Sembunyikan di beranda kalau mau
  if (hideOnHome && (pathname === '/' || pathname === '/home')) return null;

  return (
    <div
      className="fixed inset-x-0 z-50 pointer-events-none"
      style={{
        top: `max(env(safe-area-inset-top), ${topOffsetRem}rem)`,
        paddingLeft: 'max(env(safe-area-inset-left), 0px)',
        paddingRight: 'max(env(safe-area-inset-right), 0px)',
      }}
    >
      <div className={`${containerMax} mx-auto px-4 flex items-center justify-between`}>
        {canGoBack ? (
          <button
            onClick={() => router.back()}
            aria-label="Kembali"
            className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 hover:bg-white/20"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        ) : (
          <Link
            href={fallbackBackHref}
            aria-label="Kembali"
            className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 hover:bg-white/20"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
        )}

        <Link
          href="/"
          aria-label="Beranda"
          className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 hover:bg-white/20"
        >
          <Home className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
