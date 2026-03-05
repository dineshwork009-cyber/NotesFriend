import React, { RefObject, useEffect, useRef, useState } from "react";
import { getTotalWords, Editor } from "@notesfriend/editor";
import { useTabContext } from "../hooks/useTabStore";
import { strings } from "@notesfriend/intl";

function StatusBar({
  container,
  loading
}: {
  container: RefObject<HTMLDivElement>;
  loading?: boolean;
}) {
  const tab = useTabContext();
  const [showChars, setShowChars] = useState(false);
  const [words, setWords] = useState(strings.totalWords(0));
  const currentWords = useRef(words);
  const [chars, setChars] = useState(0);
  const statusBar = useRef({
    set: () => {},
    updateWords: () => {
      const editor = editors[tab.id];
      if (!editor) return;
      const words = strings.totalWords(getTotalWords(editor as Editor));
      if (currentWords.current === words) return;
      setWords(words);
    },
    resetWords: () => {
      currentWords.current = strings.totalWords(0);
      setWords(currentWords.current);
    }
  });

  useEffect(() => {
    globalThis.statusBars[tab.id] = statusBar;
    if (showChars) {
      editors[tab.id]?.on("selectionUpdate", (event) => {
        setChars(event.editor.extensionStorage.characterCount.characters());
      });
    }
    if (editors[tab.id]) {
      setChars(
        editors[tab.id]?.extensionStorage.characterCount.characters() || 0
      );
    }

    return () => {
      globalThis.statusBars[tab.id] = undefined;
    };
  }, [tab.id, statusBar, showChars]);

  useEffect(() => {
    currentWords.current = words;
  }, [words]);

  const paragraphStyle: React.CSSProperties = {
    marginTop: 0,
    marginBottom: 0,
    fontSize: 12,
    color: "var(--nn_secondary_paragraph)",
    paddingBottom: 0,
    fontFamily: "Inter",
    userSelect: "none"
  };

  return (
    <p
      onMouseDown={(e) => {
        setShowChars(!showChars);
      }}
      style={paragraphStyle}
    >
      {showChars ? strings.charactersCount(chars) : words}
    </p>
  );
}

export default React.memo(
  StatusBar,
  (prev, next) => prev.loading === next.loading
);
