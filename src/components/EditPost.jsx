import { useEffect, useState } from "react";
import { useFetchPost, useUpdatePost } from "../hooks/usePosts";
import { CategorySelector, MentionInput, TagSelector, VersionSelector, VideoInput } from "./CreatePostComponents";
import { useNavigate } from "react-router-dom";
import { CircleX } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const EditPost = ({ postId }) => {
  const { t } = useTranslation();
  const { data: post, isPending: isFetching, error } = useFetchPost(postId);
  const { mutate, isPending, isSuccess, isError, error: updateError } = useUpdatePost();
  const [postData, setPostData] = useState({});
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const designers = post?.designers
      .filter(d => d.user_id !== post.owner_id)
      .map(d => d.username ? "@" + d.username : d.name)
      .join(", ");
    const tags = post?.tags.map(t => t.id);
    const subs = post?.sub_categories.map(s => s.id);
    const versions = post?.versions.map(v => v.id);

    if (post) {
      setPostData({
        filled: true,
        designers: designers || "",
        subs: subs || [],
        tags: tags || [],
        versions: versions || [],
        total_rate: post?.total_rate || "",
        video_urls: post?.video_urls || [],
        allow_changes: post?.allow_changes || false,
        allow_translations: post?.allow_translations || false,
        allow_addons: post?.allow_addons || false
      });
    }
  }, [post]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(t("edit_post.success_message"));
      setErr(null);
      navigate(`/posts/${postId}`);
    }
  }, [isSuccess, navigate, postId]);

  useEffect(() => {
    if (isError) {
      const errorMsg = updateError?.response?.data?.message || updateError?.message || t("edit_post.error_message");
      setErr(errorMsg);
      toast.error(errorMsg);
    }
  }, [isError, updateError]);

  if (isFetching) {
    return (
      <div className="flex h-screen justify-center items-center">
        <span className="loading loading-spinner loading-xl" />
      </div>
    );
  }
  if (error) {
    toast.error(error.message);
    return null;
  }

  if (!post) {
    return null;
  }

  const validatePostData = () => {
    /*if (postData.images.length === 0) {
      throw new Error("At least one image is required");
    }*/

    if (!postData.subs || postData.subs.length === 0) {
      throw new Error(t("create_post.category_required"));
    }

    if (!postData.tags || postData.tags.length === 0) {
      throw new Error(t("create_post.tag_required"));
    }
    
    return;
  };

  const handleDataChange = (key, value) => {
    try {
      setPostData((prev) => ({
        ...prev,
        [key]: value
      }));
      setErr(null);
    } catch (dataErr) {
      const msg = `Error updating form: ${dataErr.message}`;
      setErr(msg);
      toast.error(msg);
    }
  };

  const handleSubmit = () => {
    try {
      //setLoading(true);
      setErr(null);
      console.log(postData);

      validatePostData();

      const finalData = new FormData();
      for (const key in postData) {
        if (["video_urls", "subs", "tags", "versions"].includes(key)) {
          //if (postData[key].length === 0) continue;
          postData[key].forEach((file)=> {
            finalData.append(key, file)
          });
        } else {
          finalData.append(key, postData[key]);
        }
      }
      finalData.append("post_id", postId);

      console.log("FINAL:", finalData);
      mutate(finalData);
    } catch (submitErr) {
      const errorMsg = submitErr?.message || t("create_post.unexpected_error");
      setErr(errorMsg);
      toast.error(errorMsg);
    }
  };
  
  return (
    <div>
      {postData.filled &&
        <fieldset className="fieldset">
          <legend className="fieldset-legend">{t("gen.designer")}/{t("gen.uploader")}</legend>
          <input
            type="text"
            className="input validator w-auto"
            value={post?.owner?.username ?? ""}
            maxLength="32"
            disabled
          />

          <legend className="fieldset-legend">{t("create_post.other_designers")}</legend>
          <MentionInput postData={postData} setPostData={setPostData} />
          <p className="label">{t("create_post.other_designers_info")}</p>

          <legend className="fieldset-legend">{t("gen.categories")}/{t("gen.subcategories")}</legend>
          <CategorySelector postData={postData} setPostData={setPostData} />

          <legend className="fieldset-legend">{t("gen.tags")}</legend>
          <TagSelector postData={postData} setPostData={setPostData} required showSelected />

          <legend className="fieldset-legend">{t("gen.versions")}</legend>
          <VersionSelector postData={postData} setPostData={setPostData} />

          <legend className="fieldset-legend">{t("create_post.total_rate")}</legend>
          <input
            type="number"
            className="input validator w-auto"
            value={postData.total_rate || ""}
            onChange={(e) => handleDataChange("total_rate", e.target.value)}
          />
          <label className="label">{t("create_post.leave_empty")}</label>

          <legend className="fieldset-legend mt-4">{t("gen.videos")}</legend>
          <VideoInput postData={postData} setPostData={setPostData} />
          <label className="label">
            <input
              type="checkbox"
              className="checkbox"
              onChange={(e) => handleDataChange("has_tutorial", e.target.checked)}
            />
            {t("create_post.is_tutorial")}
          </label>
          <legend className="label">{t("create_post.video_info")}</legend>

          <label className="label mt-6">
            <input
              type="checkbox"
              className="checkbox"
              onChange={(e) => handleDataChange("allow_changes", e.target.checked)}
              checked={postData?.allow_changes}
            />
            {t("create_post.allow_changes")}
          </label>

          <label className="label">
            <input
              type="checkbox"
              className="checkbox"
              onChange={(e) => handleDataChange("allow_translations", e.target.checked)}
              checked={postData?.allow_translations}
            />
            {t("create_post.allow_translations")}
          </label>

          <label className="label">
            <input
              type="checkbox"
              className="checkbox"
              onChange={(e) => handleDataChange("allow_addons", e.target.checked)}
              checked={postData?.allow_addons}
            />
            {t("create_post.allow_addons")}
          </label>

          {err && (
            <div className="text-error flex justify-center items-center mt-4 gap-2"><CircleX />{err}</div>
          )}

          <div className="flex justify-center mt-4">
            <button onClick={handleSubmit} disabled={isPending} className="btn btn-primary w-max">
              {(isPending && <span className="loading loading-spinner" />) || <>{t("create_post.submit")}</>}
            </button>
          </div>
        </fieldset>
      }
    </div>
  );
};

export default EditPost;