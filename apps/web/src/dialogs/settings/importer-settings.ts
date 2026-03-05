import { SettingsGroup } from "./types";
import { Importer } from "../../components/importer";

export const ImporterSettings: SettingsGroup[] = [
  {
    key: "importer",
    section: "importer",
    header: "Notesfriend Importer",
    settings: [
      {
        key: "import-notes",
        title: "",
        components: [
          {
            type: "custom",
            component: Importer
          }
        ]
      }
    ]
  }
];
