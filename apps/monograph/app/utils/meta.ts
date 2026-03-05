import { ServerRuntimeMetaDescriptor } from "@remix-run/server-runtime";

type MetaProps = {
  titleFull: string;
  titleShort?: string;
  description?: string;
  url?: string;
  imageUrl?: string;
  imageAlt?: string;
  publishedAt?: string;
  type: "website" | "article";
};

export function generateMetaDescriptors(
  props: MetaProps
): ServerRuntimeMetaDescriptor[] {
  const descriptors: ServerRuntimeMetaDescriptor[] = [];

  descriptors.push({ title: props.titleFull });

  if (props.description)
    descriptors.push({ name: "description", content: props.description });

  if (props.imageUrl)
    descriptors.push({ name: "og:image", content: props.imageUrl });
  descriptors.push({
    name: "og:title",
    content: props.titleShort || props.titleFull
  });
  if (props.imageAlt || props.description)
    descriptors.push({
      name: "og:image:alt",
      content: props.imageAlt || props.description
    });
  if (props.url) descriptors.push({ name: "og:url", content: props.url });
  descriptors.push({ name: "og:type", content: props.type });
  descriptors.push({ name: "og:site_name", content: "Monograph" });
  if (props.publishedAt)
    descriptors.push({
      name: "article:published_time",
      content: props.publishedAt
    });

  descriptors.push({ name: "author", content: "Monograph" });
  descriptors.push({ name: "twitter:card", content: "summary_large_image" });
  descriptors.push({ name: "twitter:site", content: "@notesfriend" });
  descriptors.push({ name: "twitter:creator", content: "@notesfriend" });
  descriptors.push({ name: "twitter:title", content: props.titleShort });
  descriptors.push({ name: "twitter:description", content: props.description });
  if (props.imageUrl)
    descriptors.push({ name: "twitter:image", content: props.imageUrl });

  return descriptors;
}
