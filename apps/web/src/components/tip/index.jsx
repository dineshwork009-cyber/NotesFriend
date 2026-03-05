import { Text } from "@theme-ui/components";

function TextWithTip({ text, tip, sx, color }) {
  return (
    <Text sx={{ ...sx, fontSize: "body", color: color || "paragraph" }}>
      {text}
      <br />
      <Text
        variant="subBody"
        sx={{
          wordBreak: "break-word",
          whiteSpace: "pre-wrap"
        }}
      >
        {tip}
      </Text>
    </Text>
  );
}
export default TextWithTip;
