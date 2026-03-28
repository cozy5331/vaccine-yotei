import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from "amazon-cognito-identity-js";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

async function getClarisPoolInfo() {
  const res = await fetch(
    "https://www.ifmcloud.com/endpoint/userpool/2.2.0.my.claris.com.json"
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch Claris pool info: ${res.status}`);
  }

  const json = await res.json();

  if (json.errcode !== "Ok") {
    throw new Error("Failed to load Claris authentication settings");
  }

  return {
    userPoolId: json.data.UserPool_ID,
    clientId: json.data.Client_ID,
  };
}

async function main() {
  const username = process.env.CLARIS_ID_USERNAME;
  const password = process.env.CLARIS_ID_PASSWORD;

  if (!username || !password) {
    throw new Error("CLARIS_ID_USERNAME / CLARIS_ID_PASSWORD を環境変数に入れてください");
  }

  const { userPoolId, clientId } = await getClarisPoolInfo();

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

  const rl = readline.createInterface({ input, output });

  await new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        const idToken = result.getIdToken().getJwtToken();
        const refreshToken = result.getRefreshToken().getToken();

        console.log("");
        console.log("=== SUCCESS ===");
        console.log("USER_POOL_ID=");
        console.log(userPoolId);
        console.log("");
        console.log("CLIENT_ID=");
        console.log(clientId);
        console.log("");
        console.log("CLARIS_ID_TOKEN=");
        console.log(idToken);
        console.log("");
        console.log("CLARIS_ID_REFRESH_TOKEN=");
        console.log(refreshToken);
        console.log("");

        resolve();
      },

      onFailure: (err) => {
        reject(err);
      },

      mfaRequired: async () => {
        try {
          const code = await rl.question("MFA code を入力してください: ");
          cognitoUser.sendMFACode(code.trim(), {
            onSuccess: (result) => {
              const idToken = result.getIdToken().getJwtToken();
              const refreshToken = result.getRefreshToken().getToken();

              console.log("");
              console.log("=== MFA SUCCESS ===");
              console.log("USER_POOL_ID=");
              console.log(userPoolId);
              console.log("");
              console.log("CLIENT_ID=");
              console.log(clientId);
              console.log("");
              console.log("CLARIS_ID_TOKEN=");
              console.log(idToken);
              console.log("");
              console.log("CLARIS_ID_REFRESH_TOKEN=");
              console.log(refreshToken);
              console.log("");

              resolve();
            },
            onFailure: (err) => reject(err),
          });
        } catch (e) {
          reject(e);
        }
      },
    });
  });

  await rl.close();
}

main().catch((err) => {
  console.error("ERROR:", err);
  process.exit(1);
});