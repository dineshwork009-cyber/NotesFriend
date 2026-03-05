import { Check, Cross } from "../../components/icons";

export function FeatureCaption({
  caption
}: {
  caption: boolean | number | string;
}) {
  return typeof caption === "boolean" ? (
    caption ? (
      <Check size={14} />
    ) : (
      <Cross size={14} />
    )
  ) : caption === "infinity" ? (
    "∞"
  ) : (
    caption
  );
}
