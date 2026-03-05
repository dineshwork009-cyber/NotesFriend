import { useThemeColors } from "@notesfriend/theme";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { db } from "../../common/database";
import NotebookScreen from "../../screens/notebook";
import { eSendEvent, presentSheet } from "../../services/event-manager";
import { eClearEditor } from "../../utils/events";
import { AppFontSize } from "../../utils/size";
import { Button } from "../ui/button";
import Heading from "../ui/typography/heading";
import { Pressable } from "../ui/pressable";
import { strings } from "@notesfriend/intl";
import { DefaultAppStyles } from "../../utils/styles";

export default function Notebooks({ note, close, full }) {
  const { colors } = useThemeColors();
  const [noteNotebooks, setNoteNotebooks] = useState([]);
  useEffect(() => {
    async function getNotebooks() {
      let filteredNotebooks = await db.relations.to(note, "notebook").resolve();
      return filteredNotebooks || [];
    }
    getNotebooks().then((notebooks) => setNoteNotebooks(notebooks));
  }, []);

  const navigateNotebook = async (id) => {
    let item = await db.notebooks.notebook(id);
    if (!item) return;
    NotebookScreen.navigate(item, true);
  };

  const renderItem = (item) => (
    <Pressable
      key={item.id}
      onPress={() => {
        navigateNotebook(item.id);
        eSendEvent(eClearEditor);
        close();
      }}
      type={full ? "transparent" : "secondary"}
      style={{
        justifyContent: "flex-start",
        paddingHorizontal: DefaultAppStyles.GAP,
        flexDirection: "row",
        alignItems: "center",
        flexShrink: 1,
        flexGrow: 1,
        padding: DefaultAppStyles.GAP_SMALL,
        borderRadius: 10,
        minHeight: 42
      }}
    >
      <Icon
        name="book-outline"
        color={colors.primary.accent}
        size={AppFontSize.sm}
        style={{
          marginRight: 5
        }}
      />
      <Heading
        numberOfLines={1}
        style={{
          maxWidth: "50%"
        }}
        size={AppFontSize.sm}
      >
        {item.title}
      </Heading>
    </Pressable>
  );

  return noteNotebooks.length === 0 ? null : (
    <View
      style={{
        paddingHorizontal: DefaultAppStyles.GAP
      }}
    >
      <View
        style={{
          width: "100%",
          borderRadius: 10,
          marginTop: DefaultAppStyles.GAP_VERTICAL_SMALL
        }}
      >
        {full
          ? noteNotebooks.map(renderItem)
          : noteNotebooks.slice(0, 1).map(renderItem)}

        {noteNotebooks.length > 1 && !full ? (
          <Button
            title={strings.viewAllLinkedNotebooks()}
            fontSize={AppFontSize.xs}
            style={{
              alignSelf: "flex-end",
              marginRight: 12,
              paddingHorizontal: 0,
              backgroundColor: "transparent"
            }}
            type="plain"
            textStyle={{
              textDecorationLine: "underline"
            }}
            height={20}
            onPress={() => {
              presentSheet({
                context: "properties",
                component: (ref, close) => (
                  <Notebooks note={note} close={close} full={true} />
                )
              });
            }}
          />
        ) : undefined}
      </View>
    </View>
  );
}
