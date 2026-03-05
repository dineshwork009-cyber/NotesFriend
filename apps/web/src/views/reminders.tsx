import ListContainer from "../components/list-container";
import { useStore, store } from "../stores/reminder-store";
import { hashNavigate } from "../navigation";
import useNavigate from "../hooks/use-navigate";
import Placeholder from "../components/placeholders";
import { db } from "../common/db";
import { useSearch } from "../hooks/use-search";
import { ListLoader } from "../components/loaders/list-loader";

function Reminders() {
  useNavigate("reminders", () => store.refresh());
  const reminders = useStore((state) => state.reminders);
  const refresh = useStore((state) => state.refresh);
  const filteredItems = useSearch(
    "reminders",
    (query, sortOptions) => db.lookup.reminders(query).sorted(sortOptions),
    [reminders]
  );

  if (!reminders) return <ListLoader />;
  return (
    <>
      <ListContainer
        type="reminders"
        group="reminders"
        refresh={refresh}
        items={filteredItems || reminders}
        isSearching={!!filteredItems}
        placeholder={
          <Placeholder context={filteredItems ? "search" : "reminders"} />
        }
        button={{
          onClick: () => hashNavigate("/reminders/create")
        }}
      />
    </>
  );
}

export default Reminders;
