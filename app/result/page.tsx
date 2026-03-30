type ResultPageProps = {
  searchParams: Promise<{ request_id?: string }>;
};

export default async function ResultPage({ searchParams }: ResultPageProps) {
  const params = await searchParams;
  const requestId = params.request_id ?? "";

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">決済後の確認ページ</h1>
        <p className="text-sm text-gray-600">
          Stripe の決済後にこのページへ戻っています。
        </p>

        <div className="rounded-2xl border p-4">
          <div className="font-semibold">request_id</div>
          <div className="break-all text-sm">{requestId || "なし"}</div>
        </div>

        <div className="rounded-2xl border p-4">
          ここに今後、予定表の結果を表示します。
        </div>
      </div>
    </main>
  );
}