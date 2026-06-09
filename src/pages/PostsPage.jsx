import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Filters, Pagination, PostGrid, SearchBar, Sort } from "../components/PostComponents";
import cover from "/1099438.png";
import { useFetchPosts } from "../hooks/usePosts";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

const PostsPage = () => {
  const { t } = useTranslation();
  const lang = i18n.language;
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterData, setFilterData] = useState({
    search: searchParams.get("search") || "",
    by: searchParams.get("by") || "",
    recommended: searchParams.get("recommended") || false,
    schems: searchParams.get("schems") || false,
    wdl: searchParams.get("wdl") || false,
    page: Number(searchParams.get("page")) || 1,
    category: searchParams.get("category") || "",
    subcategory: searchParams.get("subcategory") || "",
    tags: {
      with: searchParams.get("with")?.split(",") || [],
      without: searchParams.get("without")?.split(",") || []
    },
    version: searchParams.get("version") || "",
    sort: searchParams.get("sort") || "latest",
    otherLang: !(localStorage.getItem("onlySelectedLang") === "true")
  });
  const { data: posts, isPending } = useFetchPosts(filterData, lang);
  
  useEffect(() => {
    const params = {};

    if (filterData.page && filterData.page !== 1) params.page = filterData.page;
    if (filterData.search) params.search = filterData.search;
    if (filterData.by) params.by = filterData.by;
    if (filterData.recommended) params.recommended = filterData.recommended;
    if (filterData.schems) params.schems = filterData.schems;
    if (filterData.wdl) params.wdl = filterData.wdl;
    if (filterData.category) params.category = filterData.category;
    if (filterData.subcategory) params.subcategory = filterData.subcategory;
    if (filterData.tags.with.length > 0) params.with = filterData.tags.with.join(",");
    if (filterData.tags.without.length > 0) params.without = filterData.tags.without.join(",");
    if (filterData.version) params.version = filterData.version;
    if (filterData.sort && filterData.sort !== "latest") params.sort = filterData.sort;

    setSearchParams(params, { replace: true });
  }, [filterData, setSearchParams]);

  return (
    <div>
      <div className="h-24">
        <img src={cover} className="object-cover w-full h-full" />
      </div>
      <Filters realFilterData={filterData} setRealFilterData={setFilterData} />
      <div className="flex flex-col items-center md:flex-row md:justify-between">
        <SearchBar filterData={filterData} setFilterData={setFilterData} />
        <Sort filterData={filterData} setFilterData={setFilterData} />
      </div>
      {posts?.length === 0 && <div className="p-4 text-2xl">{t("post.no_posts")}</div>}
      <PostGrid posts={posts} isPending={isPending} />
      <Pagination filterData={filterData} setFilterData={setFilterData} totalPageCount={Math.ceil(posts?.[0]?.count / 50)} />
    </div>
  );
};

export default PostsPage;