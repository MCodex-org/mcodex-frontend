import { useNavigate, useSearchParams } from "react-router-dom";
import { useFetchExtraPosts } from "../hooks/usePosts";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Download, ListFilter } from "lucide-react";
import cover from "/Nether_Cover.png";
import Avatar from "../components/Avatar";
import { ExtraDownloads } from "./ExtraPostPage";
import toast from "react-hot-toast";

const ExtraDownloadsModal = ({ vendor, postId }) => {
  const { t } = useTranslation();
  const [opened, setOpened] = useState(false);

  const handleShowDownloads = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById(`downloads_modal_${postId}`).showModal();
    setOpened(true);
  };

  
  return (
    <div>
      <button
        className="btn btn-square btn-primary"
        onClick={handleShowDownloads}
      >
        <Download />
      </button>
      <dialog id={`downloads_modal_${postId}`} className="modal w-full cursor-default" onClick={(e) => e.stopPropagation()}>
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg mb-4">{t("post.downloads")}</h3>
          {opened && <ExtraDownloads vendor={vendor} postId={postId} />}
        </div>
      </dialog>
    </div>
  );
};

const ExtraPostCard = ({ post }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div
      className="card bg-base-300 min-w-72 shadow-md transition hover:shadow-2xl hover:scale-102 duration-300 cursor-pointer"
      onClick={() => navigate(`/extra/${post.vendor}/${post.uuid}`)}
    >
      <figure className="relative bg-base-200">
        <img className="h-48 object-cover" src={(post.images.length > 0 ? post.images[0] : post.thumbnail_url) || null} />
      </figure>
      <div className="card-body p-4">
        <div className="line-clamp-1">
          {post.tags?.map(tag => {
            return <div key={tag} className="badge badge-sm badge-primary mr-1">{tag}</div>
          })}
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row items-center h-10">
            <Avatar avatarUrl={post.user_picture} external />
            <h1 className="card-title line-clamp-2 ml-2">{post.post_name}</h1>
          </div>
        </div>
        <div className="card-actions justify-between items-center mt-2">
          <div>
            <p className="text-primary text-xs" style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "175px"
              }}>
              {t("post.posted_by")}: <strong>{post.User}</strong>
            </p>
            <div className="tooltip before:whitespace-pre-wrap" data-tip={post.output}>
              <p className="text-secondary text-sm font-bold">{post.vendor.toUpperCase()}</p>
            </div>
          </div>
          <div className="flex">
            <ExtraDownloadsModal vendor={post.vendor} postId={post.uuid} />
          </div>
        </div>
      </div>
    </div>
  );
};

const ExtraPostGrid = ({ posts, vendors }) => {

  return (
    <div className="px-4 py-8">
      <div className="
        grid gap-4
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        3xl:grid-cols-5
        4xl:grid-cols-6
        5xl:grid-cols-8
        ">
        {posts?.map(post => {
          if (vendors.includes(post.vendor)) {
            return (<ExtraPostCard key={post.uuid} post={post} />);
          }
        })}
      </div>
    </div>
  );
};

const ExtraPagination = ({ filterData, setFilterData, totalPageCount }) => {
  const { t } = useTranslation();

  return (
    <div className="join flex justify-center mb-32" hidden={!totalPageCount}>
      <button className="join-item btn" disabled={filterData.page < 2} onClick={() => setFilterData((prev) => ({ ...prev, page: filterData.page - 1 }))}>«</button>
      <button className="join-item btn">{t("gen.page")} {filterData.page} / {totalPageCount}</button>
      <button className="join-item btn" disabled={filterData.page >= totalPageCount} onClick={() => setFilterData((prev) => ({ ...prev, page: filterData.page + 1 }))}>»</button>
    </div>
  );
};

