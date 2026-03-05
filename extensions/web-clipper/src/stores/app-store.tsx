import create from "zustand";
import { ItemReference, NotebookReference, User } from "../common/bridge";
import { connectApi } from "../api";

interface AppStore {
  isLoggedIn: boolean;
  isLoggingIn: boolean;
  user?: User;
  notes: ItemReference[];
  notebooks: NotebookReference[];
  tags: ItemReference[];
  route: string;

  login(openNew?: boolean): Promise<void>;
  navigate(route: string): void;
}

export const useAppStore = create<AppStore>((set) => ({
  isLoggedIn: false,
  isLoggingIn: false,
  notebooks: [],
  notes: [],
  tags: [],
  route: "/login",

  navigate(route) {
    set({ route });
  },

  async login(openNew = false) {
    set({ isLoggingIn: true });

    const notesfriend = await connectApi(openNew, () => {
      set({
        user: undefined,
        isLoggedIn: false,
        isLoggingIn: false,
        notes: [],
        notebooks: [],
        tags: []
      });
    });

    if (!notesfriend) {
      set({ isLoggingIn: false });
      throw new Error(
        "Please refresh the Notesfriend web app to connect with the Web Clipper."
      );
    }

    const user = await notesfriend.login();
    const notes = await notesfriend.getNotes();
    const notebooks = await notesfriend.getNotebooks();
    const tags = await notesfriend.getTags();

    set({
      user: user || undefined,
      isLoggedIn: true,
      isLoggingIn: false,
      notes: notes,
      notebooks: notebooks,
      tags: tags
    });
  }
}));
