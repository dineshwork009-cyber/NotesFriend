import { NodeWithOffset } from "../../../utils/prosemirror.js";
import { createContext, useContext } from "react";

const HoverPopupContext = createContext<{
  selectedNode?: NodeWithOffset;
  hide: () => void;
}>({ hide: () => {} });
export function useHoverPopupContext() {
  return useContext(HoverPopupContext);
}
export const HoverPopupContextProvider = HoverPopupContext.Provider;
