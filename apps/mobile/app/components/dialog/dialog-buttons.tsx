import { strings } from "@notesfriend/intl";
import { useThemeColors } from "@notesfriend/theme";
import React from "react";
import { StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { notesfriend } from "../../../e2e/test.ids";
import { getColorLinearShade } from "../../utils/colors";
import { AppFontSize } from "../../utils/size";
import { DefaultAppStyles } from "../../utils/styles";
import { Button, ButtonProps } from "../ui/button";
import Paragraph from "../ui/typography/paragraph";

const DialogButtons = ({
  onPressPositive,
  onPressNegative,
  positiveTitle,
  negativeTitle = strings.cancel(),
  loading,
  doneText,
  positiveType
}: {
  onPressPositive?: () => void;
  onPressNegative: () => void;
  positiveTitle: string;
  negativeTitle?: string;
  loading?: boolean;
  doneText?: string;
  positiveType?: ButtonProps["type"];
}) => {
  const { colors, isDark } = useThemeColors();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.secondary.background,
          height: 60,
          paddingHorizontal: DefaultAppStyles.GAP,
          borderTopWidth: 0.7,
          borderTopColor: getColorLinearShade(
            colors.secondary.background,
            0.05,
            isDark
          )
        }
      ]}
    >
      {doneText ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <Icon
            color={colors.primary.accent}
            name="check-circle-outline"
            size={AppFontSize.md}
          />
          <Paragraph color={colors.primary.accent}>{" " + doneText}</Paragraph>
        </View>
      ) : (
        <View />
      )}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        <Button
          onPress={onPressNegative}
          fontSize={AppFontSize.sm}
          testID={notesfriend.ids.default.dialog.no}
          type="plain"
          bold
          title={negativeTitle}
        />
        {onPressPositive ? (
          <Button
            onPress={onPressPositive}
            fontSize={AppFontSize.sm}
            testID={notesfriend.ids.default.dialog.yes}
            style={{
              marginLeft: 10
            }}
            loading={loading}
            bold
            type={positiveType || "transparent"}
            title={positiveTitle}
          />
        ) : null}
      </View>
    </View>
  );
};

export default DialogButtons;

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginTop: DefaultAppStyles.GAP_VERTICAL
  }
});
