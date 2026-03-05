import ListContainer from "../components/list-container";
import {
  notesFromContext,
  useStore as useNotesStore
} from "../stores/note-store";
import Placeholder from "../components/placeholders";
import { useSearch } from "../hooks/use-search";
import { db } from "../common/db";
import { handleDrop } from "../common/drop-handler";
import { useEditorStore } from "../stores/editor-store";
import { ListLoader } from "../components/loaders/list-loader";

type NotesProps = { header?: JSX.Element };
function Notes(props: NotesProps) {
  const { header } = props;
  const context = useNotesStore((store) => store.context);
  const contextNotes = useNotesStore((store) => store.contextNotes);
  const refreshContext = useNotesStore((store) => store.refreshContext);
  const type =
    context?.type === "favorite"
      ? "favorites"
      : context?.type === "archive"
      ? "archive"
      : "notes";
  const isCompact = useNotesStore((store) => store.viewMode === "compact");
  const filteredItems = useSearch(
    context?.type === "notebook" ? "notebook" : "notes",
    async (query, sortOptions) => {
      if (!context || !contextNotes) return;
      const notes = notesFromContext(context);
      return await db.lookup.notesWithHighlighting(query, notes, sortOptions);
    },
    [context, contextNotes]
  );

  if (!context || !contextNotes) return <ListLoader />;
  return (
    <ListContainer
      type={type}
      group={type}
      refresh={refreshContext}
      compact={isCompact}
      context={context}
      items={filteredItems || contextNotes}
      isSearching={!!filteredItems}
      onDrop={(e) => handleDrop(e.dataTransfer, context)}
      placeholder={
        <Placeholder
          context={
            filteredItems
              ? "search"
              : context.type === "favorite"
              ? "favorites"
              : context.type === "archive"
              ? "archive"
              : context.type === "monographs"
              ? "monographs"
              : "notes"
          }
        />
      }
      button={{
        onClick: () => useEditorStore.getState().newSession()
      }}
      header={header}
    />
  );
}
export default Notes;
