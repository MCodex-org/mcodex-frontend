import { useCallback, useEffect, useState } from "react";
import { useMetaStore } from "../stores/metaStore";
import getCaretCoordinates from "textarea-caret";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Heading1, Heading2, Heading3, Italic, List, ListOrdered, MoveHorizontal, Redo, Strikethrough, Underline, Undo } from "lucide-react";
import { useTranslation } from "react-i18next";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

export const CategorySelector = ({ postData, setPostData }) => {
  const { t } = useTranslation();
  const { categories } = useMetaStore();
  const [addedSubs, setAddedSubs] = useState(postData?.subs);

  useEffect(() => {
    setPostData((prev) => ({...prev, subs: addedSubs}));
  }, [addedSubs]);

  const toggleSub = (s) => {
    setAddedSubs((prev) =>
      prev.includes(s)
        ? prev.filter(id => id !== s)
        : [...prev, s]
    );
  };


  return (
    <div>
      <button className="btn btn-primary btn-outline" onClick={()=>document.getElementById('category_modal').showModal()}>{t("create_post.select_categories")}</button>
      <br /><span className="label mb-2">{t("gen.required")}</span>
      <dialog id="category_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg mb-4">{t("create_post.select_categories")}</h3>
          {categories?.map((cat) => (
            <form key={cat.id} className="mb-4">
              <p className="text-lg mb-2">{cat.name}</p>
              {cat.subcategories.map((sub) => (<input key={sub.id} className="btn btn-outline btn-sm m-1" type="checkbox" name="subcategories" checked={addedSubs.includes(sub.id)} onChange={() => toggleSub(sub.id)} aria-label={sub.name} />))}
            </form>
          ))}
        </div>
      </dialog>
      {categories?.map((cat) => (
        cat.subcategories.map((sub) => (addedSubs.includes(sub.id) && <p key={sub.id}>{cat.name} &gt; {sub.name}</p>))
      ))}
    </div>
  );
};

export const TagSelector = ({ postData, setPostData, required = false, showSelected = false }) => {
  const { t } = useTranslation();
  const { tags: allTags } = useMetaStore();
  const [tags, setTags] = useState([]);
  const [addedTags, setAddedTags] = useState(postData?.tags);

  useEffect(() => {
    setTags(allTags);
  }, [allTags]);

  useEffect(() => {
    setPostData((prev) => ({...prev, tags: addedTags}));
  }, [addedTags]);

  const handleSearch = async (e) => {
    const term = e.target.value.toLowerCase();

    if (term === "") {
      setTags(allTags);
      return;
    }

    let matches = [];
    allTags.map((tag_cat) => {
      let filteredTags = tag_cat.tags.filter((tag) =>
        tag.name.toLowerCase().includes(term)
      );
      if (filteredTags.length > 0) {
        matches.push({
          ...tag_cat,
          tags: filteredTags
        });
      }
    });
    setTags(matches);
  };

  const toggleTag = (t) => {
    setAddedTags((prev) =>
      prev.includes(t)
        ? prev.filter(id => id !== t)
        : [...prev, t]
    );
  };

  return (
    <div>
      <button className="btn btn-primary btn-outline" onClick={()=>document.getElementById('tag_modal').showModal()}>{t("create_post.select_tags")}</button>
      <br />
      {required && <span className="label mb-2">{t("gen.required")}</span>}
      <dialog id="tag_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg mb-4">{t("create_post.select_tags")}</h3>
          <input
            type="text"
            className="input input-sm mb-2 w-full"
            placeholder="Search"
            onChange={handleSearch}
          />
          {tags?.map((tag_cat) => (
            <form key={tag_cat.id} className="mb-2">
              <p className="mb-1">{tag_cat.name}</p>
              {tag_cat.tags.map((tag) => (<input key={tag.id} className="btn btn-outline btn-xs rounded-full m-0.5" type="checkbox" name="tags" checked={addedTags.includes(tag.id)} onChange={() => toggleTag(tag.id)} aria-label={tag.name} />))}
            </form>
          ))}
        </div>
      </dialog>
      {showSelected && <div className="flex gap-1">
        {allTags?.map((tag_cat) => (
          tag_cat.tags.map((tag) => (addedTags.includes(tag.id) && <p key={tag.id} className="badge badge-primary badge-sm rounded-full">{tag.name}</p>))
        ))}
      </div>}
    </div>
  );
};

