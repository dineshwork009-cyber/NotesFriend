import useMediaQuery, { matchMediaQuery } from "./use-media-query";

const MOBILE_MEDIA_QUERY = "(max-width: 480px)";
export const useMobile = () => useMediaQuery(MOBILE_MEDIA_QUERY);
export const isMobile = () => matchMediaQuery(MOBILE_MEDIA_QUERY);
export default useMobile;
