type BcgRowProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function BcgRow({ value, onChange }: BcgRowProps) {
  return (
    <div className="rounded-2xl border p-4 space-y-3">
      <div className="font-semibold">BCG</div>

      <div className="space-y-1">
        <div className="text-sm text-gray-600">
          接種日（不要なら「日付を消す」）
        </div>

        <div className="flex flex-col gap-2 md:flex-row">
          <input
            type="date"
            className="w-full rounded-lg border px-3 py-2"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />

          <button
            type="button"
            onClick={() => onChange("")}
            className="rounded-2xl border bg-white px-4 py-2 font-semibold shadow-sm"
          >
            日付を消す
          </button>
        </div>
      </div>
    </div>
  );
}