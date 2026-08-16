import { Bell, Languages, LogIn, Menu, SquareLibrary, Upload } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import Avatar from "./Avatar";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

const LanguageSelector = () => {
  const currentLang = i18n.language;
  const LANGUAGES = [
    { code: "en", name: "English" },
    //{ code: "ru", name: "Русский" },
    { code: "zh", name: "简体中文" },
    { code: "tr", name: "Türkçe"}
  ]

  return (
    <div>
      <div className="dropdown dropdown-end me-2">
        <button tabIndex={0} role="button" className="btn btn-ghost btn-square">
          <Languages size={24} />
        </button>

        <div
          tabIndex={0}
          className="dropdown-content mt-2 p-1.5 shadow-2xl bg-base-200 backdrop-blur-lg rounded-lg w-32 border border-base-content/10"
        >
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              className={`
                w-full px-2 py-1.5 rounded-md flex items-center gap-3 transition-colors cursor-pointer
                ${currentLang === lang.code ? "bg-primary/10 text-primary" : "hover:bg-base-content/5"}
              `}
              onClick={() => {
                i18n.changeLanguage(lang.code);
                //window.location.reload();
              }}
            >
              {lang.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const NavBar = () => {
  const { t } = useTranslation();
  const { user, profile, logout } = useAuthStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [by, setBy] = useState("posts");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar shadow-2xl border-b border-base-content/10 fixed top-0 z-50 bg-base-300">

      <div className="navbar-start w-full">
        <div className="drawer min-w-fit max-w-fit">
          <input id="my-drawer-1" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label htmlFor="my-drawer-1" className="btn btn-ghost btn-square drawer-button lg:hidden"><Menu /></label>
          </div>
          <div className="drawer-side">
            <label htmlFor="my-drawer-1" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu bg-base-200 min-h-full w-80 p-4">
              <li><Link to="/posts">{t("gen.posts")}</Link></li>
              <li>
                <a>{t("gen.tools")}</a>
                <ul className="p-2">
                  <li><Link to="https://endingcredits.github.io/litematic-viewer/" target="_blank">{t("gen.litematic_viewer")}</Link></li>
                  <li><Link to="https://discord.gg/QgbuGgDhxf" target="_blank">{t("gen.tmc_resources_archive")}</Link></li>
                </ul>
              </li>
              <li><Link to="/extra">{t("gen.extra")}</Link></li>
              {user ?
                <div>
                  <li><Link to="/createpost">{t("gen.upload")}</Link></li>
                  <li>
                    <a>Account</a>
                    <ul className="p-2">
                      <li><Link to="/dashboard">{t("gen.dashboard")}</Link></li>
                      <li><Link to="/profilesettings">{t("gen.settings")}</Link></li>
                      <li><Link onClick={handleLogout}>{t("gen.log_out")}</Link></li>
                    </ul>
                  </li>
                </div> :
                <li><Link to="/login">{t("gen.log_in")}</Link></li>
              }
              <li><Link to={import.meta.env.VITE_DISCORD_INVITE_URL}>{t("gen.discord_server")}</Link></li>
            </ul>
          </div>
        </div>

        <Link to="/" className="flex items-center mx-3 gap-1.5">
          <SquareLibrary size={36} className="text-primary" strokeWidth={2.25} />
          <div className="flex font-bold text-2xl me-4 sm:me-8">
            <span className="bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">MCodex</span>
          </div>
        </Link>

        <div className="join hidden lg:inline-flex">
          <select className="select join-item" defaultValue={by} onChange={(e) => {setBy(e.target.value)}}>
            <option value="posts">{t("gen.posts")}</option>
            <option value="output">{t("gen.output")}</option>
            <option disabled>{t("gen.users")}</option>
          </select>
          <div>
            <div>
              <input
                type="text"
                placeholder={t("gen.search")}
                className="input input-bordered join-item w-24 sm:w-auto"
                onChange={(e) => setSearch(e.target.value.trim())}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.target.value = ""
                    e.target.blur();
                    if (search) {
                      window.location.replace(`/posts?search=${search}&by=${by}`);
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><Link to="/posts">{t("gen.posts")}</Link></li>
            <li>
              <details>
                <summary>{t("gen.tools")}</summary>
                <ul className="p-2 shadow-2xl w-50 z-1">
                  <li><Link to="https://endingcredits.github.io/litematic-viewer/" target="_blank">{t("gen.litematic_viewer")}</Link></li>
                  <li><Link to="https://discord.gg/QgbuGgDhxf" target="_blank">{t("gen.tmc_resources_archive")}</Link></li>
                </ul>
              </details>
            </li>
            <li><Link to="/extra">{t("gen.extra")}</Link></li>

          </ul>
        </div>
      </div>

      <div className="navbar-end me-2 w-2xs">
        <LanguageSelector />

        {user ?
          <div className="hidden lg:flex items-center">
            <Link to="/createpost" className="btn btn-primary btn-sm me-4"><Upload size={20} />{t("gen.upload")}</Link>

            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="cursor-pointer">
                <Avatar avatarUrl={profile?.avatar_url} />
              </div>
              <ul
                tabIndex={0}
                className="menu menu-md dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow-xl">
                <li><Link to="/dashboard">{t("gen.dashboard")}</Link></li>
                <li><Link to="/profilesettings">{t("gen.settings")}</Link></li>
                <li onClick={handleLogout} ><a>{t("gen.log_out")}</a></li>
              </ul>
            </div>

          </div> :
          <Link to="/login" className="items-center hidden lg:flex"><LogIn className="mx-2" size={20}/>{t("gen.log_in")}</Link>
        }
      </div>

    </nav>
  );

};

export default NavBar;