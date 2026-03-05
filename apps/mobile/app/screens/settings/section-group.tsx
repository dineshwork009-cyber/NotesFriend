import React from "react";
import { View } from "react-native";
import Heading from "../../components/ui/typography/heading";
import { useThemeColors } from "@notesfriend/theme";
import { AppFontSize } from "../../utils/size";
import { SectionItem } from "./section-item";
import { SettingSection } from "./types";
import { DefaultAppStyles } from "../../utils/styles";
export const SectionGroup = ({ item }: { item: SettingSection }) => {
  const { colors } = useThemeColors();
  const current = item.useHook && item.useHook();
  const isHidden = item.hidden && item.hidden(current);
  return isHidden ? null : (
    <View
      style={{
        marginVertical: item.sections ? 10 : 0
      }}
    >
      {item.name && item.sections ? (
        <Heading
          style={{
            paddingHorizontal: DefaultAppStyles.GAP
          }}
          color={colors.primary.accent}
          size={AppFontSize.xs}
        >
          {(item.name as string).toUpperCase()}
        </Heading>
      ) : null}

      {item.sections?.map((item) => (
        <SectionItem key={item.name as string} item={item} />
      ))}
    </View>
  );
};
