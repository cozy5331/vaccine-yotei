"use client";

import { useState } from "react";
import BcgRow from "@/components/BcgRow";
import VaccineRow from "@/components/VaccineRow";
import {
  countOptions,
  emptyFormValues,
  mrCountOptions,
  vaccineTypeOptions,
} from "@/lib/types";

export default function VaccinationForm() {
  const [form, setForm] = useState(emptyFormValues());

  const updateEntry = (
    key: keyof typeof form,
    field: "type" | "count" | "date",
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] as any),
        [field]: value,
      },
    }));
  };

  return (
    <form className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">予防接種予定表 作成</h1>
        <p className="text-sm text-gray-600">
          生年月日と、これまでに受けたワクチンの最終回数・最終接種日を入力してください。
        </p>
      </div>

      <div className="rounded-2xl border p-4">
        <label className="space-y-1 block">
          <div className="font-semibold">生年月日</div>
          <input
            type="date"
            className="w-full rounded-lg border px-3 py-2"
            value={form.birthday}
            onChange={(e) => setForm((prev) => ({ ...prev, birthday: e.target.value }))}
          />
        </label>
      </div>

      <VaccineRow
        label="ロタ"
        typeValue={form.rota.type}
        countValue={form.rota.count}
        dateValue={form.rota.date}
        typeOptions={vaccineTypeOptions}
        countOptions={countOptions}
        onTypeChange={(v) => updateEntry("rota", "type", v)}
        onCountChange={(v) => updateEntry("rota", "count", v)}
        onDateChange={(v) => updateEntry("rota", "date", v)}
      />

      <VaccineRow
        label="ヒブ"
        typeValue={form.hib.type}
        countValue={form.hib.count}
        dateValue={form.hib.date}
        typeOptions={vaccineTypeOptions}
        countOptions={countOptions}
        onTypeChange={(v) => updateEntry("hib", "type", v)}
        onCountChange={(v) => updateEntry("hib", "count", v)}
        onDateChange={(v) => updateEntry("hib", "date", v)}
      />

      <VaccineRow
        label="肺炎球菌"
        typeValue={form.hai.type}
        countValue={form.hai.count}
        dateValue={form.hai.date}
        typeOptions={vaccineTypeOptions}
        countOptions={countOptions}
        onTypeChange={(v) => updateEntry("hai", "type", v)}
        onCountChange={(v) => updateEntry("hai", "count", v)}
        onDateChange={(v) => updateEntry("hai", "date", v)}
      />

      <BcgRow
        value={form.bcg}
        onChange={(v) => setForm((prev) => ({ ...prev, bcg: v }))}
      />

      <VaccineRow
        label="五種混合"
        typeValue={form.go.type}
        countValue={form.go.count}
        dateValue={form.go.date}
        typeOptions={vaccineTypeOptions}
        countOptions={countOptions}
        onTypeChange={(v) => updateEntry("go", "type", v)}
        onCountChange={(v) => updateEntry("go", "count", v)}
        onDateChange={(v) => updateEntry("go", "date", v)}
      />

      <button
        type="button"
        className="rounded-2xl px-6 py-3 font-semibold border shadow-sm"
      >
        100円で予定表を作成する
      </button>
    </form>
  );
}