"use client";

import { useState } from "react";

export default function ResumeTokenForm() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token.trim()) {
      setError("前回用番号を入力してください。");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `/api/get-previous?token=${encodeURIComponent(token.trim())}`,
        { cache: "no-store" }
      );

      const text = await res.text();

      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("前回データ取得APIの応答がJSONではありません。");
      }

      if (!res.ok || data.status !== "ok") {
        throw new Error(data.message || "前回データの取得に失敗しました。");
      }

      const params = new URLSearchParams();
      params.set("mode", "renewal");
      params.set("parent_request_id", data.parent_request_id || "");

      Object.entries(data.initial_values || {}).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.set(key, String(value));
        }
      });

      window.location.href = `/form?${params.toString()}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">前回内容を引き継いで更新</h1>
        <p className="text-sm text-gray-600">
          結果ページに表示された次回用番号を入力すると、前回の内容を引き継いで更新できます。
        </p>
      </div>

      <div className="rounded-2xl border p-4">
        <label className="space-y-2 block">
          <div className="font-semibold">前回用番号</div>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="例: 95C1_869B_37C8"
            className="w-full rounded-lg border px-3 py-2"
          />
        </label>
      </div>

      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-2xl px-6 py-3 font-semibold border shadow-sm disabled:opacity-50"
      >
        {loading ? "読込中..." : "前回内容を読み込む"}
      </button>

      <div className="pt-2">
        <a
          href="/form"
          className="inline-block rounded-2xl border bg-white px-6 py-3 font-semibold shadow-sm"
        >
          新しく作成する
        </a>
      </div>
    </form>
  );
}