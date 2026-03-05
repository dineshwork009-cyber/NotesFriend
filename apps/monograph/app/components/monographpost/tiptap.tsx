import { useTiptap } from "@notesfriend/editor";
import { writeToClipboard } from "./clipboard";

export type TipTapProps = {
  editorContainer: () => HTMLElement;
  onLoad?: () => void;
  content: string;
};

export default function TipTap(props: TipTapProps) {
  const { onLoad, content, editorContainer } = props;
  useTiptap(
    {
      isMobile: false,
      element: editorContainer(),
      editable: false,
      content,
      onCreate: () => {
        if (onLoad) onLoad();
      },
      copyToClipboard(text, html) {
        writeToClipboard({"text/plain": text, "text/html": html});
      },
    },
    []
  );
  return null;
}
