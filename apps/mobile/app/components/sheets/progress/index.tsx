import React, { useEffect, useState } from "react";
import { View } from "react-native";
import useSyncProgress from "../../../hooks/use-sync-progress";
import { presentSheet } from "../../../services/event-manager";
import { useThemeColors } from "@notesfriend/theme";
import { AppFontSize } from "../../../utils/size";
import Seperator from "../../ui/seperator";
import { ProgressBarComponent } from "../../ui/svg/lazy";
import Heading from "../../ui/typography/heading";
import Paragraph from "../../ui/typography/paragraph";
import { strings } from "@notesfriend/intl";
export const Progress = () => {
  const { colors } = useThemeColors();
  const { progress } = useSyncProgress();
  const [currentProgress, setCurrentProgress] = useState(0.1);

  useEffect(() => {
    const nextProgress = progress ? progress?.current / progress?.total : 0.1;

    setCurrentProgress((currentProgress) => {
      if (currentProgress > nextProgress) return currentProgress;
      return progress ? progress?.current / progress?.total : 0.1;
    });
  }, [progress]);

  return (
    <View
      style={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 25,
        paddingBottom: 15
      }}
    >
      <Heading size={AppFontSize.lg}>{strings.syncingHeading()}</Heading>
      <Paragraph>{strings.syncingDesc()}</Paragraph>
      <Seperator />
      <View
        style={{
          width: 200
        }}
      >
        <ProgressBarComponent
          height={5}
          width={null}
          animated={true}
          useNativeDriver
          indeterminate
          unfilledColor={colors.secondary.background}
          color={colors.primary.accent}
          borderWidth={0}
        />
      </View>

      {progress ? (
        <Paragraph color={colors.secondary.paragraph}>
          {strings.networkProgress(progress.type)} {progress?.current}
        </Paragraph>
      ) : null}
    </View>
  );
};

Progress.present = () => {
  presentSheet({
    component: <Progress />,
    disableClosing: true,
    context: "sync_progress"
  });
};
