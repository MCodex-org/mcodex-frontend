import { useState } from "react";
import { ArrowBigUp, ArrowBigDown, Bookmark, Download, ListFilter, Check, Plus, Minus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useMetaStore } from "../stores/metaStore";
import Avatar from "./Avatar";
import { useFetchDownloads } from "../hooks/usePosts";

const CDN_URL = import.meta.env.VITE_CDN_URL;

export const Carousel = ({ image_urls = [], video_urls = [] }) => {
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

  const goTo = (e) => {
    e.preventDefault();
    const btn = e.currentTarget;

    const carousel = document.querySelector(".carousel");

    const href = btn.getAttribute("href");
    const target = carousel.querySelector(href);
    const left = target.offsetLeft;
    carousel.scrollTo({ left: left });
  };

  return (
    <div className="w-auto md:me-8">
      <div className="carousel w-full rounded-lg">
        {media?.map((item, index) => (
          <div id={`item${index + 1}`} key={index} className="carousel-item w-full aspect-video overflow-hidden bg-black">
              {item.type === "image" && (
                <img
                  src={CDN_URL + "/" + item.src}
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
          <a onClick={goTo} key={index} href={`#item${index + 1}`} className="btn btn-xs">{index + 1}</a>
        ))}
      </div>
    </div>
  );
};

export const PostCard = ({ post }) => {
  const navigate = useNavigate();

  return (
    <div
      className='card bg-base-300 min-w-72 shadow-md transition hover:shadow-2xl hover:scale-102 duration-300 cursor-pointer'
      onClick={() => navigate(`/posts/${post.id}`)}
    >
      <figure className='relative bg-base-200'>
        <img className='h-48 object-cover' src={CDN_URL + "/" + post.thumbnail} />
        <div className="absolute top-2 right-2 mx-1">
          <div className="flex items-center">
            <ArrowBigUp className="mx-1" size={16} color="orange" fill="orange" />
            <span className="text-md">{post.cached_vote_count}</span>
          </div>
        </div>
        <div className="absolute bottom-2 left-2 mx-1 flex items-center">
        {post.recommended && <div className="badge badge-info badge-xs">RECOMMENDED</div>}
        </div>
      </figure>
      <div className='card-body'>
        <div className="line-clamp-1">
          {post.tags?.map(tag => {
            return <div key={tag.id} className="badge badge-sm badge-primary mr-1">{tag.name}</div>
          })}
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row items-center h-10">
            <div className="avatar mr-2">
              <div className="size-10 rounded">
                <img src={CDN_URL + "/" + (post.owner.avatar_url ? post.owner.avatar_url : "Portrait_Placeholder.png")} />
              </div>
            </div>
            <h1 className='card-title line-clamp-2'>{post.title}</h1>
          </div>
        </div>
        <div className='card-actions justify-between items-center'>
          <div>
            <p className="text-primary text-xs" style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "175px"
              }}>
              Posted by: <strong>{post.owner.display_name}</strong>
            </p>
            <div className="tooltip before:whitespace-pre-wrap" data-tip={post.output}>
              <p className="text-secondary text-sm">{post.total_rate ? (post.total_rate + "/hr") : "Not applicable"}</p>
            </div>
          </div>
          <div className="flex">
            <DownloadsModal postId={post.id} />
            <label className="swap" hidden>
              <input type="checkbox" />
              <div className="swap-on"><Bookmark fill="white" /></div>
              <div className="swap-off"><Bookmark /></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PostGrid = ({ posts, isPending }) => {

  if (isPending) {
    return (<div>Loading...</div>);
  }

  return (
    <div className="px-4 py-8">
      <div className="
        grid gap-4
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        ">
        {posts?.map(post => {
          return <PostCard key={post.id} post={post} />
        })}
      </div>
    </div>
  );
};

export const Pagination = ({ filterData, setFilterData, totalPageCount }) => {
  return (
<div className="join flex justify-center mb-32" hidden={!totalPageCount}>
  <button className="join-item btn" disabled={filterData.page < 2} onClick={() => setFilterData((prev) => ({ ...prev, page: filterData.page - 1 }))}>«</button>
  <button className="join-item btn">Page {filterData.page} / {totalPageCount}</button>
  <button className="join-item btn" disabled={filterData.page >= totalPageCount} onClick={() => setFilterData((prev) => ({ ...prev, page: filterData.page + 1 }))}>»</button>
</div>
  );
};

export const Filters = ({ realFilterData, setRealFilterData }) => {
  const [expanded, setExpanded] = useState(false);
  const [filterData, setFilterData] = useState(realFilterData);
  const { categories, tags, versions } = useMetaStore();
  const [matchedTags, setMatchedTags] = useState(tags);

  const handleSearch = async (e) => {
    const term = e.target.value.toLowerCase().trim();

    if (term === "") {
      setMatchedTags(tags);
      return;
    }

    let matches = [];
    tags.map((tc) => {
      let filteredTags = tc.tags.filter((t) =>
        t.name.toLowerCase().includes(term)
      );
      if (filteredTags.length > 0) {
        matches.push({
          ...tc,
          tags: filteredTags
        });
      }
    });
    setMatchedTags(matches);
  };

  const handleAddTag = (tagId) => {
    setFilterData((prev) => {
      // If tag is already in 'with', remove it (toggle off)
      if (prev.tags.with.includes(tagId)) {
        return {
          ...prev,
          tags: {
            ...prev.tags,
            with: prev.tags.with.filter(id => id !== tagId)
          }
        };
      }
      // Remove from 'without' if present and add to 'with'
      const without = prev.tags.without.filter(id => id !== tagId);
      return {
        ...prev,
        tags: {
          ...prev.tags,
          with: [...prev.tags.with, tagId],
          without
        }
      };
    });
  };

  const handleRemoveTag = (tagId) => {
    setFilterData((prev) => {
      // If tag is already in 'without', remove it (toggle off)
      if (prev.tags.without.includes(tagId)) {
        return {
          ...prev,
          tags: {
            ...prev.tags,
            without: prev.tags.without.filter(id => id !== tagId)
          }
        };
      }
      // Remove from 'with' if present and add to 'without'
      const withTags = prev.tags.with.filter(id => id !== tagId);
      return {
        ...prev,
        tags: {
          ...prev.tags,
          with: withTags,
          without: [...prev.tags.without, tagId]
        }
      };
    });
  };

  const handleApplyFilters = () => {
    setRealFilterData((prev) => ({
      ...prev,
      recommended: filterData.recommended,
      schems: filterData.schems,
      wdl: filterData.wdl,
      category: filterData.category,
      subcategory: filterData.subcategory,
      tags: filterData.tags,
      version: filterData.version,
      page: 1
    }));
  };

  const handleResetFilters = () => {
    setFilterData(prev => ({ ...prev, recommended: false, schems: false, wdl: false, category: "", subcategory: "", tags: { with: [], without: [] }, version: "" }));
    setRealFilterData(prev => ({ ...prev, recommended: false, schems: false, wdl: false, category: "", subcategory: "", tags: { with: [], without: [] }, version: "" }));
  };

  return (
    <div>
      <div
        className="flex justify-center items-center w-full bg-base-300 p-4 gap-2 text-2xl font-bold cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <ListFilter size={24} strokeWidth={2} />
        {expanded ? <div>Close filters</div> : <div>Expand filters</div>}
      </div>

      <div className="justify-center p-4 gap-4" hidden={!expanded}>
        <div className="flex flex-row justify-center">
          <div className="w-96">
            <input
              type="checkbox" 
              className="checkbox mx-2 my-1" 
              checked={filterData.recommended || false}
              onChange={(e) => setFilterData((prev) => ({ ...prev, recommended: e.target.checked }))}
            /> Show only recommended <br />
            <input
              type="checkbox"
              className="checkbox mx-2 my-1"
              disabled
            /> Show posts in other languages <br />
            <input
              type="checkbox"
              className="checkbox mx-2 my-1"
              disabled
            /> Show only posts with tutorials <br />
            <input
              type="checkbox"
              className="checkbox mx-2 my-1"
              checked={filterData.schems || false}
              onChange={(e) => setFilterData((prev) => ({ ...prev, schems: e.target.checked }))}
            /> Show only posts with schematics <br />
            <input
              type="checkbox"
              className="checkbox mx-2 my-1"
              checked={filterData.wdl || false}
              onChange={(e) => setFilterData((prev) => ({ ...prev, wdl: e.target.checked }))}
            /> Show only posts with world download <br />
          </div>

          <div className="w-96">
            <select
              value={filterData.category}
              className="select mb-2"
              onChange={(e) => setFilterData((prev) => ({ ...prev, category: Number(e.target.value), subcategory: "" }))}
            >
              <option value="" disabled={true}>Filter by category</option>
              {categories?.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
            </select>

            <select
              value={filterData.subcategory}
              className="select mb-2"
              onChange={(e) => setFilterData((prev) => ({ ...prev, subcategory: e.target.value }))}
              disabled={!filterData.category}
            >
              <option value="" disabled={true}>Filter by sub-category</option>
              {categories
                ?.find((cat) => cat.id === Number(filterData.category))
                ?.subcategories?.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
            </select>

            <div className="dropdown mb-2 w-full">
              <div tabIndex={0} role="button" className="select cursor-default">Filter by tags</div>
              <ul tabIndex="-1" className="dropdown-content menu bg-base-100 border border-base-300 rounded-box z-1 p-2 w-80 shadow-2xl">
                <input type="text" className="input input-sm mb-2" placeholder="search" onChange={handleSearch} />
                <div className="overflow-y-auto max-h-96">
                  {matchedTags?.map((tc) =>
                    tc.tags?.map((t) => (
                      <li key={t.id}><a>
                        <div className="flex justify-end">
                          <button 
                            className={`btn btn-xs btn-square btn-primary btn-outline ${filterData.tags.with.includes(t.id) ? 'btn-active' : ''}`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleAddTag(t.id);
                            }}
                          >
                            <Plus />
                          </button>
                          <button 
                            className={`btn btn-xs btn-square btn-error btn-outline mx-1 ${filterData.tags.without.includes(t.id) ? 'btn-active' : ''}`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleRemoveTag(t.id);
                            }}
                          >
                            <Minus />
                          </button>
                        </div>
                        {t.name}
                      </a></li>
                    ))
                  )}
                </div>
              </ul>
            </div>

            <select
              value={filterData.version}
              className="select"
              onChange={(e) => setFilterData((prev) => ({ ...prev, version: e.target.value }))}
            >
              <option value="" disabled={true}>Filter by game version</option>
              {versions?.map((vc) => 
                vc.versions?.map((v) => (<option key={v.id} value={v.id}>{v.name}</option>))
              )}
            </select>
          </div>
        </div>
        
        <div className="flex flex-row justify-center mt-8 gap-4">
          <button className="btn btn-primary" onClick={handleApplyFilters}>Apply filters</button>
          <button className="btn btn-ghost link" onClick={handleResetFilters}>Reset filters</button>
        </div>
      </div>

      <CurrentFilters filterData={filterData} setFilterData={setFilterData} realFilterData={realFilterData} setRealFilterData={setRealFilterData} />
    </div>
  );
};

export const CurrentFilters = ({ filterData, setFilterData, realFilterData, setRealFilterData }) => {
  const { categories, tags, versions } = useMetaStore();

  const handleAddTag = (tagId) => {
    setFilterData((prev) => {
      // If tag is already in 'with', remove it (toggle off)
      if (prev.tags.with.includes(tagId)) {
        return {
          ...prev,
          tags: {
            ...prev.tags,
            with: prev.tags.with.filter(id => id !== tagId)
          }
        };
      }
      // Remove from 'without' if present and add to 'with'
      const without = prev.tags.without.filter(id => id !== tagId);
      return {
        ...prev,
        tags: {
          ...prev.tags,
          with: [...prev.tags.with, tagId],
          without
        }
      };
    });

    setRealFilterData((prev) => ({
      ...prev,
      tags: { ...prev.tags, with: prev.tags.with.filter(id => id !== tagId) }
    }));
  };

  const handleRemoveTag = (tagId) => {
    setFilterData((prev) => {
      // If tag is already in 'without', remove it (toggle off)
      if (prev.tags.without.includes(tagId)) {
        return {
          ...prev,
          tags: {
            ...prev.tags,
            without: prev.tags.without.filter(id => id !== tagId)
          }
        };
      }
      // Remove from 'with' if present and add to 'without'
      const withTags = prev.tags.with.filter(id => id !== tagId);
      return {
        ...prev,
        tags: {
          ...prev.tags,
          with: withTags,
          without: [...prev.tags.without, tagId]
        }
      };
    });

    setRealFilterData((prev) => ({
      ...prev,
      tags: { ...prev.tags, without: prev.tags.without.filter(id => id !== tagId) }
    }));
  };

  const handleResetFilters = () => {
    setFilterData(prev => ({ ...prev, recommended: false, schems: false, wdl: false, category: "", subcategory: "", tags: { with: [], without: [] }, version: "" }));
    setRealFilterData(prev => ({ ...prev, recommended: false, schems: false, wdl: false, category: "", subcategory: "", tags: { with: [], without: [] }, version: "" }));
  };

  return (
    <div className="flex flex-wrap gap-2 px-4 pb-4 my-2 items-center">
      <div className="font-bold mx-2">Current filters:</div>
      {(!realFilterData.recommended
          && !realFilterData.schems
          && !realFilterData.wdl
          && !realFilterData.category
          && !realFilterData.subcategory
          && realFilterData.tags.with.length === 0
          && realFilterData.tags.without.length === 0
          && !realFilterData.version) && (
        <div className="opacity-60">None</div>
      )}

      {realFilterData.recommended && (
        <div className="badge badge-info">
          Recommended
          <button
            className="btn btn-ghost btn-xs"
            onClick={() => {
              setFilterData(prev => ({ ...prev, recommended: false }));
              setRealFilterData(prev => ({ ...prev, recommended: false }));
            }}
          >
            ✕
          </button>
        </div>
      )}

      {realFilterData.schems && (
        <div className="badge badge-info badge-outline">
          Schematics
          <button
            className="btn btn-ghost btn-xs"
            onClick={() => {
              setFilterData(prev => ({ ...prev, schems: false }));
              setRealFilterData(prev => ({ ...prev, schems: false }));
            }}
          >
            ✕
          </button>
        </div>
      )}

      {realFilterData.wdl && (
        <div className="badge badge-info badge-outline">
          World Download
          <button
            className="btn btn-ghost btn-xs"
            onClick={() => {
              setFilterData(prev => ({ ...prev, wdl: false }));
              setRealFilterData(prev => ({ ...prev, wdl: false }));
            }}
          >
            ✕
          </button>
        </div>
      )}

      {realFilterData.category && (
        <div className="badge badge-primary gap-2">
          {categories?.find(c => c.id === Number(realFilterData.category))?.name || "Category"}
          <button
            className="btn btn-ghost btn-xs"
            onClick={() => {
              setFilterData(prev => ({ ...prev, category: "", subcategory: "" }));
              setRealFilterData(prev => ({ ...prev, category: "", subcategory: "" }));
            }}
          >
            ✕
          </button>
        </div>
      )}

      {realFilterData.subcategory && (
        <div className="badge badge-secondary gap-2">
          {categories
            ?.flatMap(c => c.subcategories || [])
            .find(s => s.id === Number(realFilterData.subcategory))
            ?.name || "Subcategory"}
          <button
            className="btn btn-ghost btn-xs"
            onClick={() => {
              setFilterData(prev => ({ ...prev, subcategory: "" }));
              setRealFilterData(prev => ({ ...prev, subcategory: "" }));
            }}
          >
            ✕
          </button>
        </div>
      )}

      {realFilterData.tags.with.map(tagId => {
        const tag = (tags || []).flatMap(tc => tc.tags || []).find(t => t.id === Number(tagId));
        return (
          <div key={`with-${tagId}`} className="badge badge-outline badge-primary gap-2">
            {tag?.name || tagId}
            <button
              className="btn btn-ghost btn-xs"
              onClick={() => handleAddTag(tagId)}
            >
              ✕
            </button>
          </div>
        );
      })}

      {realFilterData.tags.without.map(tagId => {
        const tag = (tags || []).flatMap(tc => tc.tags || []).find(t => t.id === Number(tagId));
        return (
          <div key={`without-${tagId}`} className="badge badge-outline badge-error gap-2">
            !{tag?.name || tagId}
            <button
              className="btn btn-ghost btn-xs"
              onClick={() => handleRemoveTag(tagId)}
            >
              ✕
            </button>
          </div>
        );
      })}

      {realFilterData.version && (
        <div className="badge badge-warning gap-2">
          {versions?.flatMap(mv => mv.versions).find(v => v.id === Number(realFilterData.version)).name}
          <button
            className="btn btn-ghost btn-xs"
            onClick={() => {
              setFilterData(prev => ({ ...prev, version: "" }));
              setRealFilterData(prev => ({ ...prev, version: "" }));
            }}
          >
            ✕
          </button>
        </div>
      )}

      {(realFilterData.category || realFilterData.subcategory || realFilterData.tags.with.length > 0 || realFilterData.tags.without.length > 0) && (
        <button
          className="btn btn-xs btn-ghost"
          onClick={handleResetFilters}
        >
          Clear all
        </button>
      )}
    </div>
  );
};

export const SearchBar = ({ filterData, setFilterData }) => {
  const [search, setSearch] = useState(filterData.search);
  const [by, setBy] = useState(filterData.by);

  return (
    <div className="flex mx-4 gap-2">
      <div className="w-24">
        <select defaultValue={by} className="select" onChange={(e) => {setBy(e.target.value)}}>
          <option value="posts">Title</option>
          <option value="output">Output</option>
        </select>
      </div>

      <input
        type="text"
        defaultValue={search}
        placeholder="Search"
        className="input w-64"
        onChange={(e) => setSearch(e.target.value.trim())}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            if (search) setFilterData((prev) => ({ ...prev, search: search, by: by, page: 1 }));
            else setFilterData((prev) => ({ ...prev, search: "", by: "", page: 1 }));
          }
        }}
      />

      <button
        className="btn btn-primary"
        onClick={() => {
          if (search) setFilterData((prev) => ({ ...prev, search: search, by: by, page: 1 }));
          else setFilterData((prev) => ({ ...prev, search: "", by: "", page: 1 }));
        }}
      >Search</button>
    </div>
  );
};

