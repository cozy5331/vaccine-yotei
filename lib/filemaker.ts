import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from "amazon-cognito-identity-js";

type ClarisEndpointResponse = {
  errcode: string;
  data: {
    UserPool_ID: string;
    Client_ID: string;
  };
};

async function getClarisPoolInfo() {
  const res = await fetch(
    "https://www.ifmcloud.com/endpoint/userpool/2.2.0.my.claris.com.json",
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch Claris pool info: ${res.status}`);
  }

  const json = (await res.json()) as ClarisEndpointResponse;

  if (json.errcode !== "Ok") {
    throw new Error("Failed to load Claris authentication settings");
  }

  return {
    userPoolId: json.data.UserPool_ID,
    clientId: json.data.Client_ID,
  };
}

async function getClarisIdToken(): Promise<string> {
  const username = process.env.CLARIS_ID_USERNAME;
  const password = process.env.CLARIS_ID_PASSWORD;

  if (!username || !password) {
    throw new Error("CLARIS_ID_USERNAME または CLARIS_ID_PASSWORD が未設定です");
  }

  const { userPoolId, clientId } = await getClarisPoolInfo();

  return await new Promise<string>((resolve, reject) => {
    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    const userPool = new CognitoUserPool({
      UserPoolId: userPoolId,
      ClientId: clientId,
    });

    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        const clarisIdToken = result.getIdToken().getJwtToken();
        resolve(clarisIdToken);
      },
      onFailure: (err) => {
        reject(err);
      },
      mfaRequired: () => {
        reject(new Error("MFA が有効な Claris ID はサーバー側自動処理に不向きです"));
      },
    });
  });
}

async function getDataApiSessionToken(): Promise<string> {
  const host = process.env.FILEMAKER_HOST;
  const database = process.env.FILEMAKER_DATABASE;

  if (!host || !database) {
    throw new Error("FILEMAKER_HOST または FILEMAKER_DATABASE が未設定です");
  }

  const clarisIdToken = await getClarisIdToken();

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

  if (!res.ok) {
    throw new Error(`Failed to create Data API session: ${res.status}`);
  }

  const sessionToken = res.headers.get("x-fm-data-access-token");
  const body = await res.json();

  if (!sessionToken || body?.messages?.[0]?.code !== "0") {
    throw new Error(body?.messages?.[0]?.message || "Data API session creation failed");
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
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok || data?.messages?.[0]?.code !== "0") {
    throw new Error(data?.messages?.[0]?.message || `Script run failed: ${res.status}`);
  }

  return data;
}