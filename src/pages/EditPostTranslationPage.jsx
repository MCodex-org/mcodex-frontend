import { useParams } from "react-router-dom";
import EditPostTranslation from "../components/EditPostTranslation";

const EditPostTranslationPage = () => {
  const { lang, id: postId } = useParams();

  return (
    <div className="px-4 sm:px-16 lg:px-32 mb-16">
      <EditPostTranslation postId={postId} lang={lang} />
    </div>
  );
};

export default EditPostTranslationPage;