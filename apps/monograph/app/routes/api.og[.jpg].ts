import { LoaderFunctionArgs } from "@remix-run/node";
import { makeImage } from "../utils/generate-og-image.server";
import { formatDate } from "@notesfriend/core";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const title = url.searchParams.get("title") || "Not found";
  const description = url.searchParams.get("description") || "";
  const date =
    url.searchParams.get("date") ||
    formatDate(new Date(), {
      type: "date-time",
      dateFormat: "YYYY-MM-DD",
      timeFormat: "24-hour"
    });

  return new Response(
    await makeImage(
      {
        date,
        description,
        title
      },
      url.search
    ),
    {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg"
      }
    }
  );
}
