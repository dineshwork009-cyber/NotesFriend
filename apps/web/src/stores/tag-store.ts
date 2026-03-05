import createStore from "../common/store";
import { db } from "../common/db";
import BaseStore from "./index";
import { Tag } from "@notesfriend/core";
import { VirtualizedGrouping } from "@notesfriend/core";

class TagStore extends BaseStore<TagStore> {
  tags?: VirtualizedGrouping<Tag>;

  refresh = async () => {
    this.set({
      tags: await db.tags.all.grouped(db.settings.getGroupOptions("tags"))
    });
  };
}

const [useStore, store] = createStore<TagStore>(
  (set, get) => new TagStore(set, get)
);
export { useStore, store };
