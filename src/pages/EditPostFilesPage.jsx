import { useParams } from "react-router-dom";
import EditPostFiles from "../components/EditPostFiles";

const EditPostFilesPage = () => {
  const { id: postId } = useParams();

  return (
    <div className="px-4 sm:px-16 lg:px-32 mt-8 mb-16">
      <EditPostFiles postId={postId} />
    </div>
  );
};

export default EditPostFilesPage;