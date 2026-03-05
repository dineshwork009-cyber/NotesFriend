import { desktop } from "../common/desktop-bridge";
import BaseStore from "../stores";
import createStore from "../common/store";

export type Language = { code: string; name: string };

class SpellCheckerStore extends BaseStore<SpellCheckerStore> {
  languages: Language[] = [];
  enabled = true;
  enabledLanguages: Language[] = [];
  words: string[] = [];

  toggleSpellChecker = async () => {
    const enabled = this.get().enabled;
    await desktop?.spellChecker.toggle.mutate({ enabled: !enabled });
    this.set({
      enabled: !enabled
    });
  };

  setLanguages = async (languages: string[]) => {
    await desktop?.spellChecker.setLanguages.mutate(languages);
    this.set({
      enabledLanguages: await desktop?.spellChecker.enabledLanguages.query()
    });
  };

  refresh = async () => {
    this.set({
      enabledLanguages:
        (await desktop?.spellChecker.enabledLanguages.query()) || [],
      languages: (await desktop?.spellChecker.languages.query()) || [],
      enabled: await desktop?.spellChecker.isEnabled.query(),
      words: (await desktop?.spellChecker.words.query()) || []
    });
  };

  deleteWord = async (word: string) => {
    await desktop?.spellChecker.deleteWord.mutate(word);
    await this.get().refresh();
  };
}

const [useSpellChecker] = createStore<SpellCheckerStore>(
  (set, get) => new SpellCheckerStore(set, get)
);
export { useSpellChecker };
