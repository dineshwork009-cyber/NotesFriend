import { Button, Flex } from "@theme-ui/components";
import { useMenuTrigger } from "../../hooks/use-menu";
import { ChevronDown } from "../icons";

export default function DropdownButton(props) {
  const { openMenu } = useMenuTrigger();
  const { options, title, sx, buttonStyle, chevronStyle } = props;

  if (!options || !options.length) return null;
  return (
    <Flex sx={sx}>
      <Button
        sx={{
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          ...buttonStyle
        }}
        onClick={options[0].onClick}
      >
        {options[0].title()}
      </Button>
      {options.length > 1 && (
        <Button
          px={1}
          sx={{
            borderBottomLeftRadius: 0,
            borderTopLeftRadius: 0,
            ...chevronStyle
          }}
          onClick={() => openMenu(options.slice(1), { title })}
        >
          <ChevronDown color="white" size={18} />
        </Button>
      )}
    </Flex>
  );
}
