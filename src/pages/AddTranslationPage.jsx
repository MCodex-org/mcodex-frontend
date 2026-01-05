import { useParams } from "react-router-dom";
import CreatePostTranslation from "../components/CreatePostTranslation";

const AddTranslationPage = () => {
  const { id: postId } = useParams();

  return (
    <div className="px-4 sm:px-16 lg:px-32 mt-16 mb-16">
      <CreatePostTranslation postId={postId} />
    </div>
  );
};

export default AddTranslationPage;