export const Sort = ({ filterData, setFilterData }) => {
  return (
    <div className="flex justify-end w-full items-center mx-4 gap-2">
      Sort by:
      <select
        value={filterData.sort || "latest"}
        className="select w-fit"
        onChange={(e) => setFilterData((prev) => ({...prev, sort: e.target.value}))}
      >
        <option value="latest">Latest</option>
        <option value="oldest">Oldest</option>
        <option value="total_votes">Total Votes</option>
        <option value="rates_desc">Total Rates(High to Low)</option>
        <option value="rates_asc">Total Rates(Low to High)</option>
      </select>
    </div>
  );
};

export const Categories = ({ categories, subcategories }) => {
  return (
    <div className="bg-base-200 rounded-box shadow-md mb-4 md:w-3xs lg:w-xs 2xl:w-md">
      <div className="p-4 pb-2 text-xs opacity-60 tracking-wide">Categories/Subcategories</div>
      <div className="p-4 pt-2">
        {categories?.map((c, index) => (
          <div key={index} className="mb-2">
            <Link 
              className="badge badge-sm badge-primary me-1"
              to={`/posts?category=${c.id}`}
            >
              {c.name}
            </Link>
            {subcategories?.map((sc, idx) => (
            sc.category_id === c.id && <Link key={idx} className="badge badge-sm badge-secondary me-0.5" to={`/posts?subcategory=${sc.id}`}>{sc.name}</Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const Tags = ({ tags }) => {

  return (
    <div className="bg-base-200 rounded-box shadow-md mb-4 md:w-3xs lg:w-xs 2xl:w-md">
      <div className="p-4 pb-2 text-xs opacity-60 tracking-wide">Tags</div>
      <div className="p-4 pt-2">
        {tags?.map((t, index) => (
            <Link
              key={index}
              className="badge badge-primary me-1 mb-2"
              to={`/posts?with=${t.id}`}
            >
              {t.name}
            </Link>
        ))}
      </div>
    </div>
  );
};

export const Versions = ({ versions }) => {
  return (
    <div className="bg-base-200 rounded-box shadow-md mb-4 md:w-3xs lg:w-xs 2xl:w-md">
      <div className="p-4 pb-2 text-xs opacity-60 tracking-wide">Versions</div>
      <div className="p-4 pt-2">
        {versions?.map((v, index) => (
            <Link
              key={index}
              className="badge badge-sm badge-primary me-1 mb-2"
              to={`/posts?version=${v.id}`}
            >
              {v.name}
            </Link>
        ))}
      </div>
    </div>
  );
};

export const Output = ({ output }) => {
  return (
    <div>
      <ul className="list bg-base-200 rounded-box shadow-md mb-4 md:w-3xs lg:w-xs 2xl:w-md">
        <li className="p-4 pb-0 text-xs opacity-60 tracking-wide">Output</li>
        <li className="list-row whitespace-pre-wrap">
          {output}
        </li>
      </ul>
    </div>
  );
};

export const Designers = ({ ownerId, designers }) => {
  return (
    <div>
      <ul className="list bg-base-200 rounded-box shadow-md mb-4 md:w-3xs lg:w-xs 2xl:w-md">
  
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Designers</li>

        {designers?.map((designer, index) => (
          <Link key={index} to={designer.username ? `/u/${designer.username}` : ""}>
            <li className="list-row">
              <Avatar avatarUrl={designer.avatar_url} />
              <div>
                {designer.name && (<div>{designer.name}</div>)}
                {designer.display_name && (
                  <div className="flex gap-1 items-center">
                    {designer.display_name}
                    {designer.verified && <Check color="dodgerblue" absoluteStrokeWidth />}
                    {designer.user_id === ownerId && (<div className="badge badge-sm badge-primary mx-2">OP</div>)}
                  </div>
                )}
                {designer.username && (<div className="text-xs font-semibold opacity-60">@{designer.username}</div>)}
              </div>
            </li>
          </Link>
        ))}
        
      </ul>
    </div>
  );
};

export const Credits = ({ credits }) => {
  return (
    <div>
      <ul className="list bg-base-200 rounded-box shadow-md mb-4 md:w-3xs lg:w-xs 2xl:w-md">
        <li className="p-4 pb-0 text-xs opacity-60 tracking-wide">Credits</li>
        <li className="list-row whitespace-pre-wrap">
          {credits}
        </li>
      </ul>
    </div>
  );
};

export const Schems = ({ schems }) => {
  return (
    <div>
      <ul className="list bg-base-200 rounded-box shadow-md mb-4 w-full">
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Schematics</li>

        {schems?.map((schem, index) => (
          <li key={index} className="list-row items-center font-bold">
            <a href={CDN_URL + "/" + schem} download={schem.split("-").slice(1).join("-")} className="btn btn-primary btn-square"><Download /></a>
            {schem.split("-").slice(1).join("-")}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const Wdl = ({ wdl }) => {
  return (
    <div>
      <ul className="list bg-base-200 rounded-box shadow-md mb-4 w-full">
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">World Download</li>
          <li className="list-row items-center font-bold">
            <a href={CDN_URL + "/" + wdl} download={wdl?.split("-").slice(1).join("-")} className="btn btn-primary btn-square"><Download /></a>
            {wdl?.split("-").slice(1).join("-")}
          </li>
      </ul>
    </div>
  );
};

export const Vote = ({ initialCount, initialVote, onVote }) => {
  return (
    <div className="flex bg-base-300 shadow-2xl rounded-full w-min p-2 gap-1">
      <button className="btn btn-circle btn-ghost btn-xs" onClick={() => onVote(1)}>
        {initialVote === 1 ? <ArrowBigUp fill="orange" stroke="orange" /> : <ArrowBigUp />}
      </button>
      {initialCount}
      <button className="btn btn-circle btn-ghost btn-xs" onClick={() => onVote(-1)}>
        {initialVote === -1 ? <ArrowBigDown fill="blue" stroke="blue" /> : <ArrowBigDown />}
      </button>
    </div>
  );
};

export const DownloadsModal = ({ postId }) => {
  const { data: downloads, isPending, refetch } = useFetchDownloads(postId);

  const handleShowDownloads = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    // update this later
    if (!downloads) await refetch();
    document.getElementById(`downloads_modal_${postId}`).showModal();
  };

  
  return (
    <div>
      <button
        className="btn btn-square btn-primary mx-2"
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
          <h3 className="font-bold text-lg mb-4">Downloads</h3>
          {!downloads?.schem_urls && !downloads?.wdl_urls && <div>No downloads</div>}
          {downloads?.schem_urls && <Schems schems={downloads.schem_urls} />}
          {downloads?.wdl_urls && <Wdl wdl={downloads.wdl_urls[0]} />}
        </div>
      </dialog>
    </div>
  );
};