import { ItemMap, ItemType, VirtualizedGrouping } from "@notesfriend/core";
import { resolveItems } from "../utils/resolve-items.js";
import { useDeferredValue, useEffect, useState, useTransition } from "react";

export type ResolvedItemOptions<TItemType extends ItemType> = {
  type?: TItemType;
  items: VirtualizedGrouping<ItemMap[TItemType]>;
  index: number;
};

/**
 * Fetches & resolves the item from VirtualizedGrouping
 */
export function useResolvedItem<TItemType extends ItemType>(
  options: ResolvedItemOptions<TItemType>
) {
  const { index, items } = options;
  const [result, setResult] = useState(() => items.cacheItem(index));
  const deferredResult = useDeferredValue(result);
  const [, startTransition] = useTransition();

  useEffect(() => {
    items
      .item(index, resolveItems)
      .then(({ data, group, item }) =>
        item ? startTransition(() => setResult({ data, group, item })) : null
      );
  }, [index, items]);

  return deferredResult;
}

/**
 * Fetches but does not resolve the item from VirtualizedGrouping
 */
export function useUnresolvedItem<TItemType extends ItemType>(
  options: ResolvedItemOptions<TItemType>
) {
  const { index, items } = options;
  const [result, setResult] = useState(() => items.cacheItem(index));
  const deferredResult = useDeferredValue(result);
  const [, startTransition] = useTransition();

  useEffect(() => {
    items
      .item(index)
      .then(({ group, item }) =>
        item
          ? startTransition(() => setResult({ group, item, data: null }))
          : null
      );
  }, [index, items]);
  return deferredResult;
}
