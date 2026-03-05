import {
  INetworkProvider,
  ProviderSettings,
  transform
} from "@notesnook-importer/core";
import { ScrollContainer } from "@notesfriend/ui";
import { Button, Flex, Text } from "@theme-ui/components";
import { xxhash64 } from "hash-wasm";
import { useRef, useState } from "react";
import { importNote } from "../../../utils/importer";
import Accordion from "../../accordion";
import { TransformResult } from "../types";

type NetworkProviderHandlerProps = {
  provider: INetworkProvider<ProviderSettings>;
  onTransformFinished: (result: TransformResult) => void;
};

type Progress = {
  total: number;
  done: number;
};

function getProviderSettings(
  provider: INetworkProvider<ProviderSettings>,
  settings: ProviderSettings
) {
  return settings;
}

export function NetworkProviderHandler(props: NetworkProviderHandlerProps) {
  const { provider, onTransformFinished } = props;
  const [totalNoteCount, setTotalNoteCount] = useState(0);
  const [_, setCounter] = useState<number>(0);
  const logs = useRef<string[]>([]);

  async function onStartImport() {
    let totalNotes = 0;
    const settings = getProviderSettings(provider, {
      clientType: "browser",
      hasher: { type: "xxh64", hash: xxhash64 },
      storage: {
        clear: async () => undefined,
        get: async () => [],
        write: async (data) => {
          logs.current.push(
            `[${new Date().toLocaleString()}] Pushing ${
              data.title
            } into database`
          );

          await importNote(data);
        },
        iterate: async function* () {
          return null;
        }
      },
      log: (message) => {
        logs.current.push(
          `[${new Date(message.date).toLocaleString()}] ${message.text}`
        );
        setCounter((s) => ++s);
      },
      reporter: () => {
        setTotalNoteCount(++totalNotes);
      }
    });
    if (!settings) return;

    setTotalNoteCount(0);

    const errors = await transform(provider, settings);
    console.log(errors);
    onTransformFinished({
      totalNotes,
      errors
    });
  }

  return (
    <Flex
      sx={{
        flexDirection: "column",
        alignItems: "stretch"
      }}
    >
      {totalNoteCount ? (
        <>
          <Text variant="title">Importing your notes from {provider.name}</Text>
          <Text variant="body" sx={{ mt: 4 }}>
            Found {totalNoteCount} notes
          </Text>
          {logs.current.length > 0 && (
            <Accordion
              isClosed={false}
              title="Logs"
              sx={{
                border: "1px solid var(--border)",
                mt: 2
              }}
            >
              <ScrollContainer>
                <Text
                  as="pre"
                  variant="body"
                  sx={{
                    fontFamily: "monospace",
                    maxHeight: 250,
                    p: 2
                  }}
                >
                  {logs.current.map((c, index) => (
                    <>
                      <span key={index.toString()}>{c}</span>
                      <br />
                    </>
                  ))}
                </Text>
              </ScrollContainer>
            </Accordion>
          )}
        </>
      ) : (
        <>
          <Text variant="title">Connect your {provider.name} account</Text>
          <Text variant="body" sx={{ color: "fontTertiary", mt: [2, 0] }}>
            Check out our step-by-step guide on{" "}
            <a href={provider.helpLink} target="_blank" rel="noreferrer">
              how to import from {provider.name}.
            </a>
          </Text>
          <Button
            variant="accent"
            onClick={onStartImport}
            sx={{ my: 4, alignSelf: "center" }}
          >
            Start importing
          </Button>
        </>
      )}
    </Flex>
  );
}
