import { create } from "zustand";
import { shallow } from "zustand/shallow";
import { MenuItem, PositionOptions } from "@notesfriend/ui";
import { desktop } from "../common/desktop-bridge";
import { isMac } from "../utils/platform";

type MenuOptions = {
  position?: PositionOptions;
  blocking?: boolean;
  title?: string;
  forceCustom?: boolean;
};
type MenuStore = {
  isOpen: boolean;
  items: MenuItem[];
  title?: string;
  options: MenuOptions;
  open: (items: MenuItem[], option?: MenuOptions) => void;
  close: () => void;
};

const useMenuStore = create<MenuStore>((set) => ({
  isOpen: false,
  items: [],
  title: undefined,
  options: {
    blocking: false
  },
  open: async (items, options) => {
    if (
      IS_DESKTOP_APP &&
      canShowNativeMenu(items) &&
      isMac() &&
      !options?.forceCustom
    ) {
      const resolvedItems = await resolveMenuItems(items);
      desktop?.integration.showMenu.subscribe(
        {
          menuItems: JSON.parse(JSON.stringify(resolvedItems))
        },
        {
          onData(ids) {
            findAndCallAction(resolvedItems, ids);
          }
        }
      );
      set(() => ({ options }));
    } else {
      set(() => ({ isOpen: true, items, options }));
    }
  },
  close: () =>
    set(() => ({
      isOpen: false,
      items: [],
      data: undefined,
      title: undefined
    }))
}));

export function useMenuTrigger() {
  const isOpen = useMenuStore((store) => store.isOpen);
  const target = useMenuStore((store) => store.options?.position?.target);
  const [open, close] = useMenuStore(
    (store) => [store.open, store.close],
    shallow
  );

  return {
    openMenu: open,
    closeMenu: close,
    isOpen,
    target
  };
}

export const Menu = {
  openMenu: (items: MenuItem[], options: MenuOptions = {}) =>
    useMenuStore.getState().open(items, options),
  closeMenu: () => useMenuStore.getState().close(),
  isOpen: () => useMenuStore.getState().isOpen,
  target: () => useMenuStore.getState().options?.position?.target
};

export function useMenu() {
  const [items, options] = useMenuStore((store) => [
    store.items,
    store.options
  ]);
  return { items, options };
}

async function resolveMenuItems(items: MenuItem[]): Promise<MenuItem[]> {
  const serialized = [];
  for (const item of items) {
    if (item.type === "lazy-loader")
      serialized.push(...(await resolveMenuItems(await item.items())));
    else if (item.type === "button") {
      if (item.menu) item.menu.items = await resolveMenuItems(item.menu.items);
      serialized.push(item);
    } else serialized.push(item);
  }
  return serialized;
}

function findAndCallAction(items: MenuItem[], ids: string[]) {
  let _items: MenuItem[] = items;
  const actionId = ids.at(-1);
  for (const id of ids) {
    const item = _items.find((item) => item.key === id);
    if (!item || item?.type !== "button") continue;
    console.log(item);
    if (id === actionId) {
      item?.onClick?.();
    } else {
      _items = item.menu?.items || [];
    }
  }
}

function canShowNativeMenu(items: MenuItem[]) {
  return items.every((item) => item.type !== "popup");
}
