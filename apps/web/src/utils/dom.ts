export const setDocumentTitle = (title?: string) => {
  if (!title) document.title = APP_TITLE;
  else document.title = `${title} - ${APP_TITLE}`;
};

export const getDocumentTitle = () => {
  if (document.title === APP_TITLE) return "";
  return document.title.replace(` - ${APP_TITLE}`, "");
};
