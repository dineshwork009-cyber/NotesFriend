import ListContainer from "../components/list-container";
import { useStore, store } from "../stores/tag-store";
import Placeholder from "../components/placeholders";
import { db } from "../common/db";
import { ListLoader } from "../components/loaders/list-loader";
import { Flex, Input } from "@theme-ui/components";
import { forwardRef, useEffect, useState } from "react";
import { debounce } from "@notesfriend/common";
import { Tag, VirtualizedGrouping } from "@notesfriend/core";
import ScrollContainer from "../components/scroll-container";
import { ScrollerProps } from "react-virtuoso";
import { SidebarScroller } from "../components/sidebar-scroller";

function Tags() {
  const tags = useStore((store) => store.tags);
  const refresh = useStore((store) => store.refresh);
  const [filteredTags, setFilteredTags] = useState<VirtualizedGrouping<Tag>>();
  const items = filteredTags || tags;

  useEffect(() => {
    store.refresh();
  }, []);

  if (!items) return <ListLoader />;
  return (
    <Flex
      variant="columnFill"
      id="tags"
      sx={{
        flex: 1,
        '[data-viewport-type="element"]': {
          px: 1,
          width: `calc(100% - ${2 * 6}px) !important`
        }
      }}
    >
      <ListContainer
        type="tags"
        refresh={refresh}
        items={items}
        placeholder={<Placeholder context="tags" />}
        header={<></>}
        Scroller={SidebarScroller}
      />
      <Input
        variant="clean"
        placeholder="Filter tags..."
        sx={{ borderTop: "1px solid var(--border)", mx: 0 }}
        onChange={debounce(async (e) => {
          const query = e.target.value.trim();
          setFilteredTags(
            query ? await db.lookup.tags(query).sorted() : undefined
          );
        }, 300)}
      />
    </Flex>
  );
}

export default Tags;
