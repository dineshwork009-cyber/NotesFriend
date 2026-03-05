import React from "react";
import { useThemeColors } from "@notesfriend/theme";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDBItem } from "../hooks/use-db-item";
import { useShareStore } from "./store";
import { defaultBorderRadius } from "../utils/size";

export const AddTags = ({ onPress }) => {
  const { colors } = useThemeColors();
  const tagIds = useShareStore((state) => state.selectedTags);
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        paddingHorizontal: 12,
        minHeight: 45,
        width: "100%",
        marginRight: 0,
        borderWidth: 1,
        borderColor: colors.secondary.background,
        justifyContent: "center",
        borderRadius: defaultBorderRadius,
        marginBottom: 10
      }}
    >
      {!tagIds || !tagIds.length ? (
        <>
          <View
            style={{
              width: "100%",
              flexDirection: "row"
            }}
          >
            <Icon
              name="pound"
              size={20}
              style={{
                marginRight: 10
              }}
              allowFontScaling={false}
              color={colors.secondary.icon}
            />
            <Text
              style={{
                color: colors.secondary.icon,
                fontSize: 15
              }}
              allowFontScaling={false}
            >
              Add tags
            </Text>
          </View>
        </>
      ) : (
        <View
          style={{
            flexWrap: "wrap",
            width: "100%",
            flexDirection: "row"
          }}
        >
          {tagIds.map((id) => (
            <TagItem key={id} tagId={id} />
          ))}

          <Text
            style={{
              color: colors.primary.accent,
              marginRight: 5,
              fontSize: 14,
              borderRadius: 4,
              paddingHorizontal: 8,
              backgroundColor: colors.secondary.background,
              paddingVertical: 5
            }}
            allowFontScaling={false}
            onPress={() => {
              onPress();
            }}
            key="$add-tag"
          >
            <Icon name="plus" size={17} />
            Add tag
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const TagItem = ({ tagId }) => {
  const { colors } = useThemeColors();
  const [item] = useDBItem(tagId, "tag");
  const tagIds = useShareStore((state) => state.selectedTags);
  return !item ? null : (
    <Text
      style={{
        color: colors.secondary.icon,
        marginRight: 5,
        fontSize: 14,
        borderRadius: 4,
        paddingHorizontal: 8,
        backgroundColor: colors.secondary.background,
        paddingVertical: 5
      }}
      allowFontScaling={false}
      onPress={() => {
        const index = tagIds.indexOf(tagId);
        const selectedTags = tagIds.slice();
        selectedTags.splice(index, 1);
        useShareStore.getState().setSelectedTags(selectedTags);
      }}
    >
      #{item.title}
    </Text>
  );
};
