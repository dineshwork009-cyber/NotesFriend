import { Tag } from "@notesfriend/core";
import { useThemeColors } from "@notesfriend/theme";
import React from "react";
import { View } from "react-native";
import { notesfriend } from "../../../../e2e/test.ids";
import { TaggedNotes } from "../../../screens/notes/tagged";
import { AppFontSize } from "../../../utils/size";
import { Properties } from "../../properties";
import { IconButton } from "../../ui/icon-button";
import Heading from "../../ui/typography/heading";
import Paragraph from "../../ui/typography/paragraph";
import SelectionWrapper, { selectItem } from "../selection-wrapper";
import { strings } from "@notesfriend/intl";
import { DefaultAppStyles } from "../../../utils/styles";

const TagItem = React.memo(
  ({
    item,
    index,
    totalNotes
  }: {
    item: Tag;
    index: number;
    totalNotes: number;
  }) => {
    const { colors } = useThemeColors();
    const onPress = () => {
      if (selectItem(item)) return;

      TaggedNotes.navigate(item, true);
    };

    return (
      <SelectionWrapper
        onPress={onPress}
        item={item}
        testID={notesfriend.ids.tag.get(index)}
      >
        <View
          style={{
            flexGrow: 1,
            flexShrink: 1
          }}
        >
          <Heading size={AppFontSize.md}>
            <Heading
              size={AppFontSize.md}
              style={{
                color: colors.primary.accent
              }}
            >
              #
            </Heading>
            {item.title}
          </Heading>
          <Paragraph
            color={colors.secondary.paragraph}
            size={AppFontSize.xs}
            style={{
              marginTop: DefaultAppStyles.GAP_VERTICAL_SMALL
            }}
          >
            {strings.notes(totalNotes)}
          </Paragraph>
        </View>

        <IconButton
          color={colors.primary.heading}
          name="dots-horizontal"
          size={AppFontSize.xl}
          onPress={() => {
            Properties.present(item);
          }}
          testID={notesfriend.ids.tag.menu}
          style={{
            justifyContent: "center",
            height: 35,
            width: 35,
            borderRadius: 100,
            alignItems: "center"
          }}
        />
      </SelectionWrapper>
    );
  },
  (prev, next) => {
    if (prev.item?.dateModified !== next.item?.dateModified) {
      return false;
    }

    return true;
  }
);

TagItem.displayName = "TagItem";

export default TagItem;
