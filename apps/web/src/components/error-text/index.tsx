import { Flex, FlexProps, Text } from "@theme-ui/components";

import { Error as ErrorIcon } from "../icons";

type ErrorTextProps = { error?: string | Error | null | false } & FlexProps;
export function ErrorText(props: ErrorTextProps) {
  const { error, sx, ...restProps } = props;

  if (!error) return null;
  return (
    <Flex
      bg="var(--background-error)"
      p={1}
      sx={{
        borderRadius: "default",
        alignItems: "flex-start",
        maxHeight: 300,
        overflowY: "auto",
        ...sx
      }}
      {...restProps}
    >
      <ErrorIcon size={15} color="var(--icon-error)" />
      <Text
        className="selectable"
        variant={"error"}
        ml={1}
        sx={{ whiteSpace: "pre-wrap" }}
      >
        {error instanceof Error ? (
          <>
            {error.name}: {error.message}
            <br />
            {error.stack}
          </>
        ) : (
          error
        )}
      </Text>
    </Flex>
  );
}
