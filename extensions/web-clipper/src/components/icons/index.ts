import {
  mdiCheck,
  mdiChevronDown,
  mdiLoading,
  mdiPlus,
  mdiClose,
  mdiDeleteOutline,
  mdiDownloadOutline,
  mdiCheckboxMarkedOutline,
  mdiChevronUp,
  mdiChevronRight,
  mdiWeatherNight,
  mdiWeatherSunny,
  mdiCogOutline,
  mdiNewspaperVariantOutline,
  mdiTextBoxOutline,
  mdiFitToScreenOutline,
  mdiCursorDefaultClickOutline,
  mdiNewspaper,
  mdiMagnify,
  mdiViewDayOutline,
  mdiViewDashboardOutline,
  mdiArrowLeft,
  mdiCheckCircleOutline,
  mdiCircleOutline,
  mdiBookOutline,
  mdiBookmarkOutline,
  mdiPound
} from "@mdi/js";

export const Icons = {
  darkMode: mdiWeatherNight,
  lightMode: mdiWeatherSunny,
  settings: mdiCogOutline,
  search: mdiMagnify,

  fullPage: mdiNewspaper,
  article: mdiNewspaperVariantOutline,
  visible: mdiViewDayOutline,
  selection: mdiCursorDefaultClickOutline,

  bookmark: mdiBookmarkOutline,
  simplified: mdiTextBoxOutline,
  screenshot: mdiFitToScreenOutline,
  complete: mdiViewDashboardOutline,

  check: mdiCheck,
  checkbox: mdiCheckboxMarkedOutline,
  loading: mdiLoading,
  plus: mdiPlus,
  close: mdiClose,
  delete: mdiDeleteOutline,
  download: mdiDownloadOutline,
  chevronDown: mdiChevronDown,
  chevronUp: mdiChevronUp,
  chevronRight: mdiChevronRight,

  checkCircle: mdiCheckCircleOutline,
  circle: mdiCircleOutline,
  notebook: mdiBookOutline,
  topic: mdiBookmarkOutline,
  tag: mdiPound,

  none: "",
  back: mdiArrowLeft
};

export type IconNames = keyof typeof Icons;
