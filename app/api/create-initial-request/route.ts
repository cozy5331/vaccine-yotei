import { runFileMakerScript } from "@/lib/filemaker";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body?.birthday) {
      return Response.json(
        {
          status: "error",
          message: "birthday がありません",
        },
        { status: 400 }
      );
    }

    const fm = await runFileMakerScript("API_受付作成", body);

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
        status: "error",
        message: err instanceof Error ? err.message : "create-initial-request failed",
      },
      { status: 500 }
    );
  }
}