import { useEffect, useState } from "react";
import { useCreatePost } from "../hooks/usePosts";
import { CategorySelector, TagSelector, VersionSelector, MentionInput, VideoInput } from "./CreatePostComponents";
import { FilePond } from "react-filepond";
import toast from "react-hot-toast";
import { CircleX } from "lucide-react";
import { useAuthStore } from "../stores/authStore";

const CreatePost = ({ setPostId }) => {
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
      toast.success("Post created successfully");
      setErr(null);
      setPostId(res.id);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      const errorMsg = error?.response?.data?.message || error?.message || "Failed to create post";
      setErr(errorMsg);
      toast.error(errorMsg);
    }
  }, [isError, error]);

  const validatePostData = () => {
    if (postData.schems.length === 0 && postData.wdl.length === 0) {
      throw new Error("Atleast 1 schematic or world download required");
    }

    if (postData.images.length === 0) {
      throw new Error("At least one image is required");
    }

    if (!postData.subs || postData.subs.length === 0) {
      throw new Error("Please select at least one category");
    }

    if (!postData.tags || postData.tags.length === 0) {
      throw new Error("Please add at least one tag");
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
      const errorMsg = submitErr?.message || "An unexpected error occurred";
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
        <legend className="fieldset-legend">Designer/Uploader</legend>
        <input
          type="text"
          className="input validator w-auto"
          value={profile?.username ?? ""}
          maxLength="32"
          disabled
        />
        <p className="label">Only upload your own designs</p>

        <legend className="fieldset-legend">Other designers</legend>
        <MentionInput postData={postData} setPostData={setPostData} />
        <p className="label">Separate values using comma. Use @ tag to mention users with an MCodex account.</p>

        <legend className="fieldset-legend">Categories/Subcategories</legend>
        <CategorySelector postData={postData} setPostData={setPostData} />

        <legend className="fieldset-legend">Tags</legend>
        <TagSelector postData={postData} setPostData={setPostData} required showSelected />

        <legend className="fieldset-legend">Versions</legend>
        <VersionSelector postData={postData} setPostData={setPostData} />

        <legend className="fieldset-legend">Total Rate(per Hour)</legend>
        <input
          type="number"
          className="input validator w-auto"
          value={postData.total_rate || ""}
          onChange={(e) => handleDataChange("total_rate", e.target.value)}
        />
        <label className="label">Leave empty if not applicable</label>

        <legend className="fieldset-legend mt-4">Images</legend>
        <FilePond
          name="images"
          allowMultiple={true}
          allowReorder={true}
          maxFiles={10}
          onupdatefiles={(fileItems) => handleFileUpdate("images", fileItems)}
          credits={false}
        />
        <label className="label">Upto 10 Images allowed. Max size 10 MB per Image. 1st Image will be used a thumbnail.</label>

        <legend className="fieldset-legend mt-4">Schematics</legend>
        <FilePond
          name="schems"
          allowMultiple={true}
          allowReorder={true}
          maxFiles={5}
          onupdatefiles={(fileItems) => handleFileUpdate("schems", fileItems)}
          credits={false}
        />
        <label className="label">Upto 5 schematic files allowed. Max size 100 KB per file.</label>

        <legend className="fieldset-legend mt-4">World Download</legend>
        <FilePond
          name="wdl"
          onupdatefiles={(fileItems) => handleFileUpdate("wdl", fileItems)}
          credits={false}
        />
        <label className="label">Only 1 file allowed. Upload as ZIP. Max size 30 MB.</label>

        <legend className="fieldset-legend mt-4">Videos</legend>
        <VideoInput postData={postData} setPostData={setPostData} />
        <label className="label">
          <input
            type="checkbox"
            className="checkbox"
            onChange={(e) => handleDataChange("has_tutorial", e.target.checked)}
          />
          Select if any of the video(s) linked above is a tutorial
        </label>
        <legend className="label">Upto 5 videos allowed</legend>

        <label className="label mt-6">
          <input
            type="checkbox"
            className="checkbox"
            onChange={(e) => handleDataChange("allow_changes", e.target.checked)}
            defaultChecked={true}
          />
          Allow other users to suggest changes for this post
        </label>

        <label className="label">
          <input
            type="checkbox"
            className="checkbox"
            onChange={(e) => handleDataChange("allow_translations", e.target.checked)}
            defaultChecked={true}
          />
          Allow other users to suggest translations for this post
        </label>

        <label className="label">
          <input
            type="checkbox"
            className="checkbox"
            onChange={(e) => handleDataChange("allow_addons", e.target.checked)}
            defaultChecked={true}
          />
          Allow other users to link addons(storage system, kill chamber, etc) for this build
        </label>

        {err && (
          <div className="text-error flex justify-center items-center mt-4 gap-2"><CircleX />{err}</div>
        )}

        <div className="flex justify-center mt-4">
          <button onClick={handleSubmit} disabled={isPending} className="btn btn-primary w-max">
            {(isPending && <span className="loading loading-spinner" />) || <>Submit & Next</>}
          </button>
        </div>

      </fieldset>
    </div>
  );
};

export default CreatePost;