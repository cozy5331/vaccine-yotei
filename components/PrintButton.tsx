"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-2xl border bg-white px-5 py-3 font-semibold shadow-sm"
    >
      PDFとして保存 / 印刷
    </button>
  );
}