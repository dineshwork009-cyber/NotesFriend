import { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  url.pathname += ".jpg";
  return Response.redirect(url, 308);
}
