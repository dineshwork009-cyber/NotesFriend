import { EmotionThemeProvider } from "@notesfriend/theme";
import { Icon } from "@notesfriend/ui";
import { Button, Flex, Text } from "@theme-ui/components";
import { PropsWithChildren } from "react";
import { DesktopOnly, MobileOnly } from "../../components/responsive/index.js";
import { Icons } from "../icons.js";

type Action = {
  title: string;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
};
export type PopupProps = {
  title?: string;
  onClose?: () => void;
  onPin?: () => void;
  isPinned?: boolean;
  action?: Action;
};

export function Popup(props: PropsWithChildren<PopupProps>) {
  const { title, onClose, onPin, isPinned, action, children } = props;

  return (
    <EmotionThemeProvider scope="editorToolbar">
      <DesktopOnly>
        <Flex
          sx={{
            overflow: "hidden",
            bg: "background",
            flexDirection: "column",
            borderRadius: "default",
            // border: "1px solid var(--border)",
            boxShadow: "menu",
            minWidth: 200
          }}
        >
          {title && (
            <Flex
              className="movable"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                p: 2
              }}
            >
              <Text variant={"title"}>{title}</Text>
              <Flex sx={{ alignItems: "center", gap: 1 }}>
                {onPin ? (
                  <Button
                    variant={"secondary"}
                    sx={{ p: 0, bg: "transparent" }}
                    onClick={onPin}
                  >
                    <Icon
                      path={Icons.pin}
                      size={"medium"}
                      color={isPinned ? "accent" : "icon"}
                    />
                  </Button>
                ) : null}
                {onClose ? (
                  <Button
                    variant={"secondary"}
                    sx={{ p: 0, bg: "transparent" }}
                    onClick={onClose}
                  >
                    <Icon path={Icons.close} size={"big"} />
                  </Button>
                ) : null}
              </Flex>
            </Flex>
          )}
          {children}
          {title && action && (
            <Flex
              sx={{ justifyContent: "end" }}
              bg="var(--background-secondary)"
              p={1}
              px={2}
              mt={2}
            >
              <Button
                variant="dialog"
                onClick={
                  action.disabled || action.loading ? undefined : action.onClick
                }
                disabled={action.disabled || action.loading}
              >
                {action.loading ? (
                  <Icon path={Icons.loading} rotate size="medium" />
                ) : (
                  action.title
                )}
              </Button>
            </Flex>
          )}
        </Flex>
      </DesktopOnly>
      <MobileOnly>
        {children}

        {action && (
          <Button
            variant="accent"
            sx={{
              alignSelf: "stretch",
              mb: 1,
              mt: 2,
              mx: 1,
              py: 2
            }}
            onClick={action.disabled ? undefined : action?.onClick}
            disabled={action.disabled}
          >
            {action.loading ? (
              <Icon path={Icons.loading} rotate size="medium" />
            ) : (
              action.title
            )}
          </Button>
        )}
      </MobileOnly>
    </EmotionThemeProvider>
  );
}
