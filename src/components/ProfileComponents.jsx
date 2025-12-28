import { Check, Pencil, SquarePen } from "lucide-react";
import { Link } from "react-router-dom";


const CDN_URL = import.meta.env.VITE_CDN_URL;

export const ProfileCard = ({ profile, postCount, dashboard = false }) => {

  return (
    <div className="card bg-base-300 p-8 shadow-2xl rounded-none">
      <figure className="gap-4 justify-start items-start">
        <img
          className="size-32 rounded"
          src={`${CDN_URL}/${profile.avatar_url || "Portrait_Placeholder.png"}`}
        />
        <div>
          <div className="flex items-center gap-1">
            <h1 className="text-2xl font-bold wrap-anywhere">{profile.display_name}</h1>
            {profile.verified && <Check color="dodgerblue" size={24} strokeWidth={2} />}
            {dashboard && <Link to="/profilesettings" className="mx-2" title="Edit profile"><SquarePen stroke="grey" size={20} /></Link>}
          </div>
          <p className="flex gap-2 items-baseline mb-4">@{profile.username} <span className="label text-sm">{postCount || 0} posts</span></p>
          <div className="">
            <p className="label text-sm text-wrap whitespace-pre-wrap line-clamp-1">{profile.about}</p>
            <button className="link link-hover text-sm" onClick={()=>document.getElementById("profile_modal").showModal()}>more</button>
            <dialog id="profile_modal" className="modal">
              <div className="modal-box">
                <form method="dialog">
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg">About me</h3>
                <p className="whitespace-pre-wrap py-4">{profile.about}</p>
              </div>
            </dialog>
          </div>
        </div>
      </figure>
    </div>
  );
};