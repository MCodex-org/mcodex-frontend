import { SquarePen } from "lucide-react";
import { useFetchDashboard } from "../hooks/usePosts";
import { useAuthStore } from "../stores/authStore";
import { ProfileCard } from "./ProfileComponents";
import { Link } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

const BASE_URL = import.meta.env.VITE_SERVER_URL;
const CDN_URL = import.meta.env.VITE_CDN_URL;

const PostList = ({ posts, refetch }) => {
  const { t } = useTranslation();

  const deletePost = async (postId) => {
    await axios.delete(`${BASE_URL}/api/posts/${postId}`);
    refetch();
  };

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>{t("gen.posts")}</th>
            <th>{t("gen.translations")}</th>
            <th>{t("gen.status")}</th>
            <th>{t("gen.edit")}</th>
          </tr>
        </thead>
        <tbody>
          {posts?.map((post) => (
            <tr key={post.id}>
              <th>
                <Link to={`/posts/${post.id}`}>
                  <div className="flex items-center gap-3">
                    <img
                      src={`${CDN_URL}/${post.thumbnail}`}
                      alt="Avatar Tailwind CSS Component"
                      className="size-12 object-contain"
                      />
                    {post.title || post.id}
                  </div>
                </Link>
              </th>
              <td>
                {post?.available_translations.length > 0 ? post.available_translations.join(", ") : <div className="badge badge-error badge-soft">{t("gen.no_translations")}</div>}
              </td>
              <td>
                {post.approval_status === 1 ? <div className="badge badge-primary">{t("gen.approved")}</div> : <div className="badge badge-error">{t("gen.not_approved")}</div>}
              </td>
              <th>
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-ghost btn-square btn-sm"><SquarePen size={16} /></div>
                  <ul tabIndex="-1" className="menu dropdown-content bg-base-200 rounded-box z-1 w-52 p-2 shadow-xl">
                    <li><Link to={`/editpost/${post.id}`}>{t("dashboard.edit_post")}</Link></li>
                    {post.available_translations?.map(tr => (<li key={tr}><Link to={`/edittranslation/${tr}/${post.id}`}>{t("dashboard.edit_translation", { tr: tr })}</Link></li>))}
                    <li><Link to={`/addtranslation/${post.id}`}>{t("dashboard.add_new_translation")}</Link></li>
                    <li>
                      <p onClick={()=>document.getElementById(`delete_${post.id}`).showModal()}>{t("dashboard.delete_post")}</p>
                    </li>
                  </ul>
                </div>
                <dialog id={`delete_${post.id}`} className="modal">
                  <div className="modal-box">
                    <form method="dialog">
                      {/* if there is a button in form, it will close the modal */}
                      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">{t("dashboard.delete_post")}</h3>
                    <p className="py-4">{t("dashboard.delete_confirmation", { title: post.title || post.id })}</p>
                    <div className="flex justify-end">
                      <button className="btn btn-primary mt-4" onClick={() => deletePost(post.id)}>{t("dashboard.delete_post")}</button>
                    </div>
                  </div>
                </dialog>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Dashboard = () => {
  const lang = i18n.language;
  const { profile } = useAuthStore();
  const { data: posts, isPending, refetch } = useFetchDashboard(lang);

  return (
    <div>
      <ProfileCard profile={profile} postCount={posts?.[0]?.count} dashboard />
      <PostList posts={posts} refetch={refetch} />
    </div>
  );
};

export default Dashboard;