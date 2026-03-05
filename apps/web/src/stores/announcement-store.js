import createStore from "../common/store";
import { db } from "../common/db";
import BaseStore from "./index";
import Config from "../utils/config";
import { isUserSubscribed } from "../hooks/use-is-user-premium";
import { appVersion } from "../utils/version";
import { findItemAndDelete, SubscriptionStatus } from "@notesfriend/core";

/**
 * @extends {BaseStore<AnnouncementStore>}
 */
class AnnouncementStore extends BaseStore {
  inlineAnnouncements = [];
  dialogAnnouncements = [];

  refresh = async () => {
    if (IS_TESTING) return;

    try {
      const inlineAnnouncements = [];
      const dialogAnnouncements = [];
      for (let announcement of await db.announcements()) {
        if (!(await shouldShowAnnouncement(announcement))) continue;
        if (announcement.type === "inline")
          inlineAnnouncements.push(announcement);
        else if (announcement.type === "dialog")
          dialogAnnouncements.push(announcement);
      }
      this.set((state) => {
        state.inlineAnnouncements = inlineAnnouncements;
        state.dialogAnnouncements = dialogAnnouncements;
      });
    } catch (e) {
      console.error(e);
    }
  };

  dismiss = (id) => {
    Config.set(id, "removed");
    this.set((state) => {
      findItemAndDelete(
        state.inlineAnnouncements,
        (announcement) => announcement.id === id
      );

      findItemAndDelete(
        state.dialogAnnouncements,
        (announcement) => announcement.id === id
      );
    });
  };
}

const [useStore, store] = createStore(
  (set, get) => new AnnouncementStore(set, get)
);
export { useStore, store };

export const allowedPlatforms = [
  "all",
  PLATFORM,
  ...(window.os ? [window.os()] : [])
];

async function shouldShowAnnouncement(announcement) {
  if (Config.get(announcement.id) === "removed") return false;

  let show = announcement.platforms.some(
    (platform) => allowedPlatforms.indexOf(platform) > -1
  );
  if (!show) return false;

  show =
    !announcement.appVersion ||
    announcement.appVersion === appVersion.numerical;

  if (!show) return false;

  const user = await db.user.getUser();
  show = announcement.userTypes.some((userType) => {
    switch (userType) {
      case "subscribed":
        return isUserSubscribed(user);
      case "trial":
        return user?.subscription?.status === SubscriptionStatus.TRIAL;
      case "loggedOut":
        return !user;
      case "loggedIn":
        return !!user;
      case "unverified":
        return user && !user.isEmailConfirmed;
      case "verified":
        return user && user.isEmailConfirmed;
      case "any":
      default:
        return true;
    }
  });

  return show;
}
