import { strings } from "@notesfriend/intl";
import { CirclePartners } from "./components/circle-partners";
import { SettingsGroup } from "./types";

export const NotesfriendCircleSettings: SettingsGroup[] = [
  {
    header: strings.notesfriendCircle(),
    key: "notesfriend-circle",
    section: "circle",
    settings: [
      {
        key: "partners",
        title: "",
        description: strings.notesfriendCircleDesc(),
        components: [
          {
            type: "custom",
            component: CirclePartners
          }
        ]
      }
    ]
  }
];
