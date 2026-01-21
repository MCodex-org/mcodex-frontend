import { useNavigate } from "react-router-dom";
import { useFetchPost, useUpdatePostTranslation } from "../hooks/usePosts";
import toast from "react-hot-toast";
import { RichTextEditor } from "./CreatePostComponents";
import { useState, useEffect } from "react";
import { CircleX } from "lucide-react";
import { useTranslation } from "react-i18next";

const EditPostTranslation = ({ postId, lang }) => {
  const { t } = useTranslation();
  const { data: post, isPending: isFetching, error } = useFetchPost(postId, lang);
  const { mutate, isPending, isSuccess, isError, error: updateError } = useUpdatePostTranslation();
  const [translationData, setTranslationData] = useState({ 
    lang: lang || "",
    title: "",
    credits: "",
    output: "",
    description_html: "",
    description_json: ""
  });
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (post?.translation) {
      const translation = post.translation;
      if (translation) {
        setTranslationData({
          lang: translation.lang || lang,
          title: translation.title || "",
          credits: translation.credits || "",
          output: translation.output || "",
          description_html: translation.description_html || "",
          description_json: translation.description_json || ""
        });
      }
    }
  }, [post, lang]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(t("edit_post.translation_success"));
      setErr(null);
      navigate(`/posts/${postId}`);
    }
  }, [isSuccess, navigate, postId]);

  useEffect(() => {
    if (isError) {
      const errorMsg = updateError?.response?.data?.message || updateError?.message || t("edit_post.translation_failed");
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

  const validateTranslationData = () => {
    if (!translationData.lang) {
      throw new Error(t("create_post.language_required"));
    }
    
    if (!translationData.title || !translationData.title.trim()) {
      throw new Error(t("create_post.title_required"));
    }
    
    if (!translationData.description_html || !translationData.description_json) {
      throw new Error(t("create_post.desc_required"));
    }
    
    return;
  };

  const handleDataChange = (key, value) => {
    try {
      setTranslationData((prev) => ({
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
      setErr(null);

      validateTranslationData();
      
      mutate({ postId, lang, translationData });
    } catch (submitErr) {
      const errorMsg = submitErr?.message || t("create_post.unexpected_error");
      setErr(errorMsg);
      toast.error(errorMsg);
    }
  };


  return (
    <div>
      <div className="flex justify-center mt-12 mb-8">
        <div className="justify-center">
          <select
            value={lang}
            className="select w-fit"
            disabled
          >
            <option disabled value="">{t("create_post.select_language")}</option>
            <option value="en">English</option>
            <option value="ru" hidden>Русский</option>
            <option value="zh">简体中文</option>
            <option value="es" hidden>Español</option>
          </select>
          <p className="validator-hint">{t("gen.required")}</p>
        </div>
      </div>
      
      <fieldset className="fieldset">
        <legend className="fieldset-legend">{t("gen.post_id")}</legend>
        <input
          type="text"
          className="input validator w-auto"
          value={postId ?? ""}
          disabled
        />

        <legend className="fieldset-legend">{t("gen.post_title")}</legend>
        <input
          type="text"
          className="input validator w-auto"
          placeholder={t("gen.post_title")}
          maxLength={64}
          value={translationData.title || ""}
          onChange={(e) => handleDataChange("title", e.target.value)}
          required
        />
        <p className="label">{t("gen.required")}</p>

        <legend className="fieldset-legend">{t("gen.credits")}</legend>
        <textarea
          type="text"
          className="textarea validator w-auto"
          placeholder={t("gen.credits")}
          maxLength={512}
          value={translationData.credits || ""}
          onChange={(e) => handleDataChange("credits", e.target.value)}
        />

        <legend className="fieldset-legend">{t("create_post.individual_output_rates")}</legend>
        <textarea
          type="text"
          className="textarea validator w-auto"
          placeholder={t("create_post.individual_output_rates")}
          maxLength={512}
          value={translationData.output || ""}
          onChange={(e) => handleDataChange("output", e.target.value)}
        />

        <legend className="fieldset-legend">{t("gen.description")}</legend>
        <RichTextEditor
          value={translationData?.description_json || ""}
          onChange={setTranslationData}
        />
        <p className="label">{t("gen.required")}</p>

        {err && (
          <div className="text-error flex justify-center items-center mt-4 gap-2"><CircleX />{err}</div>
        )}

        <div className="flex justify-center mt-4">
          <button onClick={handleSubmit} disabled={isPending} className="btn btn-primary w-max">
            {(isPending && <span className="loading loading-spinner" />) || <>{t("create_post.submit")}</>}
          </button>
        </div>

      </fieldset>
    </div>
  );
};

export default EditPostTranslation;