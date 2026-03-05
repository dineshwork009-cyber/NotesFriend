import SparkMD5 from "spark-md5";
import { createObjectId } from "./object-id.js";

export function getId(time?: number) {
  return createObjectId(time);
}

export function makeId(text: string) {
  return SparkMD5.hash(text);
}

export function makeSessionContentId(sessionId: string) {
  return sessionId + "_content";
}
