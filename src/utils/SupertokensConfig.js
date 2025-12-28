import Session from "supertokens-web-js/recipe/session";
import EmailPassword from "supertokens-web-js/recipe/emailpassword";
import ThirdParty from "supertokens-web-js/recipe/thirdparty";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const SupertokensConfig = () => {
  return {
    appInfo: {
      apiDomain: SERVER_URL,
      apiBasePath: "/auth",
      appName: "MCodex"
    },
    recipeList: [
      ThirdParty.init(),
      EmailPassword.init(),
      Session.init()
    ]
  };
};

export default SupertokensConfig;