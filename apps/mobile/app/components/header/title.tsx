import { useThemeColors } from "@notesfriend/theme";
import React, { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";
import {
  eSubscribeEvent,
  eUnSubscribeEvent
} from "../../services/event-manager";
import { eScrollEvent } from "../../utils/events";
import { AppFontSize } from "../../utils/size";
import Tag from "../ui/tag";
import Heading from "../ui/typography/heading";

export const Title = ({
  title,
  isHiddenOnRender,
  accentColor,
  isBeta,
  renderedInRoute,
  id
}: {
  title: string;
  isHiddenOnRender?: boolean;
  accentColor?: string;
  isBeta?: boolean;
  renderedInRoute?: string;
  id?: string;
}) => {
  const { colors } = useThemeColors();
  const [visible, setVisible] = useState(isHiddenOnRender);
  const isTag = title.startsWith("#");
  const onScroll = useCallback(
    (data: { x: number; y: number; id?: string; route: string }) => {
      if (data.route !== "Notebook") return;

      if (data.route !== renderedInRoute || data.id !== id) return;
      if (data.y > 150) {
        if (!visible) return;
        setVisible(false);
      } else {
        if (visible) return;
        setVisible(true);
      }
    },
    [id, renderedInRoute, visible]
  );

  useEffect(() => {
    eSubscribeEvent(eScrollEvent, onScroll);
    return () => {
      eUnSubscribeEvent(eScrollEvent, onScroll);
    };
  }, [visible, onScroll]);

  return (
    <>
      {!visible ? (
        <Heading
          numberOfLines={1}
          size={AppFontSize.lg}
          style={{
            flexWrap: "wrap",
            marginTop: Platform.OS === "ios" ? -1 : 0
          }}
          color={accentColor || colors.primary.heading}
        >
          {isTag ? (
            <Heading size={AppFontSize.xl} color={colors.primary.accent}>
              #
            </Heading>
          ) : null}
          {isTag ? title.slice(1) : title}{" "}
          <Tag
            visible={isBeta}
            text="BETA"
            style={{
              backgroundColor: "transparent"
            }}
            textColor={colors.primary.accent}
          />
        </Heading>
      ) : null}
    </>
  );
};
