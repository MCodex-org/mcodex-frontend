import { useState } from "react";
import CreatePost from "../components/CreatePost";
import CreatePostTranslation from "../components/CreatePostTranslation";
import { useTranslation } from "react-i18next";

const CreatePostPage = () => {
  const { t } = useTranslation();
  //const [success, setSuccess] = useState(false);
  const [postId, setPostId] = useState();

  return (
    <div className="px-4 sm:px-16 lg:px-32 mt-16 mb-16">
      <div className="flex justify-center mb-12">
        <ul className="steps">
          <li className="step mx-8 step-primary">{t("create_post.lang_indep_info")}</li>
          <li className={`step ${postId && "step-primary"}`}>{t("create_post.lang_dep_info")}</li>
        </ul>
      </div>
      {!postId && <CreatePost setPostId={setPostId} />}
      {postId && <CreatePostTranslation postId={postId} />}
    </div>
  );
};

export default CreatePostPage;