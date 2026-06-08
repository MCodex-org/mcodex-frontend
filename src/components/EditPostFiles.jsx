import { useEffect, useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import { useTranslation } from "react-i18next";
import { useFetchPostFiles, useUpdatePostFiles } from "../hooks/usePosts";
import { useNavigate } from "react-router-dom";
import { CircleX } from "lucide-react";
import toast from "react-hot-toast";

registerPlugin(FilePondPluginImagePreview);

const EditPostFiles = ({ postId }) => {
  const { t } = useTranslation();
  const { data: postFiles, isPending: isFetching, error } = useFetchPostFiles(postId);
  const { mutate, isPending, isSuccess, isError, error: updateError } = useUpdatePostFiles();
  const [postData, setPostData] = useState({});
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (postFiles) {
      setPostData({
        existing_images: postFiles?.image_urls || [],
        existing_schems: postFiles?.schem_urls || [],
        existing_wdl: postFiles?.wdl_urls || [],

        images: [],
        schems: [],
        wdl: [],

        imagePondFiles: postFiles?.image_urls?.map(file => ({
          source: file,
          options: {
            type: "local",
            metadata: {
              existing: true,
              fileName: file
            }
          }
        })) || [],
        schemPondFiles: postFiles?.schem_urls?.map(file => ({
          source: file,
          options: {
            type: "local",
            file: {
              name: file.split("-").slice(1).join("-"),
              size: 0
            },
            metadata: {
              existing: true,
              fileName: file
            }
          }
        })) || [],
        wdlPondFiles: postFiles?.wdl_urls?.map(file => ({
          source: file,
          options: {
            type: "local",
            file: {
              name: file.split("-").slice(1).join("-"),
              size: 0
            },
            metadata: {
              existing: true,
              fileName: file
            }
          }
        })) || [],

        deleted_images: [],
        deleted_schems: [],
        deleted_wdl: []
      });
    }
  }, [postFiles])

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

  if (!postFiles) {
    return null;
  }

  const validatePostData = () => {
    if (postData.existing_images.length === 0 && postData.images.length === 0) {
      throw new Error("At least one image is required");
    }

    if (
      postData.existing_schems.length === 0
      && postData.schems.length === 0
      && postData.existing_wdl.length === 0
      && postData.wdl.length === 0
    ) {
      throw new Error("At least one schematic or world download is required");
    }
    
    return;
  };

  const handleSubmit = () => {
    try {
      //setLoading(true);
      setErr(null);
      console.log(postData);

      validatePostData();

      const fieldsToSend = [
        "existing_images",
        "existing_schems",
        "existing_wdl",
      
        "deleted_images",
        "deleted_schems",
        "deleted_wdl",
      
        "images",
        "schems",
        "wdl"
      ];
      
      const finalData = new FormData();
      for (const key of fieldsToSend) {
        postData[key].forEach((item) => {
          finalData.append(key, item);
        });
      }
      finalData.append("post_id", postId);

      console.log("FINAL:", finalData);
      mutate(finalData);
    } catch (submitErr) {
      const errorMsg = submitErr?.message || t("create_post.unexpected_error");
      setErr(errorMsg);
      console.log(submitErr);
      toast.error(errorMsg);
    }
  };



  return (
    <div>
      <fieldset className="fieldset">

        <legend className="fieldset-legend mt-4">
          {t("gen.images")}
        </legend>

        <FilePond
          className="image-pond"
          imagePreviewHeight={200}
          files={postData.imagePondFiles}
          allowMultiple
          allowReorder
          maxFiles={10}
          credits={false}
          labelIdle={t("create_post.file_input_placeholder")}
          server={{
            load: (source, load, error) => {
              fetch(`${import.meta.env.VITE_CDN_URL}/${source}`)
                .then(res => res.blob())
                .then(load)
                .catch(() => error("Load failed"));
            }
          }}
          onupdatefiles={(items) => {
            const existingFiles = items
              .filter(item => item.getMetadata("existing"))
              .map(item => item.getMetadata("fileName"));

            const deletedFiles = (postFiles.image_urls || []).filter(
              file => !existingFiles.includes(file)
            );
            
            setPostData(prev => ({
              ...prev,

              existing_images: existingFiles,
              deleted_images: deletedFiles,

              images: items
                .filter(item => item.file instanceof File)
                .map(item => item.file),
              
              imagePondFiles: items
            }));
          }}
        />

        <legend className="fieldset-legend mt-4">
          {t("gen.schematics")}
        </legend>

        <FilePond
          files={postData.schemPondFiles}
          allowMultiple
          allowReorder
          maxFiles={5}
          credits={false}
          labelIdle={t("create_post.file_input_placeholder")}
          onupdatefiles={(items) => {
            const existingFiles = items
              .filter(item => item.getMetadata("existing"))
              .map(item => item.getMetadata("fileName"));

            const deletedFiles = (postFiles.schem_urls || []).filter(
              file => !existingFiles.includes(file)
            );
            
            setPostData(prev => ({
              ...prev,

              existing_schems: existingFiles,
              deleted_schems: deletedFiles,

              schems: items
                .filter(item => item.file instanceof File)
                .map(item => item.file),
              
              schemPondFiles: items
            }));
          }}
        />

        <legend className="fieldset-legend mt-4">
          {t("gen.world_download")}
        </legend>

        <FilePond
          files={postData.wdlPondFiles}
          credits={false}
          labelIdle={t("create_post.file_input_placeholder")}
          onupdatefiles={(items) => {
            const existingFiles = items
              .filter(item => item.getMetadata("existing"))
              .map(item => item.getMetadata("fileName"));

            const deletedFiles = (postFiles.wdl_urls || []).filter(
              file => !existingFiles.includes(file)
            );
            
            setPostData(prev => ({
              ...prev,

              existing_wdl: existingFiles,
              deleted_wdl: deletedFiles,

              wdl: items
                .filter(item => item.file instanceof File)
                .map(item => item.file),
              
              wdlPondFiles: items
            }));
          }}
        />



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

export default EditPostFiles;