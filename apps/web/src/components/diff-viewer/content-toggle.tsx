import { Flex, Button, Text, FlexProps } from "@theme-ui/components";
import { getFormattedDate } from "@notesfriend/common";
import { strings } from "@notesfriend/intl";

type ContentToggle = {
  isSelected: boolean;
  isOtherSelected: boolean;
  onToggle: () => void;
  label: string;
  dateEdited: number;
  resolveConflict: (saveCopy: boolean) => void;
  readonly: boolean;
  sx: FlexProps["sx"];
};
function ContentToggle(props: ContentToggle) {
  const {
    isSelected,
    isOtherSelected,
    onToggle,
    label,
    dateEdited,
    resolveConflict,
    readonly,
    sx
  } = props;

  return (
    <Flex sx={{ ...sx, flexDirection: "column" }}>
      {!readonly && (
        <Flex>
          {isOtherSelected && (
            <Button
              variant="accent"
              mr={2}
              onClick={() => resolveConflict(true)}
              p={1}
              px={2}
            >
              {strings.saveACopy()}
            </Button>
          )}
          <Button
            variant={isOtherSelected ? "error" : "accent"}
            onClick={() => {
              if (isOtherSelected) {
                resolveConflict(false);
              } else {
                onToggle();
              }
            }}
            p={1}
            px={2}
          >
            {isSelected
              ? strings.undo()
              : isOtherSelected
              ? strings.discard()
              : strings.keep()}
          </Button>
        </Flex>
      )}
      <Text variant="subBody" mt={1}>
        {label} | {getFormattedDate(dateEdited)}
      </Text>
    </Flex>
  );
}
export default ContentToggle;
