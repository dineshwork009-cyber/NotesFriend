import { Flex, FlexProps } from "@theme-ui/components";
import {
  getDefaultPresets,
  STATIC_TOOLBAR_GROUPS,
  MOBILE_STATIC_TOOLBAR_GROUPS,
  READONLY_MOBILE_STATIC_TOOLBAR_GROUPS
} from "./tool-definitions.js";
import { useEffect, useMemo } from "react";
import { Editor } from "../types.js";
import { ToolbarGroup } from "./components/toolbar-group.js";
import { EditorFloatingMenus } from "./floating-menus/index.js";
import {
  ToolbarLocation,
  useIsMobile,
  useToolbarStore
} from "./stores/toolbar-store.js";
import { ToolbarDefinition } from "./types.js";

type ToolbarProps = FlexProps & {
  editor: Editor;
  location: ToolbarLocation;
  tools?: ToolbarDefinition;
  defaultFontFamily: string;
  defaultFontSize: number;
};

export function Toolbar(props: ToolbarProps) {
  const {
    editor,
    location,
    tools = getDefaultPresets().default,
    defaultFontFamily,
    defaultFontSize,
    sx,
    className = "",
    ...flexProps
  } = props;
  const isMobile = useIsMobile();
  const toolbarTools = useMemo(
    () =>
      isMobile
        ? editor.isEditable
          ? [...MOBILE_STATIC_TOOLBAR_GROUPS, ...tools]
          : READONLY_MOBILE_STATIC_TOOLBAR_GROUPS
        : editor.isEditable
        ? [...STATIC_TOOLBAR_GROUPS, ...tools]
        : [],
    [tools, editor.isEditable, isMobile]
  );

  const setToolbarLocation = useToolbarStore(
    (store) => store.setToolbarLocation
  );
  const setDefaultFontFamily = useToolbarStore((store) => store.setFontFamily);
  const setDefaultFontSize = useToolbarStore((store) => store.setFontSize);

  useEffect(() => {
    setToolbarLocation(location);
  }, [location, setToolbarLocation]);

  useEffect(() => {
    setDefaultFontFamily(defaultFontFamily);
    setDefaultFontSize(defaultFontSize);
  }, [
    defaultFontFamily,
    defaultFontSize,
    setDefaultFontFamily,
    setDefaultFontSize
  ]);

  return (
    <>
      <Flex
        className={["editor-toolbar", className].join(" ")}
        sx={{
          flexWrap: isMobile ? "nowrap" : "wrap",
          overflowX: isMobile ? "auto" : "hidden",
          bg: "background",
          borderRadius: isMobile ? "0px" : "default",
          ...sx
        }}
        {...flexProps}
      >
        {toolbarTools.map((tools) => {
          return (
            <ToolbarGroup
              key={tools.join("")}
              tools={tools}
              editor={editor}
              groupId={tools.join("")}
              sx={{
                borderRight: "1px solid var(--separator)",
                ":last-of-type": { borderRight: "none" },
                alignItems: "center"
              }}
            />
          );
        })}
      </Flex>
      <EditorFloatingMenus editor={editor} />
    </>
  );
}
