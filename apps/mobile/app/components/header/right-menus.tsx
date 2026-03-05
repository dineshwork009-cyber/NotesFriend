import { useThemeColors } from "@notesfriend/theme";
import React from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, IconButtonProps } from "../ui/icon-button";

export const RightMenus = ({
  rightButton
}: {
  rightButton?: IconButtonProps;
}) => {
  const { colors } = useThemeColors();

  return (
    <View style={styles.rightBtnContainer}>
      {rightButton ? (
        <IconButton {...rightButton} color={colors.primary.icon} />
      ) : (
        <View
          style={{
            width: 40,
            height: 40
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  rightBtnContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  rightBtn: {
    justifyContent: "center",
    alignItems: "center"
  }
});
