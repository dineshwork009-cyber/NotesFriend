import { strings } from "@notesfriend/intl";
import { useThemeColors } from "@notesfriend/theme";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { db } from "../../common/database";
import ManageTags from "../../screens/manage-tags";
import { TaggedNotes } from "../../screens/notes/tagged";
import { AppFontSize } from "../../utils/size";
import { DefaultAppStyles } from "../../utils/styles";
import { sleep } from "../../utils/time";
import { Button } from "../ui/button";
import { ColorTags } from "./color-tags";

export const Tags = ({ item, close }) => {
  const { colors } = useThemeColors();

  return item.id ? (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        paddingHorizontal: DefaultAppStyles.GAP,
        alignSelf: "center",
        justifyContent: "space-between",
        width: "100%"
      }}
    >
      <Button
        onPress={async () => {
          ManageTags.present([item.id]);
          close();
        }}
        buttonType={{
          text: colors.primary.accent
        }}
        title={strings.addTag()}
        type="secondary"
        icon="plus"
        iconPosition="right"
        fontSize={AppFontSize.xs}
        style={{
          paddingHorizontal: DefaultAppStyles.GAP_SMALL,
          paddingVertical: DefaultAppStyles.GAP_VERTICAL_SMALL
        }}
      />
      <ColorTags item={item} />
    </View>
  ) : null;
};

export const TagStrip = ({ item, close }) => {
  const [tags, setTags] = useState([]);
  useEffect(() => {
    db.relations
      .to(item, "tag")
      .resolve()
      .then((tags) => {
        setTags(tags);
      });
  }, []);

  return tags?.length > 0 ? (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 5
      }}
    >
      {tags?.map((tag) =>
        tag ? <TagItem key={tag.id} tag={tag} close={close} /> : null
      )}
    </View>
  ) : null;
};

const TagItem = ({ tag, close }) => {
  const { colors } = useThemeColors();
  const onPress = async () => {
    TaggedNotes.navigate(tag, true);
    await sleep(300);
    close();
  };

  const style = {
    paddingHorizontal: 0,
    paddingVertical: DefaultAppStyles.GAP_VERTICAL_SMALL
  };
  return (
    <Button
      onPress={onPress}
      title={"#" + tag.title}
      type="plain"
      fontSize={AppFontSize.xs}
      style={style}
      textStyle={{
        color: colors.secondary.paragraph
      }}
    />
  );
};
