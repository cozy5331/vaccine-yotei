import ResumeQrBlock from "@/components/ResumeQrBlock";
import PrintButton from "@/components/PrintButton";

type ResultPageProps = {
  searchParams: Promise<{ request_id?: string }>;
};

async function fetchResult(requestId: string) {
  const baseUrl =
    process.env.APP_BASE_URL || "https://vaccine-yotei.vercel.app";

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

function ResultSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default async function ResultPage({ searchParams }: ResultPageProps) {
  const params = await searchParams;
  const requestId = params.request_id ?? "";

  if (!requestId) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <h1 className="text-2xl font-bold">予防接種予定表</h1>
          <div className="rounded-2xl border border-red-300 bg-red-50 p-5 text-red-700">
            request_id がありません。
          </div>
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

  const resultStatus =
    data?.result?.result_status ??
    data?.judge?.result_status ??
    "";

  const validationStatus =
    data?.result?.validation_status ??
    "";

  return (
    <main className="min-h-screen bg-gray-50 p-6 print:bg-white print:p-0">
      <div className="mx-auto max-w-4xl space-y-6 print:max-w-none print:space-y-4">
        <header className="space-y-2 print:space-y-1">
          <h1 className="text-2xl font-bold print:text-xl">予防接種予定表</h1>
          <p className="text-sm text-gray-600 print:text-xs">
            生成結果の確認ページです。必要に応じてブラウザの印刷機能で PDF 保存してください。
          </p>
        </header>

        <ResultSection title="受付情報">
          <div className="grid gap-4 text-sm md:grid-cols-3">
            <div>
              <div className="text-gray-500">request_id</div>
              <div className="break-all font-medium">{requestId}</div>
            </div>

            <div>
              <div className="text-gray-500">判定状態</div>
              <div className="font-medium">{resultStatus || "未取得"}</div>
            </div>

            <div>
              <div className="text-gray-500">妥当性チェック</div>
              <div className="font-medium">{validationStatus || "未取得"}</div>
            </div>
          </div>
        </ResultSection>

        {data?.status !== "ok" && (
          <section className="rounded-2xl border border-red-300 bg-red-50 p-5 text-red-700">
            <h2 className="text-lg font-semibold">エラー</h2>
            <div className="mt-3 whitespace-pre-wrap text-sm">
              {data?.message || "結果取得に失敗しました。"}
            </div>
            {data?.raw && (
              <pre className="mt-3 overflow-x-auto rounded-xl bg-white p-3 text-xs text-gray-700">
                {typeof data.raw === "string"
                  ? data.raw
                  : JSON.stringify(data.raw, null, 2)}
              </pre>
            )}
          </section>
        )}

        <ResultSection title="予定表">
          {resultHtml ? (
            <div
              className="prose max-w-none prose-headings:mt-4 prose-headings:mb-2 prose-p:my-2 prose-li:my-1"
              dangerouslySetInnerHTML={{ __html: resultHtml }}
            />
          ) : (
            <div className="whitespace-pre-wrap text-sm leading-6">
              {resultText || "まだ結果がありません。"}
            </div>
          )}
        </ResultSection>

        {displayToken && <ResumeQrBlock token={displayToken} />}

<section className="flex flex-wrap gap-3 print:hidden">
  <PrintButton />

  <a
    href="/form"
    className="rounded-2xl border bg-white px-5 py-3 font-semibold shadow-sm"
  >
    新しく作成する
  </a>

  <a
    href="/resume"
    className="rounded-2xl border bg-white px-5 py-3 font-semibold shadow-sm"
  >
    前回内容を引き継いで更新
  </a>
</section>
      </div>
    </main>
  );
}