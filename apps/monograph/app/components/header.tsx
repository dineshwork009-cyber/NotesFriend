import { Button, Flex, Text } from "@theme-ui/components";

export function Header() {
  return (
    <Flex
      sx={{
        bg: "background-secondary",
        borderBottom: "1px solid var(--border)",
        p: 2,
        px: [2, "15%"],
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <Text
        sx={{
          fontFamily: "monospace",
          fontSize: 22
        }}
      >
        <span style={{ color: "var(--accent)" }}>Mono</span>graph
      </Text>
      <Button
        as="a"
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        href="https://app.notesfriend.com/"
        target="_blank"
        variant="accent"
      >
        Publish a note
      </Button>
    </Flex>
  );
}
