type BcgRowProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function BcgRow({ value, onChange }: BcgRowProps) {
  return (
    <div className="rounded-2xl border p-4 space-y-3">
      <div className="font-semibold">BCG</div>
      <label className="space-y-1 block">
        <div className="text-sm text-gray-600">接種日</div>
        <input
          type="date"
          className="w-full rounded-lg border px-3 py-2"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
}