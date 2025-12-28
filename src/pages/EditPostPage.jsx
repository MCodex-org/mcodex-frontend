import { useParams } from "react-router-dom";
import EditPost from "../components/EditPost";

const EditPostPage = () => {
  const { id: postId } = useParams();

  return (
    <div className="px-4 sm:px-16 lg:px-32 mt-8 mb-16">
      <EditPost postId={postId} />
    </div>
  );
};

export default EditPostPage;