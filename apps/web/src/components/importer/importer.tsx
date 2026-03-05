import { Flex } from "@theme-ui/components";
import { useState } from "react";
import { ProviderSelector } from "./components/provider-selector";
import { FileProviderHandler } from "./components/file-provider-handler";
import { ImportResult } from "./components/import-result";
import { IProvider } from "@notesnook-importer/core";
import { NetworkProviderHandler } from "./components/network-provider-handler";
import { TransformResult } from "./types";

export function Importer() {
  const [selectedProvider, setSelectedProvider] = useState<IProvider>();
  const [transformResult, setTransformResult] = useState<TransformResult>();
  const [instanceKey, setInstanceKey] = useState<string>(`${Math.random()}`);

  return (
    <Flex sx={{ flexDirection: "column" }}>
      <Flex
        sx={{
          flexDirection: "column",
          alignItems: "stretch",
          gap: 4
        }}
      >
        <ProviderSelector
          onProviderChanged={(provider) => {
            setInstanceKey(`${Math.random()}`);
            setSelectedProvider(provider);
            setTransformResult(undefined);
          }}
        />
        {selectedProvider ? (
          <>
            {selectedProvider.type === "file" ? (
              <FileProviderHandler
                key={instanceKey}
                provider={selectedProvider}
                onTransformFinished={setTransformResult}
              />
            ) : selectedProvider.type === "network" ? (
              <NetworkProviderHandler
                key={instanceKey}
                provider={selectedProvider}
                onTransformFinished={setTransformResult}
              />
            ) : null}
          </>
        ) : null}
        {transformResult && selectedProvider ? (
          <>
            <ImportResult
              result={transformResult}
              provider={selectedProvider}
              onReset={() => {
                setTransformResult(undefined);
                setInstanceKey(`${Math.random()}`);
              }}
            />
          </>
        ) : null}
      </Flex>
    </Flex>
  );
}