export const VersionSelector = ({ postData, setPostData }) => {
  const { t } = useTranslation();
  const { versions: majorVersions } = useMetaStore();
  const [addedVersions, setAddedVersions] = useState(postData?.versions);

  useEffect(() => {
    setPostData((prev) => ({...prev, versions: addedVersions}));
  }, [addedVersions]);

  const toggleVersion = (v) => {
    setAddedVersions((prev) =>
      prev.includes(v)
        ? prev.filter(id => id !== v)
        : [...prev, v]
    );
  };

  const toggleMajorVersion = (mvId) => {
    majorVersions.map((mv) => {
      if (mv.id === mvId) {
        mv.versions.map((v) => {
          if (addedVersions.includes(v.id)) return;
          setAddedVersions((prev) => [...prev, v.id])
        });
      }
    });
  };


  return (
    <div>
      <button className="btn btn-primary btn-outline" onClick={()=>document.getElementById('version_modal').showModal()}>{t("create_post.select_versions")}</button>
      <br /><span className="label mb-2">{t("gen.required")}</span>
      <dialog id="version_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg mb-4">{t("create_post.select_versions")}</h3>
          {majorVersions?.map((mv) => (
            <form key={mv.id} className="mb-4">
              <div className="flex justify-between w-full"><p className="text-lg mb-2">{mv.name}</p>
                <div><button type="button" onClick={() => toggleMajorVersion(mv.id)} className="btn btn-primary btn-soft btn-xs mx-2">{t("create_post.select_all")}</button></div>
              </div>
              {mv.versions.map((v) => (<input key={v.id} className="btn btn-outline btn-sm m-1" type="checkbox" name="versions" checked={addedVersions.includes(v.id)} onChange={() => toggleVersion(v.id)} aria-label={v.name} />))}
            </form>
          ))}
        </div>
      </dialog>
      <div className="gap-1">
        {majorVersions?.map((mv) => (
          <div key={mv.id} className="flex my-0.5">
          {mv.versions.map((v) => (addedVersions.includes(v.id) && <p key={v.id} className="badge badge-xs badge-primary mx-0.5">{v.name}</p>))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const MentionInput = ({ postData, setPostData }) => {
  const { t } = useTranslation();
  const [value, setValue] = useState(postData.designers || "");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [selectedIndex, setSelectedIndex] = useState(0);

  function debounce (func, delay) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const fetchSuggestions = useCallback(
    debounce(async (query) => {
      if (!query) return;
      try {
        const res = await fetch(`${BASE_URL}/api/profiles/search?q=${query}`);
        const data = await res.json();
        setSuggestions(data);
        setShowDropdown(true);
      } catch (err) {
        console.error(err);
      }
    }, 300),
    []
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [suggestions]);

  const handleChange = async (e) => {
    const val = e.target.value;
    setValue(val);
    setPostData((prev) => ({...prev, designers: val}));

    const match = val.match(/@(\w*)$/);
    if (match) {
      const coords = getCaretCoordinates(e.target, e.target.selectionStart);
      setDropdownPos({
        top: coords.top + coords.height + 5,
        left: coords.left
      });

      fetchSuggestions(match[1]);
    } else {
      setShowDropdown(false);
      setSuggestions([]);
    }
  };

  const handleSelect = (username) => {
    const newText = value.replace(/@\w*$/, `@${username}, `);
    setValue(newText);
    setPostData({...postData, designers: newText});
    setShowDropdown(false);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) {
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : 0
        );
        break;
      case "Enter":
        e.preventDefault();
        if (suggestions[selectedIndex]) {
          handleSelect(suggestions[selectedIndex].username);
        }
        break;
      case "Tab":
        e.preventDefault();
        if (suggestions[selectedIndex]) {
          handleSelect(suggestions[selectedIndex].username);
        }
        break;
      case "Escape":
        e.preventDefault();
        setShowDropdown(false);
        break;
    }

  };


  return (
    <div className="relative">
      <input
        className="input validator w-full border p-2 rounded"
        placeholder={t("create_post.@_to_mention")}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={() => setShowDropdown(false)}
      />

      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute menu w-auto bg-base-200 z-10 overflow-y-auto [&_li>*]:rounded-none p-0"
          style={{
            top: dropdownPos.top,
            left: dropdownPos.left
          }}>
          {suggestions.map((u, index) => (
            <li
              key={u.id}
              onMouseDown={(e) => {e.preventDefault(); handleSelect(u.username);}}
            ><a className={`cursor-pointer ${index === selectedIndex ? "bg-primary" : "bg-black-100"}`}>
              @{u.username} [{u.display_name}]
            </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const VideoInput = ({ postData, setPostData }) => {
  const { t } = useTranslation();
  const [videos, setVideos] = useState(postData.video_urls || [""]);

  const handleChange = (i, value) => {
    const newVideos = [...videos];
    newVideos[i] = value;
    setVideos(newVideos);
    setPostData((prev) => ({ ...prev, video_urls: newVideos }));
  };

  const addField = () => {
    if (videos.length < 5) setVideos((prev) => ([...prev, ""]));
  };

  const removeField = (i) => {
    const newVideos = videos.filter((_, idx) => idx !== i);
    setVideos(newVideos);
    setPostData((prev) => ({ ...prev, video_urls: newVideos }));
  };

  return (
    <div>
      {videos.map((url, i) => (
        <div key={i} className="flex items-center gap-2 mb-2">
          <input
            type="url"
            value={url}
            placeholder={t("create_post.yt_billy_url")}
            onChange={(e) => handleChange(i, e.target.value)}
            className="input w-full"
          />
          {videos.length > 1 && <button type="button" onClick={() => removeField(i)} className="btn btn-error btn-sm">x</button>}
        </div>
      ))}
      {videos.length < 5 && (<button type="button" onClick={addField} className="btn btn-primary btn-sm">+ {t("create_post.add_another")}</button>)}
    </div>
  );
};

const MenuBar = ({ editor }) => {
  const editorState = useEditorState({
    editor,
    selector: ctx => {
      return {
        isBold: ctx.editor.isActive("bold") ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive("italic") ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isUnderline: ctx.editor.isActive("underline") ?? false,
        canUnderline: ctx.editor.can().chain().toggleUnderline().run() ?? false,
        isStrike: ctx.editor.isActive("strike") ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isHeading1: ctx.editor.isActive('heading', { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive('heading', { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive('heading', { level: 3 }) ?? false,
        isBulletList: ctx.editor.isActive('bulletList') ?? false,
        isOrderedList: ctx.editor.isActive('orderedList') ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false
      }
    }
  });

  return (
    <div className="flex justify-between">
      <div className="flex gap-1 mb-2">
        <div>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editorState.canBold}
            className={`btn btn-sm btn-square ${editorState.isBold ? "btn-primary btn-active" : "btn-soft"}`}
          >
            <Bold />
          </button>
        </div>
        <div>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editorState.canItalic}
            className={`btn btn-sm btn-square ${editorState.isItalic ? "btn-primary btn-active" : "btn-soft"}`}
          >
            <Italic />
          </button>
        </div>
        <div>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!editorState.canUnderline}
            className={`btn btn-sm btn-square ${editorState.isUnderline ? "btn-primary btn-active" : "btn-soft"}`}
          >
            <Underline />
          </button>
        </div>
        <div>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editorState.canStrike}
            className={`btn btn-sm btn-square ${editorState.isStrike ? "btn-primary btn-active" : "btn-soft"}`}
          >
            <Strikethrough />
          </button>
        </div>
        <div>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`btn btn-sm btn-square ${editorState.isHeading1 ? "btn-primary btn-active" : "btn-soft"}`}
          >
            <Heading1 />
          </button>
        </div>
        <div>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`btn btn-sm btn-square ${editorState.isHeading2 ? "btn-primary btn-active" : "btn-soft"}`}
          >
            <Heading2 />
          </button>
        </div>
        <div>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`btn btn-sm btn-square ${editorState.isHeading3 ? "btn-primary btn-active" : "btn-soft"}`}
          >
            <Heading3 />
          </button>
        </div>
        <div>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`btn btn-sm btn-square ${editorState.isBulletList ? "btn-primary btn-active" : "btn-soft"}`}
          >
            <List />
          </button>
        </div>
        <div>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`btn btn-sm btn-square ${editorState.isOrderedList ? "btn-primary btn-active" : "btn-soft"}`}
          >
            <ListOrdered />
          </button>
        </div>
        <div>
          <button
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className={"btn btn-sm btn-square btn-soft"}
          >
            <MoveHorizontal />
          </button>
        </div>
      </div>
      <div className="flex gap-1 mb-2">
        <div>
          <button
            onClick={() => editor.chain().focus().undo().run()}
            className={"btn btn-sm btn-square btn-soft"}
            disabled={!editorState.canUndo}
          >
            <Undo />
          </button>
        </div>
        <div>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            className={"btn btn-sm btn-square btn-soft"}
            disabled={!editorState.canRedo}
          >
            <Redo />
          </button>
        </div>
      </div>
    </div>
  );
};

export const RichTextEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    onUpdate: ({editor}) => {
      const html = editor.getHTML();
      const json = editor.getJSON();
      onChange((prev) => ({ ...prev, description_html: html, description_json: json }));
    }
  });

  useEffect(() => {
    if (editor && value) {
      const currentContent = editor.getJSON();
      if (JSON.stringify(currentContent) !== JSON.stringify(value)) {
        editor.commands.setContent(value);
      }
    }
  }, [value, editor]);


  return (
    <div className="textarea p-2 w-full">
      <MenuBar editor={editor} />
      <div>
        <EditorContent editor={editor} className="prose prose-sm max-w-none break-all" />
      </div>
    </div>
  );
};