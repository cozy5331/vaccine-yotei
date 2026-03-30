type ResultPageProps = {
  searchParams: Promise<{ request_id?: string }>;
};

async function fetchResult(requestId: string) {
  const baseUrl = process.env.APP_BASE_URL || "https://vaccine-yotei.vercel.app";

  const res = await fetch(
    `${baseUrl}/api/get-result?request_id=${encodeURIComponent(requestId)}`,
    { cache: "no-store" }
  );

  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch {
    return {
      status: "error",
      message: "結果APIの応答がJSONではありません",
      raw: text,
    };
  }
}

export default async function ResultPage({ searchParams }: ResultPageProps) {
  const params = await searchParams;
  const requestId = params.request_id ?? "";

  if (!requestId) {
    return (
      <main className="min-h-screen p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold">結果ページ</h1>
          <p className="mt-4 text-red-600">request_id がありません。</p>
        </div>
      </main>
    );
  }

  const data = await fetchResult(requestId);

  const resultHtml =
    data?.result?.result_html ??
    data?.result?.html ??
    data?.result?.resultHtml ??
    "";

  const resultText =
    data?.result?.result_text ??
    data?.result?.text ??
    "";

  const displayToken =
    data?.result?.display_token ??
    data?.result?.result_url_token ??
    "";

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">予防接種予定表</h1>

        <div className="rounded-2xl border p-4">
          <div className="font-semibold">request_id</div>
          <div className="break-all text-sm">{requestId}</div>
        </div>

        {data?.status !== "ok" && (
          <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-red-700">
            {data?.message || "結果取得に失敗しました。"}
          </div>
        )}

        {resultHtml ? (
          <div
            className="rounded-2xl border p-4 prose max-w-none"
            dangerouslySetInnerHTML={{ __html: resultHtml }}
          />
        ) : (
          <div className="rounded-2xl border p-4 whitespace-pre-wrap text-sm">
            {resultText || "まだ結果がありません。"}
          </div>
        )}

        {displayToken && (
          <div className="rounded-2xl border p-4">
            <div className="font-semibold">次回用番号</div>
            <div className="break-all text-sm">{displayToken}</div>
          </div>
        )}
      </div>
    </main>
  );
}