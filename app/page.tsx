export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">こどもの予防接種予定表</h1>
          <p className="text-sm text-gray-600">
            生年月日と接種履歴を入力するだけで、小児のワクチン予定表が一気に出来上がります。
          </p>
          <p className="text-sm text-gray-600">
            新規作成、または前回内容を引き継いで更新できます。
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-4 text-sm text-gray-600 space-y-2">
          <p>
            予定が変わった場合は、前回発行したQRコードから前回の内容を引き継いで更新できます。その際は、実際に接種が済んだ分だけを入力して作成してください。
          </p>
          <p>
            入力内容をもとにFileMakerがAIへデータを送り、AIからの回答をFileMaker側でチェックしたうえで予定表を作成しています。そのため、作成に1分前後かかることがあります。
          </p>
          <p>
            小児のワクチン接種に携わる医療関係者の方はぜひご活用ください。一般の方もご利用いただけますが、内容は必ずかかりつけ医にご確認ください。
          </p>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          予防接種予定表は、事情の許す限り無料でご提供しています。画面上「支払済」と表示されますが、料金は発生しません。
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