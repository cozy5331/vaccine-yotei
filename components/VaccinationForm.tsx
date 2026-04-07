"use client";

import { useState } from "react";
import BcgRow from "@/components/BcgRow";
import VaccineRow from "@/components/VaccineRow";
import {
  countOptions,
  emptyFormValues,
  mrCountOptions,
  rotaTypeOptions,
  hibTypeOptions,
  haiTypeOptions,
  yonTypeOptions,
  goTypeOptions,
  hbTypeOptions,
  mrTypeOptions,
  suiTypeOptions,
  mumpusTypeOptions,
  nitiTypeOptions,
  FormValues,
} from "@/lib/types";

type VaccinationFormProps = {
  initialValues?: FormValues;
  mode?: "initial" | "renewal";
  parentRequestId?: string;
};

export default function VaccinationForm({
  initialValues,
  mode = "initial",
  parentRequestId,
}: VaccinationFormProps) {
  const [form, setForm] = useState<FormValues>(initialValues ?? emptyFormValues());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [requestId, setRequestId] = useState("");

  const updateEntry = (
    key: keyof FormValues,
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

  const updateHb = (
    field: "type" | "count" | "date" | "firstDate",
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      hb: {
        ...prev.hb,
        [field]: value,
      },
    }));
  };

  const updateMr = (
    field: "type" | "count" | "date",
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      mr: {
        ...prev.mr,
        [field]: value,
      },
    }));
  };

  const toApiPayload = () => ({
    birthday: form.birthday,

    rota_syu: form.rota.type,
    rota_kai: form.rota.count,
    rota_hi: form.rota.date,

    hib: form.hib.type,
    hib_kai: form.hib.count,
    hib_hi: form.hib.date,

    hai: form.hai.type,
    hai_kai: form.hai.count,
    hai_hi: form.hai.date,

    bcg: form.bcg,

    yon: form.yon.type,
    yon_kai: form.yon.count,
    yon_hi: form.yon.date,

    go: form.go.type,
    go_kai: form.go.count,
    go_hi: form.go.date,

    hb: form.hb.type,
    hb_kai: form.hb.count,
    hb_hi: form.hb.date,
    hb1_hi: form.hb.firstDate,

    mr: form.mr.type,
    mr_ki: form.mr.count,
    mr_hi: form.mr.date,

    sui: form.sui.type,
    sui_kai: form.sui.count,
    sui_hi: form.sui.date,

    mumpus: form.mumpus.type,
    mumpus_kai: form.mumpus.count,
    mumpus_hi: form.mumpus.date,

    niti: form.niti.type,
    niti_kai: form.niti.count,
    niti_hi: form.niti.date,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.birthday) {
      setError("生年月日を入力してください。");
      return;
    }

    setLoading(true);

    try {
      const endpoint =
        mode === "renewal"
          ? "/api/create-renewed-request"
          : "/api/create-initial-request";

      const payload =
        mode === "renewal"
          ? {
              parent_request_id: parentRequestId,
              ...toApiPayload(),
            }
          : toApiPayload();

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || data.status !== "ok") {
        throw new Error(data.message || "受付作成に失敗しました。");
      }

      setRequestId(data.request_id);

      const checkoutRes = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_id: data.request_id }),
      });

      const checkoutData = await checkoutRes.json();

      if (!checkoutRes.ok || checkoutData.status !== "ok") {
        throw new Error(checkoutData.message || "決済画面の作成に失敗しました。");
      }

      window.location.href = checkoutData.checkout_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
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
            onChange={(e) =>
              setForm((prev) => ({ ...prev, birthday: e.target.value }))
            }
          />
        </label>
      </div>

      <VaccineRow
        label="ロタ_最後に接種したもののみ記入"
        typeValue={form.rota.type}
        countValue={form.rota.count}
        dateValue={form.rota.date}
        typeOptions={rotaTypeOptions}
        countOptions={countOptions}
        onTypeChange={(v) => updateEntry("rota", "type", v)}
        onCountChange={(v) => updateEntry("rota", "count", v)}
        onDateChange={(v) => updateEntry("rota", "date", v)}
      />

      <VaccineRow
        label="ヒブ_最後に接種したもののみ記入"
        typeValue={form.hib.type}
        countValue={form.hib.count}
        dateValue={form.hib.date}
        typeOptions={hibTypeOptions}
        countOptions={countOptions}
        onTypeChange={(v) => updateEntry("hib", "type", v)}
        onCountChange={(v) => updateEntry("hib", "count", v)}
        onDateChange={(v) => updateEntry("hib", "date", v)}
      />

      <VaccineRow
        label="肺炎球菌_最後に接種したもののみ記入"
        typeValue={form.hai.type}
        countValue={form.hai.count}
        dateValue={form.hai.date}
        typeOptions={haiTypeOptions}
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
        label="四種混合_最後に接種したもののみ記入"
        typeValue={form.yon.type}
        countValue={form.yon.count}
        dateValue={form.yon.date}
        typeOptions={yonTypeOptions}
        countOptions={countOptions}
        onTypeChange={(v) => updateEntry("yon", "type", v)}
        onCountChange={(v) => updateEntry("yon", "count", v)}
        onDateChange={(v) => updateEntry("yon", "date", v)}
      />

      <VaccineRow
        label="五種混合_最後に接種したもののみ記入"
        typeValue={form.go.type}
        countValue={form.go.count}
        dateValue={form.go.date}
        typeOptions={goTypeOptions}
        countOptions={countOptions}
        onTypeChange={(v) => updateEntry("go", "type", v)}
        onCountChange={(v) => updateEntry("go", "count", v)}
        onDateChange={(v) => updateEntry("go", "date", v)}
      />

