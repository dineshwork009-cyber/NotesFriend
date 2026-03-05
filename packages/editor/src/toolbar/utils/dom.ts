import { createRoot } from "react-dom/client";

export function getToolbarElement() {
  return (
    (document.querySelector(".active .editor-toolbar") as HTMLElement) ||
    undefined
  );
}

export function getPopupContainer() {
  return (
    document.querySelector<HTMLElement>(".active .dialogContainer") ||
    document.body
  );
}

export function getEditorToolbarPopup() {
  return (document.querySelector(".editor-mobile-toolbar-popup") ||
    getToolbarElement()) as HTMLElement;
}

export function getEditorContainer() {
  return (document.querySelector(".active .editor") ||
    getPopupContainer()) as HTMLElement;
}

export function getEditorDOM() {
  return (document.querySelector(".active .ProseMirror") ||
    getEditorContainer()) as HTMLElement; // ProseMirror
}

export function getPopupRoot() {
  const container = getPopupContainer();
  const div = document.createElement("div");
  container.appendChild(div);
  return createRoot(div);
}
