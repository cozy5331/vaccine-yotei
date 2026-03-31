type VaccineRowProps = {
  label: string;
  typeValue: string;
  countValue: string;
  dateValue: string;
  typeOptions: readonly string[];
  countOptions: readonly string[];
  onTypeChange: (value: string) => void;
  onCountChange: (value: string) => void;
  onDateChange: (value: string) => void;
};

export default function VaccineRow({
  label,
  typeValue,
  countValue,
  dateValue,
  typeOptions,
  countOptions,
  onTypeChange,
  onCountChange,
  onDateChange,
}: VaccineRowProps) {
  const isDateDisabled = typeValue === "なし" || countValue === "未接種";

  return (
    <div className="rounded-2xl border p-4 space-y-3">
      <div className="font-semibold">{label}</div>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="space-y-1">
          <div className="text-sm text-gray-600">種類（未接種は なし と記入）</div>
          <select
            className="w-full rounded-lg border px-3 py-2"
            value={typeValue}
            onChange={(e) => onTypeChange(e.target.value)}
          >
            {typeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1">
          <div className="text-sm text-gray-600">最終回数</div>
          <select
            className="w-full rounded-lg border px-3 py-2"
            value={countValue}
            onChange={(e) => onCountChange(e.target.value)}
          >
            {countOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>

        <div className="space-y-1">
          <div className="text-sm text-gray-600">
            最終接種日（不要なら「日付を消す」）
          </div>

          <div className="flex flex-col gap-2 md:flex-row">
            <input
              type="date"
              className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-100 disabled:text-gray-400"
              value={dateValue}
              onChange={(e) => onDateChange(e.target.value)}
              disabled={isDateDisabled}
            />

            <button
              type="button"
              onClick={() => onDateChange("")}
              className="rounded-2xl border bg-white px-4 py-2 font-semibold shadow-sm"
            >
              日付を消す
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}