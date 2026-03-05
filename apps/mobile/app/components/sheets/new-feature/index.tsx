import { useThemeColors } from "@notesfriend/theme";
import React from "react";
import { Platform, View } from "react-native";
import { ScrollView } from "react-native-actions-sheet";
import { getVersion } from "react-native-device-info";
import { features } from "../../../features";
import { eSendEvent, presentSheet } from "../../../services/event-manager";
import SettingsService from "../../../services/settings";
import { eCloseSheet } from "../../../utils/events";
import { AppFontSize } from "../../../utils/size";
import { Button } from "../../ui/button";
import Seperator from "../../ui/seperator";
import Heading from "../../ui/typography/heading";
import Paragraph from "../../ui/typography/paragraph";
import { strings } from "@notesfriend/intl";
import { DefaultAppStyles } from "../../../utils/styles";
export type FeatureType = {
  title: string;
  body: string;
  platform?: "ios" | "android";
};

const NewFeature = ({
  features,
  version
}: {
  features: FeatureType[];
  version?: string;
}) => {
  const { colors } = useThemeColors();

  return (
    <View
      style={{
        alignItems: "center",
        paddingHorizontal: DefaultAppStyles.GAP,
        paddingTop: 12,
        maxHeight: "100%"
      }}
    >
      <Heading color={colors.secondary.heading} size={AppFontSize.md}>
        {strings.newVersionHighlights(version)}
      </Heading>

      <Seperator />

      <ScrollView>
        {features.map((item) => (
          <View
            key={item.title}
            style={{
              backgroundColor: colors.secondary.background,
              padding: DefaultAppStyles.GAP,
              borderRadius: 10,
              width: "100%",
              marginBottom: DefaultAppStyles.GAP_VERTICAL
            }}
          >
            <Heading size={AppFontSize.lg - 2}>{item.title}</Heading>
            <Paragraph selectable>{item.body}</Paragraph>
          </View>
        ))}
      </ScrollView>
      <Seperator />

      <Button
        title={strings.gotIt()}
        type="accent"
        width={250}
        style={{
          borderRadius: 100
        }}
        onPress={() => {
          eSendEvent(eCloseSheet);
        }}
      />
    </View>
  );
};

NewFeature.present = () => {
  const { version, introCompleted } = SettingsService.get();
  if (!introCompleted) {
    SettingsService.set({
      version: getVersion()
    });
    return;
  }
  if (!version || version === getVersion()) {
    SettingsService.set({
      version: getVersion()
    });
    return false;
  }

  SettingsService.set({
    version: getVersion()
  });
  const _features = features?.filter(
    (feature) => !feature.platform || feature.platform === Platform.OS
  );
  if (_features.length === 0) return;
  presentSheet({
    component: (
      <NewFeature
        features={features}
        version={SettingsService.getProperty("version") || undefined}
      />
    ),
    disableClosing: true
  });
  return true;
};

export default NewFeature;
