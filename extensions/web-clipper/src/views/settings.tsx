import { Button, Flex, Input, Label, Text } from "@theme-ui/components";
import { Icons } from "../components/icons";
import { Icon } from "../components/icons/icon";
import { usePersistentState } from "../hooks/use-persistent-state";
import { useAppStore } from "../stores/app-store";
import type { Config } from "@notesfriend/clipper/dist/types";

export const SETTINGS_KEY = "settings";
export const DEFAULT_SETTINGS: Config = {
  corsProxy: "https://cors.notesfriend.com",
  images: true,
  inlineImages: true
};

export function Settings() {
  const navigate = useAppStore((s) => s.navigate);
  const [settings, saveSettings] = usePersistentState<Config>(
    SETTINGS_KEY,
    DEFAULT_SETTINGS
  );

  return (
    <Flex
      sx={{
        flexDirection: "column",
        p: 2,
        width: 320,
        backgroundColor: "background"
      }}
      as="form"
      onSubmit={async (e) => {
        e.preventDefault();

        const form = new FormData(e.target as HTMLFormElement);

        let corsProxy = form.get("corsProxy")?.toString();
        if (corsProxy) {
          const url = new URL(corsProxy);
          corsProxy = `${url.protocol}//${url.hostname}`;
        }

        await browser.permissions.request({
          origins: [`${corsProxy}/*`]
        });

        saveSettings({
          corsProxy
        });
      }}
    >
      <Flex sx={{ alignItems: "center" }}>
        <Icon
          path={Icons.back}
          onClick={() => {
            navigate("/");
          }}
          sx={{ mr: 2 }}
        />
        <Text variant="title">Settings</Text>
      </Flex>
      <Label variant="text.body" sx={{ flexDirection: "column", mt: 2 }}>
        Custom CORS Proxy:
        <Text variant="subBody">
          For clipping to work correctly, we have to bypass CORS. You can use
          this setting to <a href="navigate">configure your own proxy</a> &amp;
          protect your privacy.
        </Text>
        <Input
          id="corsProxy"
          name="corsProxy"
          type="url"
          defaultValue={settings?.corsProxy}
          placeholder="https://cors.notesfriend.com"
          sx={{ p: 1, py: "7px", mt: 1 }}
        />
      </Label>
      <Button variant="accent" type="submit" sx={{ mt: 2 }}>
        Save
      </Button>
    </Flex>
  );
}
