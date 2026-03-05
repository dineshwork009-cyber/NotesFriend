import ListContainer from "../components/list-container";
import { useStore, store } from "../stores/trash-store";
import { showToast } from "../utils/toast";
import useNavigate from "../hooks/use-navigate";
import Placeholder from "../components/placeholders";
import { useSearch } from "../hooks/use-search";
import { db } from "../common/db";
import { ListLoader } from "../components/loaders/list-loader";
import { ConfirmDialog } from "../dialogs/confirm";
import { strings } from "@notesfriend/intl";

function Trash() {
  useNavigate("trash", store.refresh);
  const items = useStore((store) => store.trash);
  const refresh = useStore((store) => store.refresh);
  const clearTrash = useStore((store) => store.clear);
  const filteredItems = useSearch("trash", (query, sortOptions) =>
    db.lookup.trash(query).sorted(sortOptions)
  );

  if (!items) return <ListLoader />;
  return (
    <ListContainer
      type="trash"
      group="trash"
      refresh={refresh}
      isSearching={!!filteredItems}
      placeholder={<Placeholder context={filteredItems ? "search" : "trash"} />}
      items={filteredItems || items}
      button={{
        onClick: function () {
          ConfirmDialog.show({
            title: strings.clearTrash(),
            subtitle: strings.clearTrashDesc(),
            positiveButtonText: strings.clear(),
            negativeButtonText: strings.cancel(),
            message: strings.areYouSure()
          }).then(async (res) => {
            if (res) {
              try {
                await clearTrash();
                showToast("success", strings.trashCleared());
              } catch (e) {
                if (e instanceof Error)
                  showToast(
                    "error",
                    `${strings.couldNotClearTrash()} ${strings.error()}: ${
                      e.message
                    }`
                  );
              }
            }
          });
        }
      }}
    />
  );
}
export default Trash;
