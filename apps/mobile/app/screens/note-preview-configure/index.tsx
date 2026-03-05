import { Note, VirtualizedGrouping } from "@notesfriend/core";
import { useThemeColors } from "@notesfriend/theme";
import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { db } from "../../common/database";
import { Header } from "../../components/header";
import Input from "../../components/ui/input";
import Paragraph from "../../components/ui/typography/paragraph";
import { useDBItem } from "../../hooks/use-db-item";
import useGlobalSafeAreaInsets from "../../hooks/use-global-safe-area-insets";
import { useSettingStore } from "../../stores/use-setting-store";
import { NotesfriendModule } from "../../utils/notesfriend-module";
import { DefaultAppStyles } from "../../utils/styles";
import { SafeAreaView } from "react-native-safe-area-context";

const NoteItem = (props: {
  id: string | number;
  items?: VirtualizedGrouping<Note>;
}) => {
  const { colors } = useThemeColors();
  const [item] = useDBItem(props.id, "note", props.items);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        const widgetId = NotesfriendModule.getWidgetId();
        NotesfriendModule.setString(
          "appPreview",
          String(widgetId),
          JSON.stringify(item)
        );
        setTimeout(() => {
          NotesfriendModule.saveAndFinish();
        });
      }}
      style={{
        flexDirection: "column",
        borderBottomWidth: 1,
        borderBottomColor: colors.primary.border,
        justifyContent: "center",
        paddingVertical: DefaultAppStyles.GAP_VERTICAL,
        minHeight: 45
      }}
    >
      {!item ? null : (
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: DefaultAppStyles.GAP
          }}
        >
          <View
            style={{
              flexDirection: "column"
            }}
          >
            <Paragraph
              numberOfLines={1}
              style={{
                color: colors.primary.paragraph,
                fontSize: 15
              }}
            >
              {item.title}
            </Paragraph>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export const NotePreviewConfigure = () => {
  const [items, setItems] = useState<VirtualizedGrouping<Note>>();
  const loading = useSettingStore((state) => state.isAppLoading);
  const bounceRef = React.useRef<NodeJS.Timeout>(undefined);
  const { colors } = useThemeColors();
  const insets = useGlobalSafeAreaInsets();

  useEffect(() => {
    useSettingStore.getState().setDeviceMode("mobile");
    if (loading) return;
    db.notes.all.sorted(db.settings.getGroupOptions("notes")).then((notes) => {
      setItems(notes);
    });
  }, [loading]);

  const renderItem = React.useCallback(
    ({ index }: { item: boolean; index: number }) => {
      return <NoteItem id={index} items={items} />;
    },
    [items]
  );

  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.primary.background,
        flex: 1
      }}
    >
      <Header
        canGoBack
        title="Select a note"
        onLeftMenuButtonPress={() => {
          NotesfriendModule.cancelAndFinish();
        }}
      />

      <View
        style={{
          paddingHorizontal: DefaultAppStyles.GAP,
          paddingTop: 6
        }}
      >
        <Input
          placeholder="Search for notes"
          containerStyle={{
            height: 50
          }}
          onChangeText={(value) => {
            bounceRef.current = setTimeout(() => {
              if (!value) {
                db.notes.all
                  .sorted(db.settings.getGroupOptions("notes"))
                  .then((notes) => {
                    setItems(notes);
                  });
                return;
              }
              db.lookup
                .notes(value)
                .sorted()
                .then((notes) => {
                  setItems(notes);
                });
            }, 500);
          }}
        />

        <FlatList
          data={items?.placeholders}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          renderItem={renderItem}
          windowSize={1}
          ListFooterComponent={<View style={{ height: 200 }} />}
        />
      </View>
    </SafeAreaView>
  );
};
