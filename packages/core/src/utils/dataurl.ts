import { parse, validate } from "@readme/data-urls";

function toObject(dataurl: string): { mimeType?: string; data?: string } {
  const result = parse(dataurl);
  if (!result) return {};
  return {
    mimeType: result.contentType,
    data: result.data
  };
}

function fromObject({ mimeType, data }: { mimeType: string; data: string }) {
  if (validate(data)) return data;
  return `data:${mimeType};base64,${data}`;
}

function isValid(url: string) {
  return validate(url);
}

const dataurl = { toObject, fromObject, isValid };
export default dataurl;
