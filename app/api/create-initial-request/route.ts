import { runFileMakerScript } from "@/lib/filemaker";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body?.birthday) {
      return Response.json(
        { status: "error", message: "birthday がありません" },
        { status: 400 }
      );
    }

    const fm = await runFileMakerScript("Web受付_API_受付作成", body);

    const scriptResultText = fm?.response?.scriptResult ?? "{}";
    let scriptResult: any = {};

    try {
      scriptResult = JSON.parse(scriptResultText);
    } catch {
      return Response.json(
        {
          status: "error",
          message: "scriptResult の JSON 解析に失敗しました",
          raw: fm,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        status: "ok",
        record_id: scriptResult.record_id,
        request_id: scriptResult.request_id,
        result_url_token: scriptResult.result_url_token,
        raw: fm,
      },
      { status: 200 }
    );
  } catch (err) {
    return Response.json(
      {
        status: "error",
        message: err instanceof Error ? err.message : "create-initial-request failed",
      },
      { status: 500 }
    );
  }
}