export async function callFileMakerScript(scriptName: string, payload: unknown) {
  const res = await fetch(process.env.FILEMAKER_SCRIPT_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.FILEMAKER_TOKEN}`,
    },
    body: JSON.stringify({
      script: scriptName,
      parameter: payload,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`FileMaker HTTP error: ${res.status}`);
  }

  const data = await res.json();

  if (data.status === "error") {
    throw new Error(data.message || "FileMaker script error");
  }

  return data;
}