const p = "process" in globalThis ? globalThis.process : ({ env: {} } as any);
export const API_HOST =
  import.meta.env.API_HOST || p.env.API_HOST || `https://api.notesfriend.com`;
export const PUBLIC_URL =
  import.meta.env.PUBLIC_URL ||
  p.env.PUBLIC_URL ||
  `http://localhost:${import.meta.env.PORT || p.env.PORT || 5173}`;
export const COMPATIBILITY_VERSION = 1;
export const INSTANCE_NAME = p.env.INSTANCE_NAME || "default";
