import { Button, Text } from "@theme-ui/components";
import { Icon } from "../icons/icon";
import { Icons } from "../icons";

type CheckListItemProps = {
  title: string;
  isSelected: boolean;
  onSelected: () => void;
  indentLevel?: number;
};

export function CheckListItem(props: CheckListItemProps) {
  const { title, onSelected, isSelected, indentLevel = 0 } = props;
  return (
    <Button
      onClick={onSelected}
      sx={{
        display: "flex",
        alignItems: "center",
        py: 1,
        px: 1,
        ml: indentLevel * 2,

        color: "paragraph",
        bg: "transparent",
        borderBottom: "1px solid",
        borderBottomColor: "border",
        borderRadius: 0,
        ":hover:not(:disabled)": {
          borderBottomColor: "accent"
        }
      }}
    >
      <Icon
        path={isSelected ? Icons.checkCircle : Icons.circle}
        color={isSelected ? "accent" : "paragraph"}
        size={16}
      />
      <Text
        sx={{
          fontSize: "13px",
          ml: 1,
          fontWeight: 400,
          color: "paragraph",
          textAlign: "left"
        }}
      >
        {title}
      </Text>
    </Button>
  );
}
