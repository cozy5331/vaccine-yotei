import { runFileMakerScript } from "@/lib/filemaker";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const requestId = searchParams.get("request_id");

    if (!requestId) {
      return Response.json(
        {
          status: "error",
          message: "request_id がありません",
        },
        { status: 400 }
      );
    }

    const judgeRaw = await runFileMakerScript("Web受付_API_予防接種判定", {
      request_id: requestId,
    });

    let judgeResult: any = {};
    try {
      judgeResult = JSON.parse(judgeRaw?.response?.scriptResult ?? "{}");
    } catch {
      judgeResult = { raw: judgeRaw?.response?.scriptResult ?? "" };
    }

    const resultRaw = await runFileMakerScript("Web受付_API_結果取得", {
      request_id: requestId,
    });

    let resultData: any = {};
    try {
      resultData = JSON.parse(resultRaw?.response?.scriptResult ?? "{}");
    } catch {
      resultData = { raw: resultRaw?.response?.scriptResult ?? "" };
    }

    return Response.json(
      {
        status: "ok",
        request_id: requestId,
        judge: judgeResult,
        result: resultData,
      },
      { status: 200 }
    );
  } catch (err) {
    return Response.json(
      {
        status: "error",
        message: err instanceof Error ? err.message : "get-result failed",
      },
      { status: 500 }
    );
  }
}