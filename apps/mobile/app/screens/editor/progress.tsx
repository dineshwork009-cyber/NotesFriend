import { useThemeColors } from "@notesfriend/theme";
import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { ProgressBarComponent } from "../../components/ui/svg/lazy";
import useGlobalSafeAreaInsets from "../../hooks/use-global-safe-area-insets";
import { useAttachmentStore } from "../../stores/use-attachment-store";
import { useTabStore } from "./tiptap/use-tab-store";

export const ProgressBar = () => {
  const { colors } = useThemeColors();
  const currentlyEditingNote = useTabStore((state) => state.getCurrentNoteId());
  const downloading = useAttachmentStore((state) => state.downloading);

  const loading = currentlyEditingNote
    ? downloading?.[currentlyEditingNote]
    : undefined;

  const attachmentProgress = useAttachmentStore((state) => state.progress);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timer = useRef<NodeJS.Timeout>(undefined);
  const insets = useGlobalSafeAreaInsets();
  const [width, setWidth] = useState(0);

  const groupProgressInfo = useRef<{
    [name: string]: {
      total: number;
      current: number;
    };
  }>({});

  const currentItemProgress = loading?.filename
    ? attachmentProgress?.[loading?.filename]
    : undefined;

  useEffect(() => {
    if (loading) {
      if (
        loading.current === loading.total &&
        typeof loading.success === "boolean"
      ) {
        clear();
        return;
      }
      setVisible(true);
      if (!loading.filename) return;

      if (!groupProgressInfo.current[loading.filename]) {
        groupProgressInfo.current[loading.filename] = {
          total: 1,
          current: 0
        };
      }

      const itemProgressCurrent = groupProgressInfo.current[loading.filename];

      const itemTotalSize =
        currentItemProgress?.total || itemProgressCurrent.total;

      const itemCurrentProgress =
        currentItemProgress?.recieved ||
        currentItemProgress?.sent ||
        itemProgressCurrent.current;

      groupProgressInfo.current[loading.filename] = {
        current: itemCurrentProgress,
        total: itemTotalSize
      };

      const itemProgressPercent = itemCurrentProgress / itemTotalSize;

      setProgress(
        ((loading.current || 0) + itemProgressPercent) / (loading.total || 1)
      );
    } else {
      clear();
    }
  }, [currentItemProgress, loading]);

  const clear = () => {
    clearTimeout(timer.current);
    timer.current = undefined;
    timer.current = setTimeout(() => {
      setProgress(1);
      setTimeout(() => {
        setVisible(false);
        setProgress(0);
        groupProgressInfo.current = {};
      }, 1000);
    }, 0);
  };

  return (
    <View
      style={{
        justifyContent: "center",
        position: "absolute",
        zIndex: visible ? 1 : -1,
        opacity: visible ? 1 : 0,
        marginTop: insets.top + 45,
        width: "100%"
      }}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
    >
      <ProgressBarComponent
        progress={progress}
        color={colors.primary.accent}
        borderWidth={0}
        borderRadius={0}
        height={2}
        width={width || 400}
      />
    </View>
  );
};
