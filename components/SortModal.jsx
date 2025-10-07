// components/SortModal.jsx
'use client';

export default function SortModal({
  open,
  onClose,
  useHierarchyOrder,
  setUseHierarchyOrder,
  useDivisionOrder,
  setUseDivisionOrder,
  useGenderPriority,
  setUseGenderPriority,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/70 p-5 backdrop-blur">
        <h3 className="text-lg font-bold">Sort / Filter</h3>
        <p className="mt-1 text-white/70 text-sm">
          Atur urutan tampilan admin. (Urut alfabet telah dinonaktifkan)
        </p>

        <div className="mt-4 space-y-3 text-sm">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={useHierarchyOrder}
              onChange={(e) => setUseHierarchyOrder(e.target.checked)}
            />
            Urut berdasarkan <span className="font-semibold">Hierarki Peran</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={useDivisionOrder}
              onChange={(e) => setUseDivisionOrder(e.target.checked)}
            />
            Urut berdasarkan <span className="font-semibold">Divisi</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={useGenderPriority}
              onChange={(e) => setUseGenderPriority(e.target.checked)}
            />
            Prioritaskan <span className="font-semibold">Gender</span> (Laki-laki → Perempuan → Unknown)
          </label>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            onClick={() => {
              setUseHierarchyOrder(true);
              setUseDivisionOrder(true);
              setUseGenderPriority(false);
            }}
            className="rounded-xl border border-white/15 px-4 py-2 text-white/90 hover:bg-white/10"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
