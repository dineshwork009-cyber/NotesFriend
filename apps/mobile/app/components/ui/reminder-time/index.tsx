import { isReminderActive } from "@notesfriend/core";
import React from "react";
import { ViewStyle } from "react-native";

import { useThemeColors } from "@notesfriend/theme";
import { defaultBorderRadius, AppFontSize } from "../../../utils/size";
import { Button, ButtonProps } from "../button";
import { getFormattedReminderTime } from "@notesfriend/common";
import { Reminder } from "@notesfriend/core";
import { DefaultAppStyles } from "../../../utils/styles";

export const ReminderTime = ({
  checkIsActive = true,
  style,
  ...props
}: {
  short?: boolean;
  onPress?: () => void;
  reminder?: Reminder;
  color?: string;
  style?: ViewStyle;
  checkIsActive?: boolean;
} & ButtonProps) => {
  const { colors } = useThemeColors();
  const reminder = props.reminder;
  const time = !reminder ? undefined : getFormattedReminderTime(reminder);
  const isTodayOrTomorrow =
    (time?.includes("Today") || time?.includes("Tomorrow")) &&
    !time?.includes("Last");
  const isActive =
    checkIsActive && reminder ? isReminderActive(reminder) : true;

  return reminder && isActive ? (
    <Button
      title={time}
      key={reminder.id}
      icon="bell"
      fontSize={AppFontSize.xs}
      iconSize={AppFontSize.sm}
      type="secondary"
      buttonType={
        isTodayOrTomorrow
          ? {
              text: props.color || colors.primary.accent
            }
          : undefined
      }
      textStyle={{
        marginRight: 0
      }}
      style={{
        height: "auto",
        borderRadius: defaultBorderRadius,
        borderColor: colors.primary.border,
        paddingHorizontal: DefaultAppStyles.GAP_SMALL,
        ...(style as ViewStyle)
      }}
      {...props}
      onPress={props.onPress}
    />
  ) : null;
};
