import { create } from "zustand";
import axios from "axios";
import SuperTokens from 'supertokens-web-js';
import SupertokensConfig from "../utils/SupertokensConfig";
import Session from "supertokens-web-js/recipe/session";
import { signUp, signIn } from "supertokens-web-js/recipe/emailpassword";
import { getAuthorisationURLWithQueryParamsAndSetState, signInAndUp } from "supertokens-web-js/recipe/thirdparty";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const useAuthStore = create((set, get) => ({
  initialized: false,
  user: null,
  profile: null,
  authLoading: true,
  profileLoading: false,
  error: null,

  initialize: async () => {
    //console.log("Auth called");

    if (!get().initialized) {
      SuperTokens.init(SupertokensConfig());
      set({ initialized: true });
    }

    const sessionExists = await Session.doesSessionExist();
    if (!sessionExists) {
      set({ authLoading: false });
      return;
    }

    const userId = await Session.getUserId();
    set({ user: userId });

    await get().fetchProfile();
    set({ authLoading: false });
  },

  register: async (email, password) => {
    try {
      const response = await signUp({
        formFields: [{
          id: "email",
          value: email
        }, {
          id: "password",
          value: password
        }]
      });

      console.log(response);

      if (response.status === "FIELD_ERROR") {
        return ({ success: false, error: response.formFields[0].error });
      } else if (response.status === "SIGN_UP_NOT_ALLOWED") {
        return ({ success: false, error: response.reason });
      } else {
        await Session.attemptRefreshingSession();
        await get().initialize();
        return ({ success: true, data: response });
      }

    } catch (err) {
      if (err.isSuperTokenGeneralError) {
        return ({ success: false, error: err.message });
      } else {
        console.log(err);
        return ({ success: false, error: "Something went wrong" });
      }
    }
  },

  login: async (email, password) => {
    try {
      const response = await signIn({
        formFields: [{
          id: "email",
          value: email
        }, {
          id: "password",
          value: password
        }]
      });

      console.log(response);

      if (response.status === "FIELD_ERROR") {
        return ({ success: false, error: response.formFields[0].error });
      } else if (response.status === "WRONG_CREDENTIALS_ERROR") {
        return ({ success: false, error: "Email password combination is incorrect" });
      } else if (response.status === "SIGN_IN_NOT_ALLOWED") {
        return ({ success: false, error: response.reason });
      } else {
        await Session.attemptRefreshingSession();
        await get().initialize();
        return ({ success: true, data: response });
      }

    } catch (err) {
      if (err.isSuperTokenGeneralError) {
        return({ success: false, error: err.message });
      } else {
        console.log(err);
        return({ success: false, error: "Something went wrong" });
      }
    }
  },

  logout: async () => {
    await Session.signOut();
    set({ user: null, profile: null });
  },

  googleSignIn: async () => {
    try {
      const authUrl = await getAuthorisationURLWithQueryParamsAndSetState({
        thirdPartyId: "google",
        frontendRedirectURI: `${window.location.origin}/auth/callback/google`
      });

      window.location.assign(authUrl);
    } catch (err) {
      if (err.isSuperTokensGeneralError === true) {
        return { success: false, error: err.message };
      } else {
        console.error("Google sign-in error:", err);
        return {
          success: false,
          error: err.message || "Failed to connect to authentication server. Please check if the backend is running and configured correctly."
        };
      }
    }
  },

  githubSignIn: async () => {
    try {
      const authUrl = await getAuthorisationURLWithQueryParamsAndSetState({
        thirdPartyId: "github",
        frontendRedirectURI: `${window.location.origin}/auth/callback/github`
      });

      window.location.assign(authUrl);
    } catch (err) {
      if (err.isSuperTokensGeneralError === true) {
        return { success: false, error: err.message };
      } else {
        console.error("GitHub sign-in error:", err);
        return {
          success: false,
          error: err.message || "Failed to connect to authentication server. Please check if the backend is running and configured correctly."
        };
      }
    }
  },

  handleOAuthCallback: async () => {
    try {
      const response = await signInAndUp();

      if (response.status === "OK") {
        console.log(response.user);
        await Session.attemptRefreshingSession();
        await get().initialize();
        const currentProfile = get().profile;

        if (response.createdNewRecipeUser && response.user.loginMethods.length === 1) {
          // sign up successful
          return { success: true, isNewUser: true, hasProfile: !!currentProfile, data: response };
        } else {
          // sign in successful
          return { success: true, isNewUser: false, hasProfile: !!currentProfile, data: response };
        }
      } else if (response.status === "SIGN_IN_UP_NOT_ALLOWED") {
        console.error("Sign in/up not allowed:", response.reason);
        return { success: false, error: response.reason };
      } else {
        console.error("No email provided by social login");
        return { success: false, error: "No email provided by social login. Please use another form of login" };
      }
    } catch (err) {
      if (err.isSuperTokensGeneralError === true) {
        return { success: false, error: err.message };
      } else {
        console.log("Error", err);
        const errorMsg = err.message || err.toString() || "Oops! Something went wrong.";
        return { success: false, error: errorMsg };
      }
    }
  },

  fetchProfile: async () => {
    set({ profileLoading: true });
    try {
      const response = await axios.get(`${SERVER_URL}/api/profiles/me`);
      if (response.data.success) {
        set({ profile: response.data.data, error: null});
      }
    } catch (err) {
      if (err.response?.status === 404) {
        set({ error: null, profile: null });
      } else {
        const errorData = err.response?.data;
        set({ error: errorData?.message, profile: null });
      }
    } finally {
      set({ profileLoading: false });
    }
  },

  createProfile: async (profileData) => {
    try {
      const response = await axios.post(`${SERVER_URL}/api/profiles`, profileData);
      if (response.data.success) {
        set({profile: response.data.data, error: null});
        return({ success: true, data: response.data.data });
      };

    } catch (err) {
      const errorData = err.response?.data;
      set({error: errorData?.message, profile: null});
      console.log(errorData?.message);
      return({ success: false, error: errorData?.message });
    }
  },

  updateProfile: async (changedData) => {
    try {
      const response = await axios.put(`${SERVER_URL}/api/profiles`, changedData);
      if (response.data.success) {
        set({profile: response.data.data, error: null});
        return({ success: true, data: response.data.data });
      };
    } catch (err) {
      const errorData = err.response?.data;
      set({ error: errorData?.message });
      return({ success: false, error: errorData?.message });
    }
  },

  deleteAvatar: async () => {
    try {
      const response = await axios.delete(`${SERVER_URL}/api/profiles/avatar`);
      if (response.data.success) {
        set((state) => ({
          profile: {
            ...state.profile,
            avatar_url: null
          }
        }));
      }
    } catch (err) {
      const errorData = err.response?.data;
      set({ error: errorData?.message });
    }
  }
}));