import React, { useEffect } from "react";
import { useStore } from "../stores/note-store";
import ListContainer from "../components/list-container";
import useNavigate from "../hooks/use-navigate";
import Placeholder from "../components/placeholders";
import { useSearch } from "../hooks/use-search";
import { db } from "../common/db";
import { useEditorStore } from "../stores/editor-store";
import { ListLoader } from "../components/loaders/list-loader";

function Home() {
  const notes = useStore((store) => store.notes);
  const isCompact = useStore((store) => store.viewMode === "compact");
  const refresh = useStore((store) => store.refresh);
  const setContext = useStore((store) => store.setContext);
  const filteredItems = useSearch(
    "notes",
    async (query, sortOptions) => {
      if (useStore.getState().context) return;
      return await db.lookup.notesWithHighlighting(
        query,
        db.notes.all,
        sortOptions
      );
    },
    [notes]
  );

  useNavigate("home", setContext);

  useEffect(() => {
    useStore.getState().refresh();
  }, []);

  if (!notes) return <ListLoader />;
  return (
    <ListContainer
      type="home"
      group="home"
      compact={isCompact}
      refresh={refresh}
      items={filteredItems || notes}
      isSearching={!!filteredItems}
      placeholder={<Placeholder context={filteredItems ? "search" : "notes"} />}
      button={{
        onClick: () => useEditorStore.getState().newSession()
      }}
    />
  );
}
export default React.memo(Home, () => true);
