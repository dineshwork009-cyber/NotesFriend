import { ThemeUIStyleObject } from "@theme-ui/core";

const defaultVariant: ThemeUIStyleObject = {
  color: "paragraph",
  fontFamily: "body"
};

const heading: ThemeUIStyleObject = {
  variant: "text.default",
  color: "heading",
  fontFamily: "heading",
  fontWeight: "bold",
  fontSize: "heading"
};

const title: ThemeUIStyleObject = {
  variant: "text.heading",
  color: "heading",
  fontSize: "title",
  fontWeight: "bold"
};

const subtitle: ThemeUIStyleObject = {
  variant: "text.heading",
  color: "heading",
  fontSize: "subtitle",
  fontWeight: "bold"
};

const body: ThemeUIStyleObject = { variant: "text.default", fontSize: "body" };

const subBody: ThemeUIStyleObject = {
  variant: "text.default",
  fontSize: "subBody",
  color: "paragraph-secondary"
};

const error: ThemeUIStyleObject = {
  variant: "text.default",
  fontSize: "subBody",
  color: "paragraph-error"
};

export const textVariants = {
  default: defaultVariant,
  heading,
  title,
  subtitle,
  body,
  subBody,
  error
};
