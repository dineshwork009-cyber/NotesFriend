import { ItemMap, ItemType } from "@notesfriend/core";
import {
  ResolvedItemOptions,
  useResolvedItem
} from "../hooks/use-resolved-item.js";

type ResolvedItemProps<TItemType extends ItemType> =
  ResolvedItemOptions<TItemType> & {
    children: (item: {
      item: ItemMap[TItemType];
      data: unknown;
    }) => React.ReactNode;
  };
export function ResolvedItem<TItemType extends ItemType>(
  props: ResolvedItemProps<TItemType>
) {
  const { children } = props;
  const { item, data } = useResolvedItem(props) || {};
  return item ? <>{children({ item, data })}</> : null;
}
