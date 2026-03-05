import { strings } from "@notesfriend/intl";
import React, { useEffect, useRef, useState } from "react";
import { useTabContext } from "../hooks/useTabStore";
import { Settings } from "../utils";
import { EditorEvents } from "../utils/editor-events";
import styles from "./styles.module.css";
function Tags(props: { settings: Settings; loading?: boolean }) {
  const [tags, setTags] = useState<
    { title: string; alias: string; id: string; type: "tag" }[]
  >([]);
  const tagsRef = useRef({
    setTags: setTags
  });
  const tab = useTabContext();

  useEffect(() => {
    globalThis.editorTags[tab.id] = tagsRef;
    return () => {
      globalThis.editorTags[tab.id] = undefined;
    };
  }, [tab.id, tagsRef]);

  const openManageTagsSheet = () => {
    const editor = editors[tab.id];
    if (editor?.isFocused) {
      editor.commands.blur();
      editorTitles[tab.id]?.current?.blur();
    }
    post(EditorEvents.newtag, undefined, tab.id, tab.session?.noteId);
  };
  const fontScale = props.settings?.fontScale || 1;

  return !tab.session?.noteId ? null : (
    <div
      className={styles.container}
      style={{
        display: "flex",
        alignItems: "center",
        opacity: props.loading ? 0 : 1,
        gap: 6
      }}
    >
      {tags.length === 0 ? (
        <button
          className={styles.btn}
          onClick={(e) => {
            e.preventDefault();
            openManageTagsSheet();
          }}
          style={{
            border: `none`,
            backgroundColor: "transparent",
            borderRadius: 8,
            padding: "0px 6px",
            fontFamily: "Inter",
            display: "flex",
            alignItems: "center",
            height: "24px",
            userSelect: "none",
            WebkitUserSelect: "none"
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            width={18 * fontScale}
            height={18 * fontScale}
            viewBox={`0 0 24 24`}
          >
            <path
              fill="var(--nn_primary_accent)"
              d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"
            />
          </svg>

          <p
            style={{
              fontSize: 12,
              marginLeft: 4,
              color: "var(--nn_primary_icon)",
              userSelect: "none"
            }}
          >
            {strings.addTag()}
          </p>
        </button>
      ) : null}

      {tags.slice(0, 2).map((tag, index) => (
        <button
          key={tag.title}
          style={{
            border: index !== 0 ? "none" : "1px solid var(--nn_primary_border)",
            backgroundColor:
              index !== 0 ? "transparent" : "var(--nn_secondary_background)",
            borderRadius: 6,
            padding: "0px 4px",
            height: "24px",
            fontFamily: "Inter",
            fontSize: 12,
            color: "var(--nn_primary_icon)",
            userSelect: "none",
            WebkitUserSelect: "none"
          }}
          onClick={(e) => {
            e.preventDefault();
            openManageTagsSheet();
          }}
        >
          {index > 0 ? `+${tags.length - 1}` : `#${tag.title}`}
        </button>
      ))}
    </div>
  );
}

export default React.memo(Tags, (prev, next) => {
  if (
    prev.settings.fontScale !== next.settings.fontScale ||
    prev.loading !== next.loading
  )
    return false;
  return true;
});
