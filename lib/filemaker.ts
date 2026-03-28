import {
  CognitoUser,
  CognitoUserPool,
  CognitoRefreshToken,
} from "amazon-cognito-identity-js";

async function getClarisIdTokenFromRefreshToken(): Promise<string> {
  const userPoolId = process.env.CLARIS_USER_POOL_ID;
  const clientId = process.env.CLARIS_CLIENT_ID;
  const refreshTokenValue = process.env.CLARIS_ID_REFRESH_TOKEN;

  if (!userPoolId || !clientId || !refreshTokenValue) {
    throw new Error(
      "CLARIS_USER_POOL_ID / CLARIS_CLIENT_ID / CLARIS_ID_REFRESH_TOKEN が未設定です"
    );
  }

  const userPool = new CognitoUserPool({
    UserPoolId: userPoolId,
    ClientId: clientId,
  });

  // Username は refreshSession のために必要
  // ここでは固定値ではなく subject として扱えるよう、任意の識別子ではなく
  // 実際には取得時に使った Claris ID メールアドレスを入れるのが安全です
  const username = process.env.CLARIS_ID_USERNAME_FOR_REFRESH;

  if (!username) {
    throw new Error("CLARIS_ID_USERNAME_FOR_REFRESH が未設定です");
  }

  const cognitoUser = new CognitoUser({
    Username: username,
    Pool: userPool,
  });

  const refreshToken = new CognitoRefreshToken({
    RefreshToken: refreshTokenValue,
  });

  return await new Promise<string>((resolve, reject) => {
    cognitoUser.refreshSession(refreshToken, (err, session) => {
      if (err) {
        reject(err);
        return;
      }

      const idToken = session.getIdToken().getJwtToken();
      resolve(idToken);
    });
  });
}

async function getDataApiSessionToken(): Promise<string> {
  const host = process.env.FILEMAKER_HOST;
  const database = process.env.FILEMAKER_DATABASE;

  if (!host || !database) {
    throw new Error("FILEMAKER_HOST / FILEMAKER_DATABASE が未設定です");
  }

  const clarisIdToken = await getClarisIdTokenFromRefreshToken();

  const res = await fetch(
    `https://${host}/fmi/data/vLatest/databases/${encodeURIComponent(database)}/sessions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `FMID ${clarisIdToken}`,
      },
      body: "{}",
      cache: "no-store",
    }
  );

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      body?.messages?.[0]?.message || `Failed to create Data API session: ${res.status}`
    );
  }

  const sessionToken = res.headers.get("x-fm-data-access-token");

  if (!sessionToken) {
    throw new Error("X-FM-Data-Access-Token が取得できません");
  }

  return sessionToken;
}

export async function runFileMakerScript(scriptName: string, parameter: unknown) {
  const host = process.env.FILEMAKER_HOST;
  const database = process.env.FILEMAKER_DATABASE;
  const layout = process.env.FILEMAKER_LAYOUT;

  if (!host || !database || !layout) {
    throw new Error("FILEMAKER_HOST / FILEMAKER_DATABASE / FILEMAKER_LAYOUT が未設定です");
  }

  const sessionToken = await getDataApiSessionToken();

  const url =
    `https://${host}/fmi/data/vLatest/databases/${encodeURIComponent(database)}` +
    `/layouts/${encodeURIComponent(layout)}` +
    `/script/${encodeURIComponent(scriptName)}` +
    `?script.param=${encodeURIComponent(JSON.stringify(parameter))}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${sessionToken}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.messages?.[0]?.message || `Script run failed: ${res.status}`);
  }

  if (data?.messages?.[0]?.code && data.messages[0].code !== "0") {
    throw new Error(data?.messages?.[0]?.message || "FileMaker script error");
  }

  return data;
}