import { useTranslation } from "react-i18next";
import { useFetchExtraDownloads, useFetchExtraPost } from "../hooks/usePosts";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Download, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import Avatar from "../components/Avatar";

const ExtraCarousel = ({ image_urls = [], video_urls = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const carousel = document.querySelector(".carousel");
    if (!carousel) return;
  
    const onScroll = () => {
      const index = Math.round(carousel.scrollLeft / carousel.clientWidth);
      setActiveIndex(index);
    };
  
    carousel.addEventListener("scroll", onScroll);
    return () => carousel.removeEventListener("scroll", onScroll);
  }, []);

  const media = [
    ...(video_urls || []).map((url) => {
      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        const id = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
        return { type: "youtube", id };
      }
      if (url.includes("bilibili.com")) {
        const match = url.match(/BV\w+/);
        return match ? { type: "bilibili", id: match[0] } : null;
      }
      return null;
    }).filter(Boolean),
    ...(image_urls || []).map((src) => ({ type: "image", src}))
  ];

  if (media.length === 0) return;

  const goTo = (e, index) => {
    e.preventDefault();

    const carousel = document.querySelector(".carousel");

    const target = carousel.querySelector(`#item${index + 1}`);
    const left = target.offsetLeft;
    carousel.scrollTo({ left: left });
    setActiveIndex(index);
  };

  return (
    <div className="w-auto md:me-8">
      <div className="carousel w-full rounded-lg">
        {media?.map((item, index) => (
          <div id={`item${index + 1}`} key={index} className="carousel-item w-full aspect-video overflow-hidden bg-black">
              {item.type === "image" && (
                <img
                  src={item.src}
                  className="w-full h-full object-contain" />
              )}
              {item.type === "youtube" && (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${item.id}`}
                  title="Youtube Video Player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
              {item.type === "bilibili" && (
                <iframe
                  className="w-full h-full"
                  src={`https://player.bilibili.com/player.html?bvid=${item.id}&page=1&autoplay=0`}
                  allowFullScreen
                  sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts"
                  title="Bilibili Video Player"
                />
              )}
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2 py-2">
        {media?.map((_, index) => (
          <a
            key={index}
            href={`#item${index + 1}`}
            onClick={(e) => goTo(e, index)}
            className={`btn btn-xs ${activeIndex === index ? "btn-primary" : "btn-neutral"}`}
          >
            {index + 1}
          </a>
        ))}
      </div>
    </div>
  );
};

const ExtraTags = ({ tags }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-base-200 rounded-box shadow-md mb-4 md:w-3xs lg:w-xs 2xl:w-md">
      <div className="p-4 pb-2 text-xs opacity-60 tracking-wide">{t("gen.tags")}</div>
      <div className="p-4 pt-2">
        {tags?.map((t, index) => {
          return (
            <div
              key={index}
              className="badge badge-primary me-1 mb-2"
            >
              {t}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ExtraDesigners = ({ user, vendor, pfp }) => {
  const { t } = useTranslation();
  var link;

  if (vendor === "minemev") {
    link = "https://minemev.com/u/" + user;
  } else if (vendor === "redenmc") {
    link = "https://redenmc.com/@" + user;
  } else if (vendor === "choculaterie") {
    link = "https://choculaterie.com/users/" + user;
  }

  return (
    <div>
      <ul className="list bg-base-200 rounded-box shadow-md mb-4 md:w-3xs lg:w-xs 2xl:w-md">
  
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">{t("post.designers")}</li>

        <Link to={link} target="_blank">
          <li className="list-row">
            <Avatar avatarUrl={pfp} external={true} />
            <div>
              {user && (<div>{user}</div>)}
              <div className="text-xs font-semibold opacity-60">{vendor.toUpperCase()}</div>
            </div>
          </li>
        </Link>
        
      </ul>
    </div>
  );
};

const ExtraVersions = ({ versions }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-base-200 rounded-box shadow-md mb-4 md:w-3xs lg:w-xs 2xl:w-md">
      <div className="p-4 pb-2 text-xs opacity-60 tracking-wide">{t("gen.versions")}</div>
      <div className="p-4 pt-2">
        {versions.length === 0
          ? <div className="badge badge-sm badge-primary">{t("gen.unknown")}</div>
          : versions?.map((v, index) => (
            <div
              key={index}
              className="badge badge-sm badge-primary me-1 mb-2"
            >
              {v}
            </div>
        ))}
      </div>
    </div>
  );
};

export const ExtraDownloads = ({ vendor, postId }) => {
  const { t } = useTranslation();
  const { data: downloads, isFetching } = useFetchExtraDownloads(vendor, postId);

  return (
    <div>
      <ul className="list bg-base-200 rounded-box shadow-md mb-4 w-full">
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
          {t("post.downloads")}
          {isFetching && <span className="loading loading-spinner ms-2" />}
        </li>
        {downloads?.map((download, index) => (
          <li key={index} className="list-row items-center font-bold">
            <a href={download.file} className="btn btn-primary btn-square"><Download /></a>
            <div className="line-clamp-2">{download.default_file_name}</div>
          </li>
        ))}
        {!downloads && !isFetching && <li className="list-row items-center font-bold">{t("post.no_downloads")}</li>}
      </ul>
    </div>
  );
};

const ExtraPostPage = () => {
  const { t } = useTranslation();
  const { vendor, id: postId } = useParams();
  const { data: post, isPending, error } = useFetchExtraPost(vendor, postId);

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

  return (
    <div className="px-8 py-8">
      <div className="md:flex mb-8">

        <div className="w-full">
          <ExtraCarousel image_urls={post.images} video_urls={[post.yt_link]} />

          <div className="text-2xl font-semibold w-full">
            {post.post_name}
          </div>

          <div className="flex my-4 me-8 justify-end items-center">
            <div className="flex gap-3">
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
          </div>

          <div className="prose whitespace-pre-wrap max-w-none my-8 me-8">
            {post.description_md ? post.description_md : post.description}
          </div>
        </div>

        <div className="md:w-3xs lg:w-xs 2xl:w-md">
          <ExtraTags tags={post?.tags} />
          <ExtraDesigners vendor={vendor} user={post?.User} pfp={post?.userProfilePictureUrl} />
          <ExtraVersions versions={post?.versions} />
          <ExtraDownloads vendor={vendor} postId={postId} />
        </div>

      </div>
    </div>
  );
};

export default ExtraPostPage;