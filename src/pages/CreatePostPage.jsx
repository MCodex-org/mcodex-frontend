import { useState } from "react";
import CreatePost from "../components/CreatePost";
import CreatePostTranslation from "../components/CreatePostTranslation";

const CreatePostPage = () => {
  //const [success, setSuccess] = useState(false);
  const [postId, setPostId] = useState();

  return (
    <div className="px-4 sm:px-16 lg:px-32 mt-16 mb-16">
      <div className="flex justify-center mb-12">
        <ul className="steps">
          <li className="step mx-8 step-primary">Language Independent Info</li>
          <li className={`step ${postId && "step-primary"}`}>Language Dependent Info</li>
        </ul>
      </div>
      {!postId && <CreatePost setPostId={setPostId} />}
      {postId && <CreatePostTranslation postId={postId} />}
    </div>
  );
};

export default CreatePostPage;