<div className="rounded-2xl border p-4 space-y-3">
  <div className="font-semibold">B型肝炎_最後に接種したもののみ記入</div>
  <div className="grid gap-3 md:grid-cols-4">
    <label className="space-y-1">
      <div className="text-sm text-gray-600">種類</div>
      <select
        className="w-full rounded-lg border px-3 py-2"
        value={form.hb.type}
        onChange={(e) => updateHb("type", e.target.value)}
      >
        {hbTypeOptions.map((opt) => (
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
        value={form.hb.count}
        onChange={(e) => updateHb("count", e.target.value)}
      >
        {countOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>

    <label className="space-y-1">
      <div className="text-sm text-gray-600">最終接種日</div>
      <input
        type="date"
        className="w-full rounded-lg border px-3 py-2"
        value={form.hb.date}
        onChange={(e) => updateHb("date", e.target.value)}
      />
    </label>

    <label className="space-y-1">
      <div className="text-sm text-gray-600">1回目接種日</div>
      <input
        type="date"
        className="w-full rounded-lg border px-3 py-2"
        value={form.hb.firstDate}
        onChange={(e) => updateHb("firstDate", e.target.value)}
      />
    </label>
  </div>

  <div className="text-xs text-gray-500">
    最終回数が1回目の場合は、最終接種日と1回目接種日は同じ値を入力して下さい。
  </div>
</div>

      <VaccineRow
        label="MR_最後に接種したもののみ記入"
        typeValue={form.mr.type}
        countValue={form.mr.count}
        dateValue={form.mr.date}
        typeOptions={mrTypeOptions}
        countOptions={mrCountOptions}
        onTypeChange={(v) => updateMr("type", v)}
        onCountChange={(v) => updateMr("count", v)}
        onDateChange={(v) => updateMr("date", v)}
      />

      <VaccineRow
        label="水痘_最後に接種したもののみ記入"
        typeValue={form.sui.type}
        countValue={form.sui.count}
        dateValue={form.sui.date}
        typeOptions={suiTypeOptions}
        countOptions={countOptions}
        onTypeChange={(v) => updateEntry("sui", "type", v)}
        onCountChange={(v) => updateEntry("sui", "count", v)}
        onDateChange={(v) => updateEntry("sui", "date", v)}
      />

      <VaccineRow
        label="ムンプス_最後に接種したもののみ記入"
        typeValue={form.mumpus.type}
        countValue={form.mumpus.count}
        dateValue={form.mumpus.date}
        typeOptions={mumpusTypeOptions}
        countOptions={countOptions}
        onTypeChange={(v) => updateEntry("mumpus", "type", v)}
        onCountChange={(v) => updateEntry("mumpus", "count", v)}
        onDateChange={(v) => updateEntry("mumpus", "date", v)}
      />

      <VaccineRow
        label="日本脳炎_最後に接種したもののみ記入"
        typeValue={form.niti.type}
        countValue={form.niti.count}
        dateValue={form.niti.date}
        typeOptions={nitiTypeOptions}
        countOptions={countOptions}
        onTypeChange={(v) => updateEntry("niti", "type", v)}
        onCountChange={(v) => updateEntry("niti", "count", v)}
        onDateChange={(v) => updateEntry("niti", "date", v)}
      />

      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {requestId && (
        <div className="rounded-xl border bg-gray-50 px-4 py-3 text-sm">
          request_id: {requestId}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-2xl px-6 py-3 font-semibold border shadow-sm disabled:opacity-50"
      >
        {loading ? "処理中..." : "100円で予定表を作成する"}
      </button>
    </form>
  );
}