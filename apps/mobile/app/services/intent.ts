import { Platform } from "react-native";
import { db } from "../common/database";
import { setAppState } from "../screens/editor/tiptap/utils";
import { eOnLoadNote } from "../utils/events";
import { NotesfriendModule } from "../utils/notesfriend-module";
import { eSendEvent } from "./event-manager";
import { fluidTabsRef } from "../utils/global-refs";
import AddReminder from "../screens/add-reminder";

const launchIntent = Platform.OS === "ios" ? {} : NotesfriendModule.getIntent();
let used = false;
let launched = false;
export const IntentService = {
  getLaunchIntent() {
    if (used || Platform.OS === "ios") return null;
    used = true;
    return launchIntent;
  },
  onLaunch() {
    if (launched || Platform.OS === "ios") return;
    launched = true;
    if (launchIntent["com.streetwriters.notesfriend.OpenNoteId"]) {
      setAppState({
        movedAway: false,
        editing: true,
        timestamp: Date.now(),
        noteId: launchIntent["com.streetwriters.notesfriend.OpenNoteId"]
      });
    }
  },
  async onAppStateChanged() {
    if (Platform.OS === "ios") return;
    try {
      const intent = NotesfriendModule.getIntent();

      if (intent["com.streetwriters.notesfriend.OpenNoteId"]) {
        const note = await db.notes.note(
          intent["com.streetwriters.notesfriend.OpenNoteId"]
        );
        if (note) {
          eSendEvent(eOnLoadNote, {
            item: note
          });
          fluidTabsRef.current?.goToPage("editor", false);
        }
      } else if (intent["com.streetwriters.notesfriend.OpenReminderId"]) {
        const reminder = await db.reminders.reminder(
          intent["com.streetwriters.notesfriend.OpenReminderId"]
        );
        if (reminder) AddReminder.present(reminder);
      } else if (intent["com.streetwriters.notesfriend.NewReminder"]) {
        AddReminder.present();
      }
    } catch (e) {
      /* empty */
    }
  }
};
