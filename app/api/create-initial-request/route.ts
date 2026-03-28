import { runFileMakerScript } from "@/lib/filemaker";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    return Response.json({
      status: "debug",
      env: {
        FILEMAKER_HOST: process.env.FILEMAKER_HOST,
        FILEMAKER_DATABASE: process.env.FILEMAKER_DATABASE,
        FILEMAKER_LAYOUT: process.env.FILEMAKER_LAYOUT,
        CLARIS_USER_POOL_ID: !!process.env.CLARIS_USER_POOL_ID,
        CLARIS_CLIENT_ID: !!process.env.CLARIS_CLIENT_ID,
        CLARIS_ID_REFRESH_TOKEN: !!process.env.CLARIS_ID_REFRESH_TOKEN,
        CLARIS_ID_USERNAME_FOR_REFRESH: process.env.CLARIS_ID_USERNAME_FOR_REFRESH,
      },
      body,
    });
  } catch (err) {
    return Response.json(
      {
        status: "error",
        message: err instanceof Error ? err.message : "unknown error",
      },
      { status: 500 }
    );
  }
}