import { useThemeColors } from "@notesfriend/theme";
import React from "react";
import { useMessageStore } from "../../../stores/use-message-store";
import { RouteParams } from "../../../stores/use-navigation-store";
import { Announcement } from "../../announcements/announcement";
import { Card } from "../../list/card";

export type ListHeaderProps = {
  noAnnouncement?: boolean;
  color?: string;
  messageCard?: boolean;
  screen?: keyof RouteParams;
  shouldShow?: boolean;
};

export const Header = React.memo(
  ({
    messageCard = true,
    color,
    shouldShow = false,
    noAnnouncement,
    screen
  }: ListHeaderProps) => {
    const { colors } = useThemeColors();
    const announcements = useMessageStore((state) => state.announcements);

    return (
      <>
        {announcements.length !== 0 && !noAnnouncement ? (
          <Announcement />
        ) : (screen as any) === "Search" ? null : !shouldShow ? (
          <>
            {messageCard ? (
              <Card color={color || colors.primary.accent} />
            ) : null}
          </>
        ) : null}
      </>
    );
  }
);

Header.displayName = "Header";
