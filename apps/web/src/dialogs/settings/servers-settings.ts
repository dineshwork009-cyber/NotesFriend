import { strings } from "@notesfriend/intl";
import { ServersConfiguration } from "./components/servers-configuration";
import { SettingsGroup } from "./types";

export const ServersSettings: SettingsGroup[] = [
  {
    header: strings.serversConfiguration(),
    key: "servers",
    section: "servers",
    settings: [
      {
        key: "config",
        title: "",
        components: [
          {
            type: "custom",
            component: ServersConfiguration
          }
        ]
      }
    ]
  }
];
