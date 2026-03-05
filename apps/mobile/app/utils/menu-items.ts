import { Item, ItemType } from "@notesfriend/core";
import { Monographs } from "../screens/notes/monographs";
import Navigation from "../services/navigation";

export type SideMenuItem = {
  dataType?: ItemType | "monograph";
  data?: Item;
  title: string;
  id: string;
  icon: string;
  onPress?: (item: SideMenuItem) => void;
  onLongPress?: (item: SideMenuItem) => void;
  type: string;
};

export const MenuItemsList: SideMenuItem[] = [
  {
    dataType: "note",
    id: "Notes",
    title: "Notes",
    icon: "note-outline",
    type: "side-menu-item"
  },
  // {
  //   dataType: "notebook",
  //   id: "Notebooks",
  //   title: "Notebooks",
  //   icon: "book-outline"
  // },
  {
    dataType: "note",
    id: "Favorites",
    title: "Favorites",
    icon: "star-outline",
    type: "side-menu-item"
  },
  // {
  //   dataType: "tag",
  //   id: "Tags",
  //   title: "Tags",
  //   icon: "pound"
  // },
  {
    dataType: "reminder",
    id: "Reminders",
    title: "Reminders",
    icon: "bell",
    type: "side-menu-item"
  },
  {
    dataType: "monograph",
    id: "Monographs",
    title: "Monographs",
    icon: "text-box-multiple-outline",
    onPress: () => {
      Navigation.closeDrawer();
      Monographs.navigate();
    },
    type: "side-menu-item"
  },
  {
    dataType: "note",
    id: "Archive",
    title: "Archive",
    icon: "archive",
    type: "side-menu-item"
  },
  {
    dataType: "note",
    id: "Trash",
    title: "Trash",
    icon: "delete-outline",
    type: "side-menu-item"
  }
];
