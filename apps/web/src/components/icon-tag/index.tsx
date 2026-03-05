import { Flex, Text } from "@theme-ui/components";
import { ThemeUICSSObject } from "@theme-ui/core";
import { Close, Icon } from "../icons";
import { strings } from "@notesfriend/intl";

type IconTagProps = {
  text: string;
  title?: string;
  icon: Icon;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  styles?: {
    icon?: ThemeUICSSObject;
    container?: ThemeUICSSObject;
    text?: ThemeUICSSObject;
  };
  testId?: string;
  highlight?: boolean;
  onDismiss?: () => void;
};

function IconTag(props: IconTagProps) {
  const {
    icon: Icon,
    text,
    title,
    onClick,
    onDismiss,
    styles,
    testId,
    highlight
  } = props;

  return (
    <Flex
      data-test-id={testId}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick(e);
        }
      }}
      title={title || text}
      sx={{
        borderRadius: "default",
        border: "1px solid",
        borderColor: "border",
        lineHeight: "initial",
        ":hover": onClick
          ? {
              bg: "hover",
              filter: "brightness(95%)"
            }
          : {},
        maxWidth: "100%",
        px: 1,
        // mr: 1,
        cursor: onClick ? "pointer" : "default",
        overflow: "hidden",
        ...styles?.container,
        flexShrink: 0,
        alignItems: "center",
        justifyContent: "center"
      }}
      bg="var(--background-secondary)"
      py="2px"
    >
      <Icon
        size={11}
        color={highlight ? "accent" : "icon"}
        sx={{ ...styles?.icon, flexShrink: 0 }}
      />
      <Text
        variant="body"
        sx={{
          fontSize: 11,
          ml: "2px",
          p: 0,
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
          color: highlight ? "accent" : "paragraph",
          ...styles?.text
        }}
      >
        {text}
      </Text>
      {onDismiss && (
        <Close
          size={12}
          title={strings.remove()}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDismiss();
          }}
          sx={{
            ml: 1,
            ":hover": { bg: "background-error" },
            ":hover path": { fill: "var(--icon-error) !important" }
          }}
        />
      )}
    </Flex>
  );
}
export default IconTag;
