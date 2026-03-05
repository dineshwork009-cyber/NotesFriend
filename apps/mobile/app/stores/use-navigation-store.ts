import {
  Color,
  FilteredSelector,
  Item,
  ItemType,
  Note,
  Notebook,
  Reminder,
  Tag
} from "@notesfriend/core";
import { ParamListBase } from "@react-navigation/core";
import { create } from "zustand";

export type GenericRouteParam = {
  canGoBack?: boolean;
};

export type NotebookScreenParams = {
  id: string;
  item?: Notebook;
  canGoBack?: boolean;
};

export type NotesScreenParams = {
  type: "tag" | "color" | "monograph";
  id: string;
  item?: Tag | Color;
  canGoBack?: boolean;
};

export type AppLockRouteParams = {
  welcome: boolean;
  canGoBack?: boolean;
};

export type AuthParams = {
  mode: number;
  context?: "intro";
  state?: BillingState;
};

export type BillingState = {
  productId?: string;
  planId?: string;
  billingType?: "annual" | "monthly";
};

export interface RouteParams extends ParamListBase {
  Notes: GenericRouteParam;
  Notebooks: {
    canGoBack?: boolean;
  };
  Notebook: NotebookScreenParams;
  NotesPage: NotesScreenParams;
  Tags: GenericRouteParam;
  Favorites: GenericRouteParam;
  Trash: GenericRouteParam;
  Search: {
    placeholder: string;
    type: ItemType;
    title: string;
    route: RouteName;
    items?: FilteredSelector<Item>;
  };
  TaggedNotes: NotesScreenParams;
  ColoredNotes: NotesScreenParams;
  TopicNotes: NotesScreenParams;
  Archive: GenericRouteParam;
  Monographs: NotesScreenParams;
  Reminders: GenericRouteParam;
  SettingsGroup: GenericRouteParam;
  FluidPanelsView: GenericRouteParam;
  AppLock: GenericRouteParam;
  Settings: GenericRouteParam;
  Auth: AuthParams;
  LinkNotebooks: {
    noteIds: string[];
  };
  MoveNotebook: {
    selectedNotebooks: Notebook[];
  };
  MoveNotes: {
    notebook: Notebook;
  };
  ManageTags: {
    ids?: string[];
  };
  AddReminder: {
    reminder?: Reminder;
    reference?: Note;
  };
  Intro: GenericRouteParam;
  PayWall: {
    canGoBack?: boolean;
    context: "signup" | "logged-in" | "logged-out" | "subscribed";
    state?: BillingState;
  };
  Wrapped: GenericRouteParam;
}

export type RouteName = keyof RouteParams;

export type HeaderRightButton = {
  title: string;
  onPress: () => void;
};

interface NavigationStore {
  currentRoute: RouteName;
  canGoBack?: boolean;
  focusedRouteId?: string;
  update: (currentScreen: RouteName) => void;
  headerRightButtons?: HeaderRightButton[];
  buttonAction: () => void;
  setButtonAction: (buttonAction: () => void) => void;
  setFocusedRouteId: (id?: string) => void;
}

const useNavigationStore = create<NavigationStore>((set, get) => ({
  focusedRouteId: "Notes",
  setFocusedRouteId: (id) => {
    set({
      focusedRouteId: id
    });
  },
  currentRoute: "Notes",
  canGoBack: false,
  update: (currentScreen) => {
    set({
      currentRoute: currentScreen
    });
  },
  headerRightButtons: [],
  buttonAction: () => null,
  setButtonAction: (buttonAction) => set({ buttonAction })
}));

export default useNavigationStore;
