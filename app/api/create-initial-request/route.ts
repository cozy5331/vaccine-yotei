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

    try {
      const fm = await runFileMakerScript("Web受付_API_受付作成", body);

      return Response.json(
        {
          status: "ok",
          raw: fm,
        },
        { status: 200 }
      );
    } catch (err) {
      return Response.json(
        {
          status: "debug-error",
          step: "runFileMakerScript",
          message: err instanceof Error ? err.message : "unknown error",
        },
        { status: 500 }
      );
    }
  } catch (err) {
    return Response.json(
      {
        status: "error",
        step: "route",
        message: err instanceof Error ? err.message : "unknown error",
      },
      { status: 500 }
    );
  }
}