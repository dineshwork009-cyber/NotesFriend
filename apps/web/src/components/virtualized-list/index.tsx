import { Virtualizer, useVirtualizer } from "@tanstack/react-virtual";
import { Box, BoxProps } from "@theme-ui/components";
import React, { useRef } from "react";

export type VirtualizedListProps<T, C> = {
  virtualizerRef?: React.MutableRefObject<
    Virtualizer<Element, Element> | undefined
  >;
  mode?: "fixed" | "dynamic";
  items: T[];
  estimatedSize: number;
  getItemKey: (index: number, items: T[]) => string;
  scrollElement?: Element | null;
  context?: C;
  itemWrapperProps?: (item: T, index: number) => BoxProps;
  renderItem: (props: {
    item: T;
    index: number;
    context: C;
  }) => JSX.Element | null;
  scrollMargin?: number;
  itemGap?: number;
  overscan?: number;
} & BoxProps;
export function VirtualizedList<T, C>(props: VirtualizedListProps<T, C>) {
  const {
    items,
    getItemKey,
    scrollElement,
    scrollMargin,
    renderItem: Item,
    estimatedSize,
    mode,
    virtualizerRef,
    itemWrapperProps,
    itemGap,
    overscan = 5,
    context,
    ...containerProps
  } = props;
  const containerRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    estimateSize: () => estimatedSize + (itemGap || 0),
    getItemKey: (index) => getItemKey(index, items),
    getScrollElement: () =>
      scrollElement || containerRef.current?.closest(".ms-container") || null,
    scrollMargin: scrollMargin || containerRef.current?.offsetTop || 0,
    overscan
  });

  if (virtualizerRef) virtualizerRef.current = virtualizer;

  const virtualItems = virtualizer.getVirtualItems();
  return (
    <Box
      {...containerProps}
      ref={containerRef}
      className="List"
      data-top={virtualizer.options.scrollMargin}
    >
      <Box
        sx={{
          height: virtualizer.getTotalSize(),
          width: "100%",
          position: "relative",
          gap: itemGap
        }}
        data-test-id="virtualized-list"
      >
        {virtualItems.map((row) => (
          <Box
            {...itemWrapperProps?.(items[row.index], row.index)}
            key={row.key}
            data-index={row.index}
            ref={mode === "dynamic" ? virtualizer.measureElement : null}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: mode === "dynamic" ? "unset" : `${row.size}px`,
              transform: `translateY(${
                row.start - virtualizer.options.scrollMargin
              }px)`
            }}
          >
            <Item
              key={row.key}
              item={items[row.index]}
              index={row.index}
              context={context || ({} as C)}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
