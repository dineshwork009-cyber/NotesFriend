import { Flex, Switch, Text } from "@theme-ui/components";
import { Icon } from "../icons";

type ToggleProps = {
  icon: Icon;
  label: string;
  onToggle: (toggleState: boolean) => void;
  isOn: boolean;
  testId?: string;
};
function Toggle(props: ToggleProps) {
  const { icon: ToggleIcon, label, onToggle, isOn } = props;

  return (
    <Flex
      sx={{
        cursor: "pointer",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,

        "& label": { width: "auto", flexShrink: 0 }
      }}
      data-test-id={props.testId}
      onClick={() => onToggle(!isOn)}
    >
      <Flex
        sx={{
          alignItems: "center",
          display: "flex"
        }}
        data-test-id={`toggle-state-${isOn ? "on" : "off"}`}
      >
        <ToggleIcon size={13} sx={{ flexShrink: 0, mr: 1 }} />
        <Text
          variant="body"
          sx={{
            color: "paragraph",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
        >
          {label}
        </Text>
      </Flex>
      <Switch
        sx={{
          m: 0,
          bg: isOn ? "accent" : "icon-secondary",
          flexShrink: 0,
          scale: 0.75
        }}
        checked={isOn}
        onClick={(e) => e.stopPropagation()}
      />
    </Flex>
  );
}
export default Toggle;
