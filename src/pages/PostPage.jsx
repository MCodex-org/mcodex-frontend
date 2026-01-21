import { useParams } from "react-router-dom";
import { useFetchPost, useVote } from "../hooks/usePosts";
import { MessageCircle, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import { Carousel, Categories, Credits, Designers, Output, Schems, Tags, Versions, Wdl, Vote } from "../components/PostComponents";
import { useAuthStore } from "../stores/authStore";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

const PostPage = () => {
  const { t } = useTranslation();
  const lang = i18n.language;
  const { id: postId } = useParams();
  const { data: post, isPending, error } = useFetchPost(postId, lang);
  const { user, profile } = useAuthStore();
  const { mutate: mutateVote, error: voteError } = useVote(postId);

  const vote = (v) => {
    if (!user) {
      toast.error(t("auth.vote_login"));
      return;
    } else if (!profile) {
      toast.error(t("auth.vote_profile"));
      return;
    }
    mutateVote(v);
  }

  if (isPending) {
    return (
      <div className="flex h-screen justify-center items-center">
        <span className="loading loading-spinner loading-xl" />
      </div>
    );
  }
  if (error) {
    toast.error(error.message);
    return;
  }

  if (voteError) {
    toast.error(t("auth.error_vote"));
  }

  return (
    <div className="px-8 py-8">
      <div className="md:flex mb-8">
        <div className="w-full">
          <Carousel image_urls={post?.image_urls} video_urls={post?.video_urls} />
          <div className="text-2xl font-semibold w-full">
            {post?.translation?.title}
            {post?.recommended && <div className="badge badge-info mx-2">{t("gen.recommended")}</div>}
          </div>
          <div className="flex gap-3 my-4">
            <Vote initialCount={post?.cached_vote_count} initialVote={post?.vote} onVote={vote} />
            <button className="flex p-2 rounded-full bg-base-300 shadow-2xl gap-2 cursor-pointer"><MessageCircle />{/*post?.cached_comment_count*/}{t("post.disabled")}</button>
            <button
              className="flex p-2 rounded-full bg-base-300 shadow-2xl gap-2 cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success(t("post.link_copied"));
              }}
            >
              <Share2 />{t("post.share")}
            </button>
          </div>
          <div
            className="prose max-w-none my-8 me-8"
            dangerouslySetInnerHTML={{
              __html: post?.translation?.description_html || ""
            }}
          />
        </div>
        <div>
          {post?.approval_status !== 1 && <div className="bg-warning font-bold p-4 mb-4">
            {t("post.not_approved_yet")}
          </div>}
          {post?.translation?.output && <Output output={post?.translation?.output} />}
          <Tags tags={post?.tags} />
          <Designers ownerId={post?.owner.id} designers={post?.designers} />
          {post?.translation?.credits && <Credits credits={post?.translation?.credits} />}
          <Categories categories={post?.categories} subcategories={post?.sub_categories} />
          {post?.versions.length > 0 && <Versions versions={post?.versions} />}
          {post?.schem_urls && <Schems schems={post?.schem_urls} />}
          {post?.wdl_urls && <Wdl wdl={post?.wdl_urls[0]} />}
        </div>
      </div>
    </div>
  );
};

export default PostPage;