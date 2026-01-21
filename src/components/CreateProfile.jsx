import { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CreateProfile = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    username: "",
    display_name: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { profile, authLoading, createProfile } = useAuthStore();
  const navigate = useNavigate();

  if (authLoading) {
    return (<span className="loading loading-spinner loading-xl" />);
  } else if (profile) {
    return (<Navigate to="/dashboard" replace />);
  }

  const validateUsername = (username) => {
    if (!/^[A-Za-z0-9_-]{3,30}$/.test(username)) {
      return t("create_profile.username_criteria");
    }
    return null;
  };

  const validateDisplayName = (displayName) => {
    if (displayName.length < 3 || displayName.length > 30) {
      return t("create_profile.display_name_criteria");
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const usernameError = validateUsername(formData.username);
    if (usernameError) {
      setErrors({ username: usernameError });
      setLoading(false);
      return;
    }

    const displayNameError = validateDisplayName(formData.display_name);
    if (displayNameError) {
      setErrors({ display_name: displayNameError });
      setLoading(false);
      return;
    }

    try {
      const result = await createProfile(formData);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setErrors({ general: result.error })
      }
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
      <legend className="fieldset-legend">{t("create_profile.complete_your_profile")}</legend>

      <label className="label">{t("gen.username")}</label>
      <input onChange={(e) => setFormData({...formData, username: e.target.value})} type="text" className="input" placeholder={t("gen.username")} />
      {errors.username && <p className="text-error">{errors.username}</p>}

      <label className="label">{t("gen.display_name")}</label>
      <input onChange={(e) => setFormData({...formData, display_name: e.target.value})} type="text" className="input" placeholder={t("gen.display_name")} />
      {errors.display_name && <p className="text-error">{errors.display_name}</p>}

      <button type="submit" disabled={loading} className="btn btn-neutral mt-4">
        {(loading && <span className="loading loading-spinner" />) || <>{t("create_profile.create_profile")}</>}
      </button>
      {errors.general && <p className="text-error">{errors.general}</p>}
    </form>
  );
};

export default CreateProfile;