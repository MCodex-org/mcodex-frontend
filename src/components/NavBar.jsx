import { Bell, Languages, LogIn, Menu, SquareLibrary, Upload } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import Avatar from "./Avatar";
import { useState } from "react";

const NavBar = () => {
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
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <Menu />
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow-2xl">
            <li><Link to="/posts">Posts</Link></li>


            {user ?
              <div>
                <li><Link to="/createpost">Upload</Link></li>
                <li>
                  <a>Account</a>
                  <ul className="p-2">
                    <li><Link to="/dashboard">Dashboard</Link></li>
                    <li><Link to="/profilesettings">Settings</Link></li>
                    <li><Link onClick={handleLogout}>Logout</Link></li>
                  </ul>
                </li>
              </div> :
              <li><Link to="/login">Log in</Link></li>
            }
          </ul>
        </div>
        <Link to="/" className="flex items-center mx-3 gap-1.5">
          <SquareLibrary size={36} className="text-primary" strokeWidth={2.25} />
          <div className="flex font-bold text-2xl me-4 sm:me-8">
            <span className="bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">MCodex</span>
            <span className="text-sm text-base-content ml-1">BETA</span>
          </div>
        </Link>

        <div className="join">
          <select className="select join-item" defaultValue={by} onChange={(e) => {setBy(e.target.value)}}>
            <option value="posts">Posts</option>
            <option value="output">Output</option>
            <option disabled>Users</option>
          </select>
          <div>
            <div>
              <input
                type="text"
                placeholder="Search"
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
            <li><Link to="/posts">Posts</Link></li>



          </ul>
        </div>
      </div>

      <div className="navbar-end me-2">
        <div className="dropdown dropdown-end me-2" hidden>
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <Languages size={24} />
          </div>
          <ul tabIndex={0} className="menu menu-md dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow-xl">
            <li></li>



          </ul>
        </div>
        {user ? 
          <div className="hidden lg:flex items-center">
            <Link to="/createpost" className="btn btn-primary btn-sm me-4"><Upload size={20} /> Upload</Link>

            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="cursor-pointer">
                <Avatar avatarUrl={profile?.avatar_url} />
              </div>
              <ul
                tabIndex={0}
                className="menu menu-md dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow-xl">
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/profilesettings">Settings</Link></li>
                <li onClick={handleLogout} ><a>Log out</a></li>
              </ul>
            </div>

          </div> :
          <Link to="/login" className="items-center hidden lg:flex"><LogIn className="mx-2" size={20}/>Log in</Link>
        }
      </div>

    </nav>
  );

};

export default NavBar;