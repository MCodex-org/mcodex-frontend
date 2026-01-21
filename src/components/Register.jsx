import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useState } from "react";
import { SquareLibrary } from "lucide-react";
import { useTranslation } from "react-i18next";

const Register = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user, profile, authLoading, profileLoading, register, logout, googleSignIn, githubSignIn } = useAuthStore();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await register(email, password);
      if (result.success) {
        navigate("/createprofile");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      logout();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await googleSignIn();
      if (result && !result.success) {
        setError(result.error);
        setLoading(false);
      }
    } catch (err) {
      setError(err.message || t("auth.error_google_register"));
      setLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await githubSignIn();
      if (result && !result.success) {
        setError(result.error);
        setLoading(false);
      }
    } catch (err) {
      setError(err.message || t("auth.error_github_register"));
      setLoading(false);
    }
  };

  if (authLoading || profileLoading) {
    return (<span className="loading loading-spinner loading-xl" />);
  } else if(profile) {
    return (
      <form className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <p className="text-xl mb-2">{t("auth.already_logged_in")}</p>
        <Link to="/dashboard" className="btn btn-primary mt-2">{t("auth.go_to_dashboard")}</Link>
        <button onClick={handleLogout} disabled={loading} className="btn btn-error mt-2">
          {(loading && <span className="loading loading-spinner" />) || <>{t("gen.log_out")}</>}
        </button>
        {error && <p className='text-error text-center pt-4'>{error}</p>}
      </form>
    )
  } else if (user) {
    return (
      <form className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <p className="text-xl mb-2">{t("auth.already_logged_in")}</p>
        <Link to="/createprofile" className="btn btn-primary mt-2">{t("auth.finish_your_profile")}</Link>
        <button onClick={handleLogout} disabled={loading} className="btn btn-error mt-2">
          {(loading && <span className="loading loading-spinner" />) || <>{t("gen.log_out")}</>}
        </button>
        {error && <p className='text-error text-center pt-4'>{error}</p>}
      </form>
    )
  }

  return(
    <div>
      <Link to="/" className="flex justify-center items-center mb-4 gap-2">
        <SquareLibrary size={48} className="text-primary" strokeWidth={2.25} />
        <p className="font-bold text-4xl bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">MCodex</p>
      </Link>

      <form onSubmit={handleRegister} className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend">{t("gen.register")}</legend>

        <label className="label">{t("auth.email")}</label>
        <input onChange={(e) => setEmail(e.target.value)} type="email" className="input" placeholder={t("auth.email")} />

        <label className="label">{t("auth.password")}</label>
        <input onChange={(e) => setPassword(e.target.value)} type="password" className="input" placeholder={t("auth.password")} />

        <p>{t("auth.already_have_account")} <Link to="/login" className="text-primary">{t("gen.log_in")}</Link></p>
        {error && <p className='text-error text-center pt-4'>{error}</p>}

        <button type="submit" disabled={loading} className="btn btn-neutral mt-4 w-full">
          {(loading && <span className="loading loading-spinner" />) || <>{t("gen.register")}</>}
        </button>

        <div className="divider">{t("auth.or")}</div>

        <button 
          type="button" 
          onClick={handleGoogleSignIn} 
          disabled={loading} 
          className="btn btn-outline w-full"
        >
          {(loading && <span className="loading loading-spinner" />) || (
            <>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {t("auth.google_sign_up")}
            </>
          )}
        </button>

        <button 
          type="button" 
          onClick={handleGithubSignIn} 
          disabled={loading} 
          className="btn btn-outline w-full mt-2"
        >
          {(loading && <span className="loading loading-spinner" />) || (
            <>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              {t("auth.github_sign_up")}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Register;