import { Language, useSpellChecker } from "../../../hooks/use-spell-checker";
import { Input, Label } from "@theme-ui/components";
import { useCallback, useEffect, useState } from "react";
import { deleteItem } from "@notesfriend/core";
import { FlexScrollContainer } from "../../../components/scroll-container";
import { strings } from "@notesfriend/intl";

export function SpellCheckerLanguages() {
  const spellChecker = useSpellChecker();
  const [enabledLanguages, setEnabledLanguages] = useState<string[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);

  useEffect(() => {
    if (!spellChecker.enabledLanguages || !spellChecker.languages) return;

    setEnabledLanguages(spellChecker.enabledLanguages.map((a) => a.code));
    setLanguages(spellChecker.languages.slice());
  }, [spellChecker.enabledLanguages, spellChecker.languages]);

  const filter = useCallback(
    async (query: string) => {
      if (!spellChecker.languages) return;
      setLanguages(
        spellChecker.languages.filter(
          (a) =>
            a.name.toLowerCase().includes(query) ||
            a.code.toLowerCase().includes(query)
        )
      );
    },
    [spellChecker]
  );

  return (
    <>
      <Input
        placeholder={strings.filterLanguages()}
        sx={{ mx: "2px", my: 2, width: "auto" }}
        onChange={(e) => filter(e.currentTarget.value.toLowerCase().trim())}
      />
      <FlexScrollContainer suppressAutoHide style={{ maxHeight: 400 }}>
        {languages.map((lang) => (
          <Label key={lang.code} variant="text.body" sx={{ mb: 1 }}>
            <input
              type="checkbox"
              style={{
                accentColor: "var(--accent)",
                marginRight: 1,
                width: 14,
                height: 14
              }}
              checked={enabledLanguages.includes(lang.code)}
              onChange={async (e) => {
                const { checked } = e.currentTarget;
                const copiedLanguages = enabledLanguages.slice();

                if (checked) copiedLanguages.push(lang.code);
                else deleteItem(copiedLanguages, lang.code);

                await spellChecker.setLanguages(copiedLanguages);
              }}
            />
            <span style={{ marginLeft: 5 }}>{lang.name}</span>
          </Label>
        ))}
      </FlexScrollContainer>
    </>
  );
}
