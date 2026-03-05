import { Button, Text } from "@theme-ui/components";
import { FlexScrollContainer } from "../../../components/scroll-container";
import { useSpellChecker } from "../../../hooks/use-spell-checker";
import { strings } from "@notesfriend/intl";

export function DictionaryWords() {
  const words = useSpellChecker((store) => store.words);
  const deleteWord = useSpellChecker((store) => store.deleteWord);

  return (
    <>
      <FlexScrollContainer
        suppressAutoHide
        style={{
          maxHeight: 400,
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Text variant="body" sx={{ my: 1 }}>
          {strings.customDictWords(words.length)}
        </Text>
        {words.map((word) => (
          <Button
            key={word}
            variant="menuitem"
            sx={{ textAlign: "left", p: 1 }}
            onClick={() => deleteWord(word)}
          >
            {word}
          </Button>
        ))}
      </FlexScrollContainer>
    </>
  );
}
