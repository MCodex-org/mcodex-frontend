import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { CircleX } from "lucide-react";
import toast from "react-hot-toast";

const CDN_URL = import.meta.env.VITE_CDN_URL;


const ProfileSettings = () => {
  const { profile, updateProfile, deleteAvatar } = useAuthStore();
  const placeholder = "Portrait_Placeholder.png";
  const [changedVariables, setChangedVariables] = useState({
    display_name: null,
    username: null,
    about: null,
    avatar: null
  });
  const [hasChange, setHasChange] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(`${CDN_URL}/${profile?.avatar_url || placeholder}`);
  const [loading , setLoading] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    setAvatarUrl(`${CDN_URL}/${profile?.avatar_url || placeholder}`);
  }, [profile]);

  useEffect(() => {
    if (changedVariables.display_name !== null || changedVariables.username !== null || changedVariables.about !== null || changedVariables.avatar !== null) {
      setHasChange(true);
    } else {
      setHasChange(false);
    }

    setErr(null);

  }, [changedVariables]);

  const handleDisplayNameChange = (e) => {
    if (e.target.value !== profile.display_name) {
      setChangedVariables(prev => ({ ...prev, display_name: e.target.value }));
    } else {
      setChangedVariables(prev => ({ ...prev, display_name: null }));
    }
  };

  const handleUsernameChange = (e) => {
    if (e.target.value !== profile.username) {
      setChangedVariables(prev => ({ ...prev, username: e.target.value }));
    } else {
      setChangedVariables(prev => ({ ...prev, username: null }));
    }
  };

  const handleAboutChange = (e) => {
    if (e.target.value !== profile.about) {
      setChangedVariables(prev => ({ ...prev, about: e.target.value }));
    } else {
      setChangedVariables(prev => ({ ...prev, about: null }));
    }
  };

  const handleAvatarChange = (e) => {
    try {
      const files = e.target.files;

      if (files && files.length > 0){
        setAvatarUrl(URL.createObjectURL(files[0]));
        setChangedVariables(prev => ({ ...prev, avatar: files[0] }));
      } else {
        setAvatarUrl(`${CDN_URL}/${profile.avatar_url}`);
        setChangedVariables(prev => ({ ...prev, avatar: null }));
      }
      setErr(null);
    } catch (fileErr) {
      const msg = `Error updating avatar`;
      setErr(msg);
      toast.error(msg);
    }
  };

  const validateUsername = (username) => {
    if (!/^[A-Za-z0-9_-]{3,30}$/.test(username)) {
      return "Username must be 3-30 characters: letters, numbers, underscore, hyphen only";
    }
    return null;
  };

  const validateDisplayName = (displayName) => {
    if (displayName.length < 3 || displayName.length > 30) {
      return "Username must be 3-30 characters";
    }
    return null;
  };

  const handleUpdate = async () => {
    setLoading(true);
    setErr(null);

    if (changedVariables.display_name !== null) {
      const displayNameError = validateDisplayName(changedVariables.display_name);
      if (displayNameError) {
        setErr(displayNameError);
        setLoading(false);
        return;
      }
    }

    if (changedVariables.username !== null) {
      const usernameError = validateUsername(changedVariables.username);
      if (usernameError) {
        setErr(usernameError);
        setLoading(false);
        return;
      }
    }

    const formData = new FormData;
    for (const key in changedVariables) {
      formData.append(key, changedVariables[key]);
    }

    const result = await updateProfile(formData);
    if(result?.success) {
      window.location.reload();
    } else {
      setErr(result?.error);
    }
    setLoading(false);
  };

  const handleDeleteAvatar = () => {
    deleteAvatar();
  };

  return (
    <div className="flex justify-center mt-24 mb-32">
      <div>
        <div className="flex items-center gap-8">
          <div className="w-96">
            <div className="flex flex-col mb-4">
              <div className=" flex flex-row justify-center mb-4">
                <img src={avatarUrl} className="size-64 rounded-xl object-cover" />
              </div>
              <div className="flex flex-row justify-center gap-4">
                <input id="avatar_input" type="file" accept="image/*" className="btn" onChange={handleAvatarChange} hidden />
                <button className="btn btn-primary" onClick={() => document.getElementById("avatar_input").click()}>Change Avatar</button>
                <button className="btn btn-ghost btn-link" onClick={handleDeleteAvatar} disabled={!profile?.avatar_url}>Remove Avatar</button>
              </div>
            </div>
          </div>

          <div>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Display Name</legend>
              <input
                type="text"
                className="input w-96 validator"
                defaultValue={profile?.display_name}
                placeholder="Display Name"
                minLength={3}
                maxLength={30}
                onChange={handleDisplayNameChange}
                required
              />
              <p className="validator-hint">Display name should be 3-30 characters</p>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Username</legend>
              <input
                type="text"
                className="input w-96 validator"
                defaultValue={profile?.username}
                placeholder="Username"
                minLength={3}
                maxLength={30}
                onChange={handleUsernameChange}
                required
              />
              <p className="validator-hint">Username should be 3-30 characters</p>
            </fieldset>

            <fieldset className="fieldset mb-8">
              <legend className="fieldset-legend">About me</legend>
              <textarea
                type="text"
                maxLength="300"
                className="textarea h-48 w-96"
                defaultValue={profile?.about}
                placeholder="Username"
                onChange={handleAboutChange}
              />
            </fieldset>
          </div>
        </div>

        {err && (
          <div className="text-error flex justify-center items-center my-4 gap-2"><CircleX />{err}</div>
        )}

        <div className="flex justify-center gap-4">
          <button className="btn btn-primary" onClick={handleUpdate} disabled={!hasChange || loading}>{loading && <span className="loading loading-spinner" />} Save Changes</button>
          <button className="btn btn-ghost link" onClick={() => window.location.reload()}>Reset</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;