const ExtraFilters = ({ vendors, setVendors }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const setSources = (source, checked) => {

    setVendors(prev =>
      prev.includes(source)
        ? (checked ? prev : prev.filter(vendor => vendor !== source))
        : (checked ? [...prev, source] : prev)
    );
  };

  return (
    <div>
      <div
        className="flex justify-center items-center w-full bg-base-300 p-4 gap-2 text-2xl font-bold cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <ListFilter size={24} strokeWidth={2} />
        {expanded ? <div>{t("filter.close")}</div> : <div>{t("filter.expand")}</div>}
      </div>

      <div className="justify-center p-4 gap-4" hidden={!expanded}>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="text-2xl font-bold">{t("gen.sources")}:</div>
          <div className="flex items-center">
            <input
              type="checkbox" 
              className="checkbox mx-2 my-1" 
              checked={vendors.includes("minemev") || false}
              onChange={(e) => setSources("minemev", e.target.checked)}
            /> <div>Minemev</div>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox" 
              className="checkbox mx-2 my-1" 
              checked={vendors.includes("choculaterie") || false}
              onChange={(e) => setSources("choculaterie", e.target.checked)}
            /> <div>Choculaterie</div>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox" 
              className="checkbox mx-2 my-1" 
              checked={vendors.includes("redenmc") || false}
              onChange={(e) => setSources("redenmc", e.target.checked)}
            /> <div>RedenMC</div>
          </div>
        </div>
        {vendors.length === 0 && <div className="text-error">{t("gen.select_1_source")}</div>}
      </div>
    </div>
  );
};

const ExtraSearchBar = ({ filterData, setFilterData }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState(filterData.search);

  return (
    <div className="flex mx-4 gap-2">

      <input
        type="text"
        defaultValue={search}
        placeholder={t("gen.search")}
        className="input w-64 lg:w-80"
        onChange={(e) => setSearch(e.target.value.trim())}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            if (search) setFilterData((prev) => ({ ...prev, search: search, page: 1 }));
            else setFilterData((prev) => ({ ...prev, search: "", page: 1 }));
          }
        }}
      />

      <button
        className="btn btn-primary"
        onClick={() => {
          if (search) setFilterData((prev) => ({ ...prev, search: search, page: 1 }));
          else setFilterData((prev) => ({ ...prev, search: "", page: 1 }));
        }}
      >{t("gen.search")}</button>
    </div>
  );
};

const ExtraSort = ({ filterData, setFilterData }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center mx-4 my-2 gap-2 md:w-full md:justify-end md:my-0">
      {t("filter.sort_by")}:
      <select
        value={filterData.sort || "newest"}
        className="select w-fit"
        onChange={(e) => setFilterData((prev) => ({...prev, sort: e.target.value}))}
      >
        <option value="newest">{t("filter.latest")}</option>
        <option value="oldest">{t("filter.oldest")}</option>
        <option value="popular">{t("filter.popular")}</option>
        <option value="downloads">{t("filter.downloads")}</option>
      </select>
    </div>
  );
};

const ExtraPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vendors, setVendors] = useState(["minemev", "choculaterie", "redenmc"]);
  const [filterData, setFilterData] = useState({
    page: Number(searchParams.get("page")) || 1,
    pagesize: 40,
    sort: searchParams.get("sort") || "newest",
    search: searchParams.get("search") || ""
  });
  const { data, isPending, error } = useFetchExtraPosts(filterData);

  useEffect(() => {
    const params = {};

    if (filterData.page && filterData.page !== 1) params.page = filterData.page;
    if (filterData.search) params.search = filterData.search;
    if (filterData.sort && filterData.sort !== "newest") params.sort = filterData.sort;

    setSearchParams(params, { replace: true });
  }, [filterData, setSearchParams]);

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
    <div>
      <div className="h-24">
        <img src={cover} className="object-cover w-full h-full" />
      </div>
      <ExtraFilters vendors={vendors} setVendors={setVendors} />
      <div className="flex flex-col items-center md:flex-row md:justify-between mt-4">
        <ExtraSearchBar filterData={filterData} setFilterData={setFilterData} />
        <ExtraSort filterData={filterData} setFilterData={setFilterData} />
      </div>
      <ExtraPostGrid posts={data.posts} vendors={vendors} />
      <ExtraPagination filterData={filterData} setFilterData={setFilterData} totalPageCount={data.total_pages} />
    </div>
  );
};

export default ExtraPage;