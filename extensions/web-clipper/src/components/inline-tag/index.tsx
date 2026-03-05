import { Flex, Text } from "@theme-ui/components";
import { Icon } from "../icons/icon";
import { SchemeColors } from "@notesfriend/theme";

export function InlineTag(props: {
  title: string;
  icon: string;
  iconColor?: SchemeColors;
  onClick: () => void;
}) {
  const { title, icon, onClick, iconColor = "icon" } = props;

  return (
    <Flex
      onClick={onClick}
      sx={{
        alignItems: "center",
        justifyContent: "center",
        bg: "var(--background-secondary)",
        border: "1px solid var(--border)",
        borderRadius: "small",
        p: "3px",
        pr: 1,
        cursor: "pointer",
        ":hover": {
          bg: "hover"
        }
      }}
    >
      <Icon path={icon} color={iconColor} size={14} />
      <Text variant="subBody" sx={{ ml: 1 }}>
        {title}
      </Text>
    </Flex>
  );
}
