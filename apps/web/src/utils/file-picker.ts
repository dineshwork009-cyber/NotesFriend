import { PAGE_VISIBILITY_CHANGE } from "./page-visibility";

type FilePickerOptions = { acceptedFileTypes: string; multiple?: boolean };

export function showFilePicker({
  acceptedFileTypes,
  multiple
}: FilePickerOptions): Promise<File[]> {
  return new Promise((resolve) => {
    PAGE_VISIBILITY_CHANGE.ignore = true;
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("multiple", `${multiple || false}`);
    input.setAttribute("accept", acceptedFileTypes);
    input.dispatchEvent(new MouseEvent("click"));
    input.oncancel = async function () {
      resolve([]);
    };
    input.onchange = async function () {
      if (!input.files) return resolve([]);
      resolve(Array.from(input.files));
    };
  });
}

export async function readFile(file: File): Promise<string> {
  const reader = new FileReader();
  return await new Promise<string>((resolve, reject) => {
    reader.addEventListener("load", (event) => {
      const text = event.target?.result as string;
      if (!text) return reject("FileReader failed to load file.");
      resolve(text);
    });
    reader.readAsText(file);
  });
}
