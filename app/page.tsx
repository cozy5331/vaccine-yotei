export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">こどもの予防接種予定表</h1>
          <p className="text-sm text-gray-600">
            新規作成、または前回内容を引き継いで更新できます。
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <a
            href="/form"
            className="rounded-2xl border bg-white p-6 shadow-sm hover:bg-gray-50"
          >
            <div className="text-lg font-semibold">新しく作成する</div>
            <div className="mt-2 text-sm text-gray-600">
              生年月日や接種履歴を入力して、新しい予定表を作成します。
            </div>
          </a>

          <a
            href="/resume"
            className="rounded-2xl border bg-white p-6 shadow-sm hover:bg-gray-50"
          >
            <div className="text-lg font-semibold">前回内容を引き継いで更新</div>
            <div className="mt-2 text-sm text-gray-600">
              前回用番号を使って、以前の内容をもとに更新します。
            </div>
          </a>
        </div>
      </div>
    </main>
  );
}