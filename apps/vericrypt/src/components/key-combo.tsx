import { Code } from "./code";

type KeyComboProps = { combo: string[] };
export function KeyCombo(props: KeyComboProps) {
  return (
    <>
      {props.combo.map((key, index) => (
        <>
          <Code text={key} />
          {index < props.combo.length - 1 ? " + " : ""}
        </>
      ))}
    </>
  );
}
