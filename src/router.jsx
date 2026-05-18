import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import RegisterPage from "./pages/RegisterPage.jsx";
import CreateProfilePage from "./pages/CreateProfilePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import CreatePostPage from "./pages/CreatePostPage.jsx";
import PostsPage from "./pages/PostsPage.jsx";
import PostPage from "./pages/PostPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import EditPostTranslationPage from "./pages/EditPostTranslationPage.jsx";
import ProfileSettingsPage from "./pages/ProfileSettingsPage.jsx";
import AuthGuard from "./components/AuthGuard.jsx";
import OAuthCallbackPage from "./pages/OAuthCallbackPage.jsx";
import EditPostPage from "./pages/EditPostPage.jsx";
import AddTranslationPage from "./pages/AddTranslationPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/posts" replace /> },
      { path: "posts", element: <PostsPage /> },
      { path: "posts/:id", element: <PostPage /> },
      { path: "dashboard", element: <AuthGuard><DashboardPage /></AuthGuard> },
      { path: "createpost", element: <AuthGuard><CreatePostPage /></AuthGuard> },
      { path: "addtranslation/:id", element: <AuthGuard><AddTranslationPage /></AuthGuard> },
      { path: "editpost/:id", element: <AuthGuard><EditPostPage /></AuthGuard> },
      { path: "edittranslation/:lang/:id", element: <AuthGuard><EditPostTranslationPage /></AuthGuard> },
      { path: "u/:username", element: <ProfilePage /> },
      { path: "profilesettings", element: <AuthGuard><ProfileSettingsPage /></AuthGuard> }
    ]
  },
  { path: "/register", element: <RegisterPage /> },
  { path: "/createprofile", element: <AuthGuard requireProfile={false}><CreateProfilePage /></AuthGuard> },
  { path: "/login", element: <LoginPage /> },
  { path: "/auth/callback/google", element: <OAuthCallbackPage /> },
  { path: "/auth/callback/github", element: <OAuthCallbackPage /> }
]);

export default router;