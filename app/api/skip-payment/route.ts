import { runFileMakerScript } from "@/lib/filemaker";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const requestId = body?.request_id;

    if (!requestId) {
      return Response.json(
        { status: "error", message: "request_id がありません" },
        { status: 400 }
      );
    }

    const fm = await runFileMakerScript("Web受付_API_支払済反映", {
      request_id: requestId,
      payment_id: "free_no_charge",
    });

    let scriptResult: any = {};
    try {
      scriptResult = JSON.parse(fm?.response?.scriptResult ?? "{}");
    } catch {
      scriptResult = { raw: fm?.response?.scriptResult ?? "" };
    }

    return Response.json(
      {
        status: "ok",
        request_id: requestId,
        filemaker: scriptResult,
      },
      { status: 200 }
    );
  } catch (err) {
    return Response.json(
      {
        status: "error",
        message: err instanceof Error ? err.message : "skip-payment failed",
      },
      { status: 500 }
    );
  }
}
