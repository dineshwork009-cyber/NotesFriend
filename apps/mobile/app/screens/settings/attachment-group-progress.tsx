import { formatBytes } from "@notesfriend/common";
import { useThemeColors } from "@notesfriend/theme";
import React from "react";
import { View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { db } from "../../common/database";
import { IconButton } from "../../components/ui/icon-button";
import { ProgressBarComponent } from "../../components/ui/svg/lazy";
import Paragraph from "../../components/ui/typography/paragraph";
import { useAttachmentProgress } from "../../hooks/use-attachment-progress";
import { useDBItem } from "../../hooks/use-db-item";
import { useAttachmentStore } from "../../stores/use-attachment-store";
import { AppFontSize } from "../../utils/size";
import { strings } from "@notesfriend/intl";
import { DefaultAppStyles } from "../../utils/styles";

export const AttachmentGroupProgress = (props: { groupId?: string }) => {
  const { colors } = useThemeColors();
  const progress = useAttachmentStore((state) =>
    !props.groupId ? undefined : state.downloading?.[props.groupId]
  );
  const [file] = useDBItem(progress?.filename, "attachment");
  const [fileProgress] = useAttachmentProgress(file, false);

  return !progress ||
    progress.canceled ||
    progress.current === progress.total ? null : (
    <View
      style={{
        borderWidth: 1,
        borderColor: colors.primary.border,
        borderRadius: 10,
        padding: DefaultAppStyles.GAP,
        flexDirection: "row",
        gap: 10
      }}
    >
      <Icon name="download" size={AppFontSize.xxxl} />
      <View
        style={{
          gap: DefaultAppStyles.GAP_VERTICAL_SMALL,
          flex: 1
        }}
      >
        <Paragraph>
          {progress.message || "Downloading files"} ({progress?.current}/
          {progress?.total})
        </Paragraph>

        {progress && progress.current && progress.total ? (
          <View
            style={{
              width: "100%",
              marginTop: DefaultAppStyles.GAP_VERTICAL
            }}
          >
            <ProgressBarComponent
              height={5}
              width={null}
              animated={true}
              useNativeDriver
              progress={progress.current / progress.total}
              unfilledColor={colors.secondary.background}
              color={colors.primary.accent}
              borderWidth={0}
            />
          </View>
        ) : null}

        <Paragraph
          style={{
            fontSize: 10,
            color: colors.secondary.paragraph
          }}
          numberOfLines={1}
        >
          {strings.downloading()} {file?.filename}{" "}
          {formatBytes(file?.size || 0)}{" "}
          {fileProgress?.percent ? `(${fileProgress.percent})` : ""}
        </Paragraph>
        <Paragraph size={10} color={colors.secondary.paragraph}>
          {strings.group()}: {props.groupId}
        </Paragraph>
      </View>
      {props.groupId === "offline-mode" ? null : (
        <IconButton
          name="close"
          onPress={() => {
            if (props.groupId) {
              useAttachmentStore.getState().setDownloading({
                groupId: props.groupId,
                canceled: true,
                current: 0,
                total: 0,
                message: undefined
              });
              setTimeout(() => {
                if (props.groupId) {
                  db.fs().cancel(props.groupId);
                }
              });
            }
          }}
        />
      )}
    </View>
  );
};
