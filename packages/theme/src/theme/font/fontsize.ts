export function getFontSizes(): FontSizes {
  return {
    heading: "24px",
    subheading: "20px",
    input: "12px",
    title: "16px",
    subtitle: "14px",
    body: "12px",
    subBody: "10px",
    menu: "12px",
    code: "14px"
  };
}

export type FontSizes = {
  heading: string;
  subheading: string;
  input: string;
  title: string;
  subtitle: string;
  body: string;
  menu: string;
  subBody: string;
  code: string;
};
