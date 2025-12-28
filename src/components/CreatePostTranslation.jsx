import { useState } from "react";
import { RichTextEditor } from "./CreatePostComponents";
import toast from "react-hot-toast";
import { useCreatePostTranslation } from "../hooks/usePosts";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CircleX } from "lucide-react";

const CreatePostTranslation = ({ postId }) => {
  const [translationData, setTranslationData] = useState({ description_html: "", description_json: {} });
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const { mutate, isPending, isSuccess, isError, error } = useCreatePostTranslation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Post completed successfully");
      setErr(null);
      navigate("/");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      const errorMsg = error?.response?.data?.message || error?.message || "Failed to complete post";
      setErr(errorMsg);
      toast.error(errorMsg);
    }
  }, [isError, error]);

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
      
      console.log(translationData);
      mutate({postId, translationData});
    } catch (submitErr) {
      const errorMsg = submitErr?.message || "An unexpected error occurred";
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
          onChange={(e) => handleDataChange("credits", e.target.value)}
        />

        <legend className="fieldset-legend">Individual Output Rates</legend>
        <textarea
          type="text"
          className="textarea validator w-auto"
          placeholder="Individual Output Rates"
          maxLength={512}
          onChange={(e) => handleDataChange("output", e.target.value)}
        />

        <legend className="fieldset-legend">Description</legend>
        <RichTextEditor
          value={translationData?.description_json?.type ? translationData.description_json : ""}
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

export default CreatePostTranslation;