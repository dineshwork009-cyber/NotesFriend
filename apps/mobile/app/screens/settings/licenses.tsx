import { LegendList } from "@legendapp/list";
import { useThemeColors } from "@notesfriend/theme";
import React from "react";
import { Linking, Platform } from "react-native";
import { Pressable } from "../../components/ui/pressable";
import Heading from "../../components/ui/typography/heading";
import Paragraph from "../../components/ui/typography/paragraph";
import { AppFontSize } from "../../utils/size";
import { DefaultAppStyles } from "../../utils/styles";
import { LICENSES } from "./license-data";

type LicenseEntry = {
  name: string;
  licenseType: string;
  author: string;
  link: string;
};

export const Licenses = () => {
  const { colors } = useThemeColors("base");
  const items =
    Platform.OS === "ios"
      ? LICENSES.filter((l) => l.name.indexOf("android") === -1)
      : LICENSES;

  const renderItem = React.useCallback(
    ({ item }: { item: LicenseEntry }) => (
      <Pressable
        key={item.name}
        style={{
          alignItems: "flex-start",
          justifyContent: "flex-start",
          alignSelf: "flex-start",
          padding: DefaultAppStyles.GAP,
          borderBottomWidth: 1,
          borderBottomColor: colors.primary.border,
          borderRadius: 0
        }}
        onPress={() => {
          if (!item.link) return;
          Linking.openURL(item.link).catch(() => {
            /* empty */
          });
        }}
      >
        <Heading size={AppFontSize.sm}>{item.name}</Heading>
        <Paragraph>
          {item.licenseType} | {item.author?.split("<")[0]}
        </Paragraph>
      </Pressable>
    ),
    [colors.primary.border]
  );
  return (
    <LegendList
      data={items}
      style={{
        width: "100%"
      }}
      renderItem={renderItem}
    />
  );
};
