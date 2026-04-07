import ResumeQrBlock from "@/components/ResumeQrBlock";

type SearchParams = Promise<{
  request_id?: string;
}>;

async function getResult(requestId: string) {
  const baseUrl =
    process.env.APP_BASE_URL || "https://vaccine-yotei.vercel.app";

  const res = await fetch(
    `${baseUrl}/api/get-result?request_id=${encodeURIComponent(requestId)}`,
    { cache: "no-store" }
  );

  return res.json();
}

export default async function ResultPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const requestId = params?.request_id ?? "";

  if (!requestId) {
    return (
      <main className="mx-auto max-w-4xl p-6 space-y-6">
        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-bold">予防接種予定表</h1>
          <p className="mt-3 text-sm text-red-600">request_id がありません。</p>
        </section>
      </main>
    );
  }

  const data = await getResult(requestId);

  const paymentStatus = data?.result?.payment_status ?? "";
  const resultStatus = data?.result?.result_status ?? "";
  const validationStatus = data?.result?.validation_status ?? "";
  const validationErrors = data?.result?.validation_errors ?? "";
  const createdAt = data?.result?.created_at ?? "";
  const displayToken = data?.result?.display_token ?? "";
  const resultHtml = data?.result?.result_html ?? "";
  const resultText = data?.result?.result_text ?? "";
  const errorMessage = data?.result?.error_message ?? "";

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6">
      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold">予防接種予定表</h1>
        <p className="mt-2 text-sm text-gray-600">
          生成結果の確認ページです。必要に応じてブラウザの印刷機能で PDF
          保存してください。
        </p>
      </section>

      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">受付情報</h2>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div>
            <div className="text-sm text-gray-500">request_id</div>
            <div className="font-medium break-all">{requestId}</div>
          </div>

          <div>
            <div className="text-sm text-gray-500">作成日時</div>
            <div className="font-medium">{createdAt || "未取得"}</div>
          </div>

          <div>
            <div className="text-sm text-gray-500">支払状態</div>
            <div className="font-medium">{paymentStatus || "未取得"}</div>
          </div>

          <div>
            <div className="text-sm text-gray-500">判定状態</div>
            <div className="font-medium">{resultStatus || "未取得"}</div>
          </div>

          <div>
            <div className="text-sm text-gray-500">妥当性チェック</div>
            <div className="font-medium">{validationStatus || "未取得"}</div>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3">
          <p className="text-xs leading-5 text-gray-500">
            ※ 判定状態と妥当性チェックは内部確認用の表示です。予定表が表示されていれば、その内容を接種計画の目安としてご利用いただけます。内部処理の反映タイミングや機械的な確認条件により、「処理中」や「NG」と表示されることがあります。日程調整が大きい場合は、近々の予防接種後にもう一度予定表を作成してください。
          </p>
        </div>
      </section>

      {errorMessage && (
        <section className="rounded-2xl border border-amber-300 bg-amber-50 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-amber-800">補足情報</h2>
          <p className="mt-2 text-sm text-amber-800">{errorMessage}</p>
        </section>
      )}

      {validationErrors && (
        <section className="rounded-2xl border border-yellow-300 bg-yellow-50 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-yellow-800">
            妥当性チェック詳細
          </h2>
          <pre className="mt-2 whitespace-pre-wrap text-sm text-yellow-800">
            {validationErrors}
          </pre>
        </section>
      )}

      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">予定表</h2>

        {resultHtml ? (
          <div
            className="prose prose-sm mt-4 max-w-none"
            dangerouslySetInnerHTML={{ __html: resultHtml }}
          />
        ) : resultText ? (
          <pre className="mt-4 whitespace-pre-wrap text-sm leading-7">
            {resultText}
          </pre>
        ) : (
          <p className="mt-4 text-sm text-gray-600">まだ結果がありません。</p>
        )}
      </section>

      {displayToken && <ResumeQrBlock token={displayToken} />}

      <section className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-2xl border bg-white px-5 py-3 text-sm font-semibold shadow-sm"
        >
          PDFとして保存 / 印刷
        </button>

        <a
          href="/form"
          className="rounded-2xl border bg-white px-5 py-3 text-sm font-semibold shadow-sm"
        >
          新しく作成する
        </a>

        {displayToken && (
          <a
            href={`/resume?token=${encodeURIComponent(displayToken)}`}
            className="rounded-2xl border bg-white px-5 py-3 text-sm font-semibold shadow-sm"
          >
            前回内容を引き継いで更新
          </a>
        )}
      </section>
    </main>
  );
}