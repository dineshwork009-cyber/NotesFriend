import { Editor, TiptapOptions, Toolbar, useTiptap } from "@notesfriend/editor";
import { useEffect } from "react";
import { useTabContext } from "../hooks/useTabStore";
import { EmotionEditorToolbarTheme } from "../theme-factory";
import { Settings } from "../utils";
export default function TiptapEditorWrapper(props: {
  options: Partial<TiptapOptions>;
  onEditorUpdate: (editor: Editor) => void;
  settings: Settings;
}) {
  const tab = useTabContext();
  const editor = useTiptap(props.options, [props.options]);
  globalThis.editors[tab.id] = editor;

  useEffect(() => {
    props.onEditorUpdate(editor);
  }, [editor, props]);

  return (
    <>
      {tab.session?.locked ? null : (
        <EmotionEditorToolbarTheme>
          <Toolbar
            className="theme-scope-editorToolbar"
            sx={{
              display: props.settings.noToolbar ? "none" : "flex",
              overflowY: "hidden",
              minHeight: "45px",
              ...(globalThis.__PLATFORM__ === "ios" && {
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0
              })
            }}
            editor={editor}
            location="bottom"
            tools={
              Array.isArray(props.settings.tools)
                ? [...props.settings.tools]
                : []
            }
            defaultFontFamily={props.settings.fontFamily}
            defaultFontSize={props.settings.fontSize}
          />
        </EmotionEditorToolbarTheme>
      )}
    </>
  );
}
