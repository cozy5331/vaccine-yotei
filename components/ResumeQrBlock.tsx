import QRCode from "qrcode";

type ResumeQrBlockProps = {
  token: string;
};

export default async function ResumeQrBlock({ token }: ResumeQrBlockProps) {
  const baseUrl =
    process.env.APP_BASE_URL || "https://vaccine-yotei.vercel.app";

  const resumeUrl = `${baseUrl}/resume?token=${encodeURIComponent(token)}`;
  const qrDataUrl = await QRCode.toDataURL(resumeUrl, {
    margin: 1,
    width: 220,
  });

  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold">次回用番号</h2>

      <div className="mt-3 space-y-3">
        <div className="text-sm text-gray-600">
          次回、前回内容を引き継いで更新する時に使います。
        </div>

        <div className="break-all rounded-xl bg-gray-100 px-4 py-3 text-base font-semibold tracking-wide">
          {token}
        </div>

        <div className="text-sm">
          <div className="text-gray-500">次回用URL</div>
          <div className="break-all">{resumeUrl}</div>
        </div>

        <div className="pt-2">
          <img
            src={qrDataUrl}
            alt="次回用QRコード"
            width={220}
            height={220}
            className="rounded-lg border"
          />
        </div>
      </div>
    </section>
  );
}