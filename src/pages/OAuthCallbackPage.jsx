import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { useNavigate, useLocation } from "react-router-dom";

const OAuthCallbackPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { handleOAuthCallback } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const provider = location.pathname.includes('/github') ? 'GitHub' : 'Google';

  useEffect(() => {
    const processCallback = async () => {
      try {
        const result = await handleOAuthCallback();

        if (result && result.success) {
          if (result.isNewUser && !result.hasProfile) {
            navigate("/createprofile");
          } else {
            navigate("/dashboard");
          }
        } else {
          const errorMessage = result?.error || `Failed to complete ${provider} sign-in`;
          console.error(`${provider} callback failed:`, errorMessage);
          console.log(result);
          setError(errorMessage);

          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      } catch (error) {
        console.error(`Error processing ${provider} callback:`, error);
        setError(error.message || "Something went wrong");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    processCallback();
  }, [handleOAuthCallback, provider]);

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <span className="loading loading-spinner loading-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen justify-center items-center">
        <div className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <p className="text-error text-center">{error}</p>
          <p className="text-sm text-center mt-2">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default OAuthCallbackPage;