import {
  IProvider,
  ProviderFactory,
  Providers
} from "@notesnook-importer/core";
import { Flex, Text } from "@theme-ui/components";

type ProviderSelectorProps = {
  onProviderChanged: (provider: IProvider) => void;
};

export function ProviderSelector(props: ProviderSelectorProps) {
  return (
    <Flex
      sx={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "start",
        gap: 4
      }}
    >
      <Flex sx={{ flexDirection: "column", flex: 1 }}>
        <Text variant="subtitle">Select a notes app to import from</Text>
        <Text
          variant="body"
          as="div"
          sx={{ mt: 1, color: "paragraph", whiteSpace: "pre-wrap" }}
        >
          Can&apos;t find your notes app in the list?{" "}
          <a
            href="https://github.com/streetwriters/notesnook-importer/issues/new"
            target="_blank"
          >
            Send us a request.
          </a>
        </Text>
      </Flex>
      <select
        style={{
          backgroundColor: "var(--background-secondary)",
          outline: "none",
          border: "1px solid var(--border-secondary)",
          borderRadius: "5px",
          color: "var(--paragraph)",
          padding: "5px",
          overflow: "hidden"
        }}
        onChange={(e) => {
          if (e.target.value === "") return;
          const providerName: Providers = e.target.value as Providers;
          props.onProviderChanged(ProviderFactory.getProvider(providerName));
        }}
      >
        <option value="">Select notes app</option>
        {ProviderFactory.getAvailableProviders().map((provider) => (
          <option key={provider} value={provider}>
            {ProviderFactory.getProvider(provider as Providers).name}
          </option>
        ))}
      </select>
    </Flex>
  );
}
