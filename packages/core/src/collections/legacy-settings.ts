import { getId } from "../utils/id.js";
import Database from "../api/index.js";
import { LegacySettingsItem } from "../types.js";
import { ICollection } from "./collection.js";

/**
 * @deprecated only kept here for migration purposes
 */
export class LegacySettings implements ICollection {
  name = "legacy-settings";
  private settings: LegacySettingsItem = {
    type: "settings",
    dateModified: 0,
    dateCreated: 0,
    id: getId()
  };
  constructor(private readonly db: Database) {}

  async init() {
    const settings = await this.db
      .storage()
      .read<LegacySettingsItem>("settings");
    if (settings) this.settings = settings;
  }

  get raw() {
    return this.settings;
  }

  /**
   * @deprecated only kept here for migration purposes
   */
  getAlias(id: string) {
    return this.settings.aliases && this.settings.aliases[id];
  }
}
