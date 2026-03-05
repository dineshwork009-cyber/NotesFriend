import { useThemeColors } from "@notesfriend/theme";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { notesfriend } from "../../../e2e/test.ids";
import { TTip, useTip } from "../../services/tip-manager";
import { RouteParams } from "../../stores/use-navigation-store";
import { useSettingStore } from "../../stores/use-setting-store";
import { AppFontSize } from "../../utils/size";
import { Tip } from "../tip";
import { Button } from "../ui/button";
import Seperator from "../ui/seperator";
import Heading from "../ui/typography/heading";
import Paragraph from "../ui/typography/paragraph";

export type PlaceholderData = {
  title: string;
  paragraph: string;
  button?: string;
  action?: () => void;
  loading?: string;
  type?: string;
};

type EmptyListProps = {
  loading?: boolean;
  placeholder?: PlaceholderData;
  title?: string;
  color?: string;
  dataType: string;
  screen?: keyof RouteParams;
};

export const Empty = React.memo(function Empty({
  loading = true,
  placeholder,
  title,
  color,
  dataType,
  screen
}: EmptyListProps) {
  const { colors } = useThemeColors();
  const introCompleted = useSettingStore(
    (state) => state.settings.introCompleted
  );
  const tip = useTip(
    screen === "Notes" && introCompleted
      ? "first-note"
      : placeholder?.type || ((dataType + "s") as any),
    screen === "Notes" ? "notes" : "list"
  );

  return (
    <View
      style={[
        {
          flex: 1,
          width: "80%",
          justifyContent: "center",
          alignSelf: "center"
        }
      ]}
    >
      {!loading ? (
        <>
          <Tip
            color={color}
            tip={
              screen !== "Search"
                ? tip || ({ text: () => placeholder?.paragraph } as TTip)
                : ({ text: () => placeholder?.paragraph } as TTip)
            }
            style={{
              backgroundColor: "transparent",
              paddingHorizontal: 0
            }}
          />
          {placeholder?.button && (
            <Button
              testID={notesfriend.buttons.add}
              type="secondaryAccented"
              title={placeholder?.button}
              iconPosition="right"
              icon="arrow-right"
              onPress={placeholder?.action}
              style={{
                alignSelf: "flex-start"
              }}
            />
          )}
        </>
      ) : (
        <>
          <View
            style={{
              alignSelf: "center",
              alignItems: "flex-start",
              width: "100%"
            }}
          >
            <Heading>{placeholder?.title}</Heading>
            <Paragraph size={AppFontSize.sm} textBreakStrategy="balanced">
              {placeholder?.loading}
            </Paragraph>
            <Seperator />
            <ActivityIndicator
              size={AppFontSize.lg}
              color={color || colors.primary.accent}
            />
          </View>
        </>
      )}
    </View>
  );
});
