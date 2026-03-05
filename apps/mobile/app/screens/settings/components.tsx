import React, { ReactElement } from "react";
import { View } from "react-native";
import { AttachmentDialog } from "../../components/attachments";
import { ChangePassword } from "../../components/auth/change-password";
import { DefaultAppStyles } from "../../utils/styles";
import { AttachmentGroupProgress } from "./attachment-group-progress";
import { ChangeEmail } from "./change-email";
import DebugLogs from "./debug";
import { ConfigureToolbar } from "./editor/configure-toolbar";
import { Licenses } from "./licenses";
import {
  ApplockTimerPicker,
  BackupReminderPicker,
  BackupWithAttachmentsReminderPicker,
  DateFormatPicker,
  DayFormatPicker,
  WeekFormatPicker,
  FontPicker,
  HomePicker,
  SidebarTabPicker,
  TimeFormatPicker,
  TrashIntervalPicker
} from "./picker/pickers";
import { RestoreBackup } from "./restore-backup";
import { ServersConfiguration } from "./server-config";
import SoundPicker from "./sound-picker";
import ThemeSelector from "./theme-selector";
import { TitleFormat } from "./title-format";
import { NotesfriendCircle } from "./notesfriend-circle";

export const components: { [name: string]: ReactElement } = {
  homeselector: <HomePicker />,
  autobackups: <BackupReminderPicker />,
  configuretoolbar: <ConfigureToolbar />,
  "debug-logs": <DebugLogs />,
  "sound-picker": <SoundPicker />,
  licenses: <Licenses />,
  "trash-interval-selector": <TrashIntervalPicker />,
  "font-selector": <FontPicker />,
  "title-format": <TitleFormat />,
  "date-format-selector": <DateFormatPicker />,
  "time-format-selector": <TimeFormatPicker />,
  "day-format-selector": <DayFormatPicker />,
  "week-format-selector": <WeekFormatPicker />,
  "theme-selector": <ThemeSelector />,
  "applock-timer": <ApplockTimerPicker />,
  autobackupsattachments: <BackupWithAttachmentsReminderPicker />,
  backuprestore: <RestoreBackup />,
  "server-config": <ServersConfiguration />,
  "attachments-manager": <AttachmentDialog note={undefined} isSheet={false} />,
  "offline-mode-progress": (
    <View style={{ paddingHorizontal: DefaultAppStyles.GAP }}>
      <AttachmentGroupProgress groupId="offline-mode" />
    </View>
  ),
  "sidebar-tab-selector": <SidebarTabPicker />,
  "change-password": <ChangePassword />,
  "change-email": <ChangeEmail />,
  "notesfriend-circle": <NotesfriendCircle />
};
