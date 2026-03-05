import useMediaQuery, { matchMediaQuery } from "./use-media-query";

const TABLET_MEDIA_QUERY = "(min-width: 480px) and (max-width: 1000px)";
export const useTablet = () => useMediaQuery(TABLET_MEDIA_QUERY);
export const isTablet = () => matchMediaQuery(TABLET_MEDIA_QUERY);
export default useTablet;
