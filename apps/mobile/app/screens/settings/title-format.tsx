import { useRef, useState } from "react";
import { db } from "../../common/database";
import Input from "../../components/ui/input";
import React from "react";
import { TextInput } from "react-native";
import Paragraph from "../../components/ui/typography/paragraph";
import { useThemeColors } from "@notesfriend/theme";
import { AppFontSize } from "../../utils/size";
import { strings } from "@notesfriend/intl";
import { DefaultAppStyles } from "../../utils/styles";

export const TitleFormat = () => {
  const [titleFormat] = useState(db.settings.getTitleFormat());
  const inputRef = useRef<TextInput>(null);
  const { colors } = useThemeColors();

  return (
    <>
      <Input
        onSubmit={(e) => {
          db.settings.setTitleFormat(e.nativeEvent.text);
        }}
        onChangeText={(text) => {
          db.settings.setTitleFormat(text);
        }}
        containerStyle={{ marginTop: DefaultAppStyles.GAP_VERTICAL_SMALL }}
        onLayout={() => {
          inputRef?.current?.setNativeProps({
            text: titleFormat
          });
        }}
        defaultValue={titleFormat}
      />

      <Paragraph
        style={{ marginTop: 2 }}
        color={colors.secondary.paragraph}
        size={AppFontSize.xs}
      >
        {strings.titleFormattingGuide()}
      </Paragraph>
    </>
  );
};
