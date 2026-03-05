import { json, LoaderFunctionArgs } from "@remix-run/node";
import { cors } from "remix-utils/cors";
import { COMPATIBILITY_VERSION, INSTANCE_NAME } from "../utils/env";

export async function loader({ request }: LoaderFunctionArgs) {
  const response = json({
    version: COMPATIBILITY_VERSION,
    id: "monograph",
    instance: INSTANCE_NAME
  });
  return cors(request, response);
}
