import { Editor } from "@tiptap/core";
import { countWords } from "alfaaz";

export function getTotalWords(editor: Editor): number {
  const documentText = editor.state.doc.textBetween(
    0,
    editor.state.doc.content.size,
    "\n",
    " "
  );
  return countWords(documentText);
}

export { countWords };
