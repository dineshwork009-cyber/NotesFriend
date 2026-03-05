import { strings } from "@notesfriend/intl";
import { useThemeColors } from "@notesfriend/theme";
import React, { useRef, useState } from "react";
import { View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { IconButton } from "../../components/ui/icon-button";
import Navigation from "../../services/navigation";
import useNavigationStore from "../../stores/use-navigation-store";
import { useSelectionStore } from "../../stores/use-selection-store";
import { AppFontSize } from "../../utils/size";
import { DefaultAppStyles } from "../../utils/styles";
export const SearchBar = ({
  onChangeText,
  loading
}: {
  onChangeText: (value: string) => void;
  loading?: boolean;
}) => {
  const [clearButton, setClearButton] = useState(false);
  const selectionMode = useSelectionStore((state) => state.selectionMode);
  const isFocused = useNavigationStore(
    (state) => state.focusedRouteId === "Search"
  );
  const { colors } = useThemeColors();
  const inputRef = useRef<TextInput>(null);
  const _onChangeText = (value: string) => {
    onChangeText(value);
    setClearButton(!!value);
  };

  return selectionMode && isFocused ? null : (
    <View
      style={{
        width: "100%",
        paddingHorizontal: DefaultAppStyles.GAP
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          paddingHorizontal: DefaultAppStyles.GAP_SMALL,
          borderRadius: 10,
          borderColor: colors.primary.border,
          borderWidth: 1,
          paddingVertical: 3
        }}
      >
        <IconButton
          name="arrow-left"
          size={AppFontSize.xxl}
          top={10}
          bottom={10}
          onPress={() => {
            Navigation.goBack();
          }}
          color={colors.primary.paragraph}
          type="plain"
        />

        <TextInput
          ref={inputRef}
          testID="search-input"
          style={{
            fontSize: AppFontSize.sm,
            fontFamily: "Inter-Regular",
            flexGrow: 1,
            color: colors.primary.paragraph,
            paddingTop: 0,
            paddingBottom: 0
          }}
          autoFocus
          onChangeText={_onChangeText}
          placeholder={strings.typeAKeyword()}
          textContentType="none"
          returnKeyLabel={strings.search()}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor={colors.primary.placeholder}
        />

        {clearButton ? (
          <IconButton
            name="close"
            size={AppFontSize.xxl}
            top={10}
            testID="clear-search"
            bottom={10}
            onPress={() => {
              inputRef.current?.clear();
              onChangeText("");
              setClearButton(false);
            }}
            color={colors.primary.paragraph}
            type="plain"
          />
        ) : null}
      </View>
    </View>
  );
};
