import { useState } from "react";
import { RichTextEditor } from "./CreatePostComponents";
import toast from "react-hot-toast";
import { useCreatePostTranslation } from "../hooks/usePosts";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CircleX } from "lucide-react";
import { useTranslation } from "react-i18next";

const CreatePostTranslation = ({ postId }) => {
  const { t } = useTranslation();
  const [translationData, setTranslationData] = useState({ description_html: "", description_json: {} });
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const { mutate, isPending, isSuccess, isError, error } = useCreatePostTranslation();

  useEffect(() => {
    if (isSuccess) {
      toast.success(t("create_post.translation_success"));
      setErr(null);
      navigate("/");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      const errorMsg = error?.response?.data?.message || error?.message || t("create_post.translation_failed");
      setErr(errorMsg);
      toast.error(errorMsg);
    }
  }, [isError, error]);

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
      
      console.log(translationData);
      mutate({postId, translationData});
    } catch (submitErr) {
      const errorMsg = submitErr?.message || t("create_post.unexpected_error");
      setErr(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div>
      <div className="flex justify-center mb-8">
        <div className="justify-center">
          <select
            defaultValue={""}
            className="select validator w-fit"
            onChange={(e) => handleDataChange("lang", e.target.value)}
            required
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
          onChange={(e) => handleDataChange("credits", e.target.value)}
        />

        <legend className="fieldset-legend">{t("create_post.individual_output_rates")}</legend>
        <textarea
          type="text"
          className="textarea validator w-auto"
          placeholder={t("create_post.individual_output_rates")}
          maxLength={512}
          onChange={(e) => handleDataChange("output", e.target.value)}
        />

        <legend className="fieldset-legend">{t("gen.description")}</legend>
        <RichTextEditor
          value={translationData?.description_json?.type ? translationData.description_json : ""}
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

export default CreatePostTranslation;