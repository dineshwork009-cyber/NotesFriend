import { useThemeColors } from "@notesfriend/theme";
import React from "react";
import { AnnouncementDialog } from "../announcements";
import { SessionExpired } from "../auth/session-expired";
import { Dialog } from "../dialog";
import { AppLockPassword } from "../dialogs/applock-password";
import JumpToSectionDialog from "../dialogs/jump-to-section";
import { LoadingDialog } from "../dialogs/loading";
import PDFPreview from "../dialogs/pdf-preview";
import { VaultDialog } from "../dialogs/vault";
import ImagePreview from "../image-preview";
import MergeConflicts from "../merge-conflicts";
import SheetProvider from "../sheet-provider";
import RateAppSheet from "../sheets/rate-app";
import RecoveryKeySheet from "../sheets/recovery-key";
import Progress from "../dialogs/progress";
import { useSettingStore } from "../../stores/use-setting-store";

const DialogProvider = () => {
  const { colors } = useThemeColors();
  const isAppLoading = useSettingStore((state) => state.isAppLoading);

  return (
    <>
      <AppLockPassword />
      <LoadingDialog />
      <SheetProvider />
      <SheetProvider context="sync_progress" />
      <Dialog context="global" />
      <Progress />

      {isAppLoading ? null : (
        <>
          <MergeConflicts />
          <RecoveryKeySheet colors={colors} />
          <VaultDialog colors={colors} />
          <RateAppSheet />
          <ImagePreview />
          <AnnouncementDialog />
          <SessionExpired />
          <PDFPreview />
          <JumpToSectionDialog />
        </>
      )}
    </>
  );
};

export default React.memo(DialogProvider, () => true);
