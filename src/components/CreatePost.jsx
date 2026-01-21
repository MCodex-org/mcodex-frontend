import { useEffect, useState } from "react";
import { useCreatePost } from "../hooks/usePosts";
import { CategorySelector, TagSelector, VersionSelector, MentionInput, VideoInput } from "./CreatePostComponents";
import { FilePond } from "react-filepond";
import toast from "react-hot-toast";
import { CircleX } from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { useTranslation } from "react-i18next";

const CreatePost = ({ setPostId }) => {
  const { t } = useTranslation();
  const { profile } = useAuthStore();
  const [postData, setPostData] = useState({
    designers: "",
    subs: [],
    tags: [],
    versions: [],
    images: [],
    schems: [],
    wdl: []
  });
  //const [loading, setLoading] = useState(false);
  //const [res, setRes] = useState(null);
  const [err, setErr] = useState(null);

  const { mutate, isPending, isSuccess, data: res, isError, error } = useCreatePost();

  useEffect(() => {
    if (isSuccess) {
      toast.success(t("create_post.success_message"));
      setErr(null);
      setPostId(res.id);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      const errorMsg = error?.response?.data?.message || error?.message || t("create_post.error_message");
      setErr(errorMsg);
      toast.error(errorMsg);
    }
  }, [isError, error]);

  const validatePostData = () => {
    if (postData.schems.length === 0 && postData.wdl.length === 0) {
      throw new Error(t("create_post.schem_wdl_required"));
    }

    if (postData.images.length === 0) {
      throw new Error(t("create_post.image_required"));
    }

    if (!postData.subs || postData.subs.length === 0) {
      throw new Error(t("create_post.category_required"));
    }

    if (!postData.tags || postData.tags.length === 0) {
      throw new Error(t("create_post.tag_required"));
    }
    
    return;
  };

  const handleSubmit = () => {
    try {
      //setLoading(true);
      setErr(null);
      console.log(postData);

      validatePostData();

      const finalData = new FormData();
      for (const key in postData) {
        if (["images", "schems", "wdl", "video_urls", "subs", "tags", "versions"].includes(key)) {
          //if (postData[key].length === 0) continue;
          postData[key].forEach((file)=> {
            finalData.append(key, file)
          });
        } else {
          finalData.append(key, postData[key]);
        }
      }

      mutate(finalData);
    } catch (submitErr) {
      const errorMsg = submitErr?.message || t("create_post.unexpected_error");
      setErr(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleFileUpdate = (key, fileItems) => {
    try {
      setPostData((prev) => ({
        ...prev,
        [key]: fileItems.map((f) => {
          if (!f.file) {
            throw new Error("Invalid file object for", key);
          }
          return f.file;
        })
      }));
      setErr(null);
    } catch (fileErr) {
      const msg = `Error updating ${key}: ${fileErr.message}`;
      setErr(msg);
      toast.error(msg);
    }
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
  

  return (
    <div>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">{t("gen.designer")}/{t("gen.uploader")}</legend>
        <input
          type="text"
          className="input validator w-auto"
          value={profile?.username ?? ""}
          maxLength="32"
          disabled
        />
        <p className="label">{t("create_post.only_own_designs")}</p>

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

        <legend className="fieldset-legend mt-4">{t("gen.images")}</legend>
        <FilePond
          name="images"
          allowMultiple={true}
          allowReorder={true}
          maxFiles={10}
          onupdatefiles={(fileItems) => handleFileUpdate("images", fileItems)}
          credits={false}
          labelIdle={t("create_post.file_input_placeholder")}
        />
        <label className="label">{t("create_post.image_info")}</label>

        <legend className="fieldset-legend mt-4">{t("gen.schematics")}</legend>
        <FilePond
          name="schems"
          allowMultiple={true}
          allowReorder={true}
          maxFiles={5}
          onupdatefiles={(fileItems) => handleFileUpdate("schems", fileItems)}
          credits={false}
          labelIdle={t("create_post.file_input_placeholder")}
        />
        <label className="label">{t("create_post.schem_info")}</label>

        <legend className="fieldset-legend mt-4">{t("gen.world_download")}</legend>
        <FilePond
          name="wdl"
          onupdatefiles={(fileItems) => handleFileUpdate("wdl", fileItems)}
          credits={false}
          labelIdle={t("create_post.file_input_placeholder")}
        />
        <label className="label">{t("create_post.wdl_info")}</label>

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
            defaultChecked={true}
          />
          {t("create_post.allow_changes")}
        </label>

        <label className="label">
          <input
            type="checkbox"
            className="checkbox"
            onChange={(e) => handleDataChange("allow_translations", e.target.checked)}
            defaultChecked={true}
          />
          {t("create_post.allow_translations")}
        </label>

        <label className="label">
          <input
            type="checkbox"
            className="checkbox"
            onChange={(e) => handleDataChange("allow_addons", e.target.checked)}
            defaultChecked={true}
          />
          {t("create_post.allow_addons")}
        </label>

        {err && (
          <div className="text-error flex justify-center items-center mt-4 gap-2"><CircleX />{err}</div>
        )}

        <div className="flex justify-center mt-4">
          <button onClick={handleSubmit} disabled={isPending} className="btn btn-primary w-max">
            {(isPending && <span className="loading loading-spinner" />) || <>{t("create_post.submit_next")}</>}
          </button>
        </div>

      </fieldset>
    </div>
  );
};

export default CreatePost;