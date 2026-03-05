import type { ToolId } from "@notesfriend/editor";
import React, { RefObject } from "react";
import { View } from "react-native";
import { Pressable } from "../../../components/ui/pressable";
import { SvgView } from "../../../components/ui/svg";
import Paragraph from "../../../components/ui/typography/paragraph";
import { presentSheet } from "../../../services/event-manager";
import { useThemeColors } from "@notesfriend/theme";
import { defaultBorderRadius, AppFontSize } from "../../../utils/size";
import { DraggableItem, useDragState } from "./state";
import {
  findToolById,
  getToolIcon,
  getUngroupedTools
} from "./toolbar-definition";
import { ActionSheetRef, ScrollView } from "react-native-actions-sheet";
import { strings } from "@notesfriend/intl";
import { DefaultAppStyles } from "../../../utils/styles";

export default function ToolSheet({
  group,
  fwdRef
}: {
  group: DraggableItem;
  fwdRef: RefObject<ActionSheetRef>;
}) {
  const { colors } = useThemeColors();
  const data = useDragState((state) => state.data);
  const ungrouped = getUngroupedTools(data) as ToolId[];

  const renderTool = React.useCallback(
    (item: ToolId) => {
      const tool = findToolById(item);
      const iconSvgString = tool
        ? getToolIcon(tool.icon as ToolId, colors.secondary.icon)
        : null;
      if (item === "none") return;
      return (
        <Pressable
          key={item}
          type="secondary"
          onPress={() => {
            const _data = useDragState.getState().data.slice();
            if (group.groupIndex !== undefined) {
              (_data[group.groupIndex][group.index] as ToolId[]).unshift(
                item as ToolId
              );
            } else {
              _data[group.index].unshift(item);
            }
            useDragState.getState().setData(_data);
          }}
          style={{
            marginBottom: DefaultAppStyles.GAP_VERTICAL,
            width: "100%",
            height: 50,
            paddingHorizontal: DefaultAppStyles.GAP,
            paddingRight: 0,
            borderRadius: defaultBorderRadius,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start"
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            {iconSvgString ? (
              <SvgView width={23} height={23} src={iconSvgString} />
            ) : null}
            <Paragraph
              style={{
                marginLeft: iconSvgString ? 10 : 0
              }}
              color={colors.primary.paragraph}
              size={AppFontSize.sm}
            >
              {tool?.title}
            </Paragraph>
          </View>
        </Pressable>
      );
    },
    [
      colors.primary.paragraph,
      colors.secondary.icon,
      group.groupIndex,
      group.index
    ]
  );

  return (
    <View
      style={{
        maxHeight: "100%",
        padding: DefaultAppStyles.GAP
      }}
    >
      <ScrollView nestedScrollEnabled={true}>
        {!ungrouped || ungrouped.length === 0 ? (
          <Paragraph
            style={{
              alignSelf: "center"
            }}
            color={colors.secondary.paragraph}
          >
            {strings.groupedAllTools()}
          </Paragraph>
        ) : (
          ungrouped.map(renderTool)
        )}
        <View
          style={{
            height: 200
          }}
        />
      </ScrollView>
    </View>
  );
}

ToolSheet.present = (payload: DraggableItem) => {
  presentSheet({
    component: (ref) => <ToolSheet fwdRef={ref} group={payload} />
  });
};
