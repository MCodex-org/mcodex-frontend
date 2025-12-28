import { useNavigate } from "react-router-dom";
import { useFetchPost, useUpdatePostTranslation } from "../hooks/usePosts";
import toast from "react-hot-toast";
import { RichTextEditor } from "./CreatePostComponents";
import { useState, useEffect } from "react";
import { CircleX } from "lucide-react";

const EditPostTranslation = ({ postId, lang }) => {
  
  const { data: post, isPending: isFetching, error } = useFetchPost(postId);
  const { mutate, isPending, isSuccess, isError, error: updateError } = useUpdatePostTranslation();
  const [translationData, setTranslationData] = useState({ 
    lang: lang || "",
    title: "",
    credits: "",
    output: "",
    description_html: "",
    description_json: {}
  });
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (post?.translations) {
      const translation = post.translations.find(t => t.lang === lang) || post.translations[0];
      if (translation) {
        setTranslationData({
          lang: translation.lang || lang,
          title: translation.title || "",
          credits: translation.credits || "",
          output: translation.output || "",
          description_html: translation.description_html || "",
          description_json: translation.description_json || {}
        });
      }
    }
  }, [post, lang]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Translation updated successfully");
      setErr(null);
      navigate(`/posts/${postId}`);
    }
  }, [isSuccess, navigate, postId]);

  useEffect(() => {
    if (isError) {
      const errorMsg = updateError?.response?.data?.message || updateError?.message || "Failed to update translation";
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
      throw new Error("Please select language");
    }
    
    if (!translationData.title || !translationData.title.trim()) {
      throw new Error("Please enter title");
    }
    
    if (!translationData.description_html || !translationData.description_json) {
      throw new Error("Please enter description");
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
      const errorMsg = submitErr?.message || "An unexpected error occurred";
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
            <option disabled value="">Select your language</option>
            <option value="en">English</option>
            <option value="ru" hidden>Russian</option>
          </select>
          <p className="validator-hint">Required</p>
        </div>
      </div>
      
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Post ID</legend>
        <input
          type="text"
          className="input validator w-auto"
          value={postId ?? ""}
          disabled
        />

        <legend className="fieldset-legend">Post Title</legend>
        <input
          type="text"
          className="input validator w-auto"
          placeholder="Title"
          maxLength={64}
          value={translationData.title || ""}
          onChange={(e) => handleDataChange("title", e.target.value)}
          required
        />
        <p className="label">Required</p>

        <legend className="fieldset-legend">Credits</legend>
        <textarea
          type="text"
          className="textarea validator w-auto"
          placeholder="Credits"
          maxLength={512}
          value={translationData.credits || ""}
          onChange={(e) => handleDataChange("credits", e.target.value)}
        />

        <legend className="fieldset-legend">Individual Output Rates</legend>
        <textarea
          type="text"
          className="textarea validator w-auto"
          placeholder="Individual Output Rates"
          maxLength={512}
          value={translationData.output || ""}
          onChange={(e) => handleDataChange("output", e.target.value)}
        />

        <legend className="fieldset-legend">Description</legend>
        <RichTextEditor
          value={translationData?.description_json || ""}
          onChange={setTranslationData}
        />
        <p className="label">Required</p>

        {err && (
          <div className="text-error flex justify-center items-center mt-4 gap-2"><CircleX />{err}</div>
        )}

        <div className="flex justify-center mt-4">
          <button onClick={handleSubmit} disabled={isPending} className="btn btn-primary w-max">
            {(isPending && <span className="loading loading-spinner" />) || <>Submit</>}
          </button>
        </div>

      </fieldset>
    </div>
  );
};

export default EditPostTranslation;