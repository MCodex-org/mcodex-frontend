import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

const AuthGuard = ({ children, requireProfile = true }) => {
  const { user, profile, authLoading, profileLoading } = useAuthStore();
  const location = useLocation(); //implement later

  if (authLoading || profileLoading) {
    return <div>Loading…</div>;
  } else if (!user) {
    return(
      <Navigate to="/login" replace />
    );
  } else if (!profile && requireProfile) {
    return(
      <Navigate to="/createprofile" replace />
    );
  }

  return (
    <div>{children}</div>
  );
};

export default AuthGuard;