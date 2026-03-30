import { runFileMakerScript } from "@/lib/filemaker";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return Response.json(
        {
          status: "error",
          message: "token がありません",
        },
        { status: 400 }
      );
    }

    const fm = await runFileMakerScript("Web受付_API_前回データ取得", {
      result_url_token: token,
    });

    let scriptResult: any = {};
    try {
      scriptResult = JSON.parse(fm?.response?.scriptResult ?? "{}");
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
        parent_request_id: scriptResult.parent_request_id,
        initial_values: scriptResult.initial_values,
        raw: fm,
      },
      { status: 200 }
    );
  } catch (err) {
    return Response.json(
      {
        status: "error",
        message: err instanceof Error ? err.message : "get-previous failed",
      },
      { status: 500 }
    );
  }
}