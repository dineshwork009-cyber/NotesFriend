import { Flex, Text } from "@theme-ui/components";
import { Loading } from "../icons";

type LoaderProps = { title: string; text?: string };
export function Loader(props: LoaderProps) {
  const { title, text } = props;
  return (
    <Flex
      sx={{
        zIndex: 1,
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Loading rotate />
      <Text variant="subtitle" mt={4}>
        {title}
      </Text>
      {text && (
        <Text variant="body" mt={2}>
          {text}
        </Text>
      )}
    </Flex>
  );
}
