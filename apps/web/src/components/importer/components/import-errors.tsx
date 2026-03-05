import { Button, Flex, Text } from "@theme-ui/components";
import Accordion from "../../accordion";

type ImportErrorsProps = {
  errors: Error[];
};

export function ImportErrors(props: ImportErrorsProps) {
  return (
    <Accordion
      isClosed={false}
      title={`${props.errors.length} errors occured`}
      sx={{ bg: "background-error", borderRadius: "default", mt: 2 }}
      color="paragraph-error"
    >
      <Flex sx={{ flexDirection: "column", px: 2, pb: 2, overflowX: "auto" }}>
        {props.errors.map((error, index) => (
          <Text
            variant="body"
            sx={{ color: "paragraph-error", my: 1, fontFamily: "monospace" }}
          >
            {index + 1}. {error.message}
            <br />
          </Text>
        ))}
        <Button
          variant="error"
          sx={{ alignSelf: "start", mt: 2 }}
          onClick={() =>
            window.open(
              "https://github.com/streetwriters/notesnook-importer/issues/new",
              "_blank"
            )
          }
        >
          Send us a bug report
        </Button>
      </Flex>
    </Accordion>
  );
}
