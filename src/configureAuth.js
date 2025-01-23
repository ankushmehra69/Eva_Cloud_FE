import { Amplify } from "aws-amplify";
import { fetchAuthSession } from "aws-amplify/auth";
import axios from "axios";

function configureAuth() {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
        userPoolId: import.meta.env.VITE_USER_POOL_ID,
        loginWith: {
          username: "false",
          email: "true",
          phone: "false",
        },
      },
    },
  });

  axios.interceptors.request.use(async function (config) {
    if (
      config.url &&
      config.url.startsWith(import.meta.env.VITE_HTTP_API_URL)
    ) {
      try {
        const session = await fetchAuthSession();
        config.headers.Authorization = session.tokens.accessToken.toString();
      } catch (err) {
        console.log(err);
      }
    }
    return config;
  });
}

export default configureAuth;
