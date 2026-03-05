import { Box } from "@theme-ui/components";

export function MenuSeparator() {
  return (
    <Box
      as="li"
      sx={{
        width: "94%",
        marginLeft: "3%",
        height: "1px",
        bg: "separator",
        my: 1,
        alignSelf: "center"
      }}
    />
  );
}
