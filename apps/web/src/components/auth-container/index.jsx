import { useMemo } from "react";
import { Box, Button, Flex, Image, Text } from "@theme-ui/components";
import { getRandom, usePromise } from "@notesfriend/common";
import Grberk from "../../assets/testimonials/grberk.jpeg";
import Holenstein from "../../assets/testimonials/holenstein.jpg";
import Jason from "../../assets/testimonials/jason.jpg";
import Cameron from "../../assets/testimonials/cameron.jpg";
import { hosts } from "@notesfriend/core";
import { SettingsDialog } from "../../dialogs/settings";
import { strings } from "@notesfriend/intl";

const testimonials = [
  {
    username: "grberk",
    image: Grberk,
    name: "Glenn Berkshier",
    link: "https://twitter.com/grberk/status/1438955961490751489",
    text: "Are you looking for an alternative to Evernote, or just looking for a more secure note taking platform? Take a look at Notesfriend and see if it will fit your needs."
  },
  {
    username: "HolensteinDan",
    image: Holenstein,
    name: "Dan Holenstein",
    link: "https://twitter.com/HolensteinDan/status/1439728355935342592",
    text: "Notesfriend app is what Evernote should have become long ago. And they're still improving."
  },
  {
    username: "jasonbereklewis",
    image: Jason,
    name: "Jason Berek-Lewis",
    link: "https://twitter.com/jasonbereklewis/status/1438635808727044098",
    text: "My day starts and ends in Notesfriend. The clean design, focus mode, tagging and colour coding are all features that help keep my work organised every day."
  },
  {
    username: "camflint",
    image: Cameron,
    name: "Cameron Flint",
    link: "https://twitter.com/camflint/status/1481061416434286592",
    text: "I'm pretty impressed at the progress Notesfriend are making — particularly how performant the app runs despite the overhead of end-to-end encrypting all user data."
  }
];

const features = [
  { icon: "🔒", label: "End-to-end encrypted" },
  { icon: "⚡", label: "Instant sync across devices" },
  { icon: "📴", label: "Works fully offline" }
];

function getRandomTestimonial() {
  return testimonials[getRandom(0, testimonials.length - 1)];
}

function randomTitle() {
  return strings.webAuthTitles[getRandom(0, strings.webAuthTitles.length - 1)]();
}

function AuthContainer(props) {
  const testimonial = useMemo(() => getRandomTestimonial(), []);
  const title = useMemo(() => randomTitle(), []);

  const version = usePromise(
    async () =>
      await fetch(`${hosts.API_HOST}/version`)
        .then((r) => r.json())
        .catch(() => undefined)
  );

  return (
    <Flex sx={{ position: "relative", height: "100%", bg: "background" }}>

      {/* ── Left branding panel (desktop only) ── */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          flexDirection: "column",
          display: ["none", "none", "flex"],
          flex: 1,
          bg: "background-secondary"
        }}
      >
        {/* Animated dot-grid */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(var(--border) 1.2px, transparent 1.2px)",
            backgroundSize: "28px 28px",
            animation: "bgShift 20s linear infinite",
            opacity: 0.7,
            pointerEvents: "none"
          }}
        />
        {/* Gradient vignette so text stays readable */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, var(--background-secondary) 0%, transparent 28%, var(--background-secondary) 100%)",
            pointerEvents: "none"
          }}
        />

        {/* Content column */}
        <Flex
          p={50}
          sx={{
            zIndex: 1,
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          {/* Logo + wordmark */}
          <Flex
            sx={{
              alignItems: "center",
              gap: "12px",
              animation: "fadeInLeft 500ms ease forwards"
            }}
          >
            <svg style={{ height: 50, width: 50, flexShrink: 0 }}>
              <use href="#full-logo" />
            </svg>
            <Text
              sx={{
                fontSize: 19,
                fontWeight: "bold",
                color: "heading",
                letterSpacing: "-0.4px",
                fontFamily: "heading"
              }}
            >
              Notesfriend
            </Text>
          </Flex>

          {/* Headline + feature chips */}
          <Flex sx={{ flexDirection: "column" }}>
            <Text
              variant="heading"
              sx={{
                fontSize: 38,
                lineHeight: 1.18,
                mb: 4,
                animation: "floatUp 500ms ease forwards",
                animationDelay: "80ms",
                opacity: 0
              }}
            >
              {title}
            </Text>

            <Flex sx={{ flexDirection: "column", gap: "10px", mb: 5 }}>
              {features.map((f, i) => (
                <Flex
                  key={i}
                  sx={{
                    alignItems: "center",
                    gap: "10px",
                    bg: "background",
                    px: 3,
                    py: "10px",
                    borderRadius: 50,
                    border: "1px solid var(--border)",
                    width: "fit-content",
                    animation: "floatUp 400ms ease forwards",
                    animationDelay: `${200 + i * 110}ms`,
                    opacity: 0,
                    boxShadow: "0 1px 4px 0 rgba(0,0,0,0.06)"
                  }}
                >
                  <Text sx={{ fontSize: 14, lineHeight: 1 }}>{f.icon}</Text>
                  <Text
                    variant="body"
                    sx={{ fontSize: 13, fontWeight: "medium", color: "paragraph" }}
                  >
                    {f.label}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </Flex>

          {/* Bottom: testimonial + instance row */}
          <Flex
            sx={{
              flexDirection: "column",
              gap: 3,
              animation: "floatUp 500ms ease forwards",
              animationDelay: "540ms",
              opacity: 0
            }}
          >
            {/* Quote */}
            <Text
              variant="body"
              sx={{
                fontSize: 13,
                color: "paragraph-secondary",
                fontStyle: "italic",
                lineHeight: 1.65,
                mb: 2
              }}
            >
              "{testimonial.text}"
            </Text>

            {/* Avatar + name */}
            <Flex sx={{ alignItems: "center", gap: 2 }}>
              <Image
                src={testimonial.image}
                sx={{
                  borderRadius: 50,
                  width: 36,
                  height: 36,
                  objectFit: "cover",
                  border: "2px solid var(--border)"
                }}
              />
              <Flex sx={{ flexDirection: "column", gap: "1px" }}>
                <Text variant="body" sx={{ fontSize: 13, fontWeight: "bold" }}>
                  {testimonial.name}
                </Text>
                <Text variant="subBody" sx={{ fontSize: 11 }}>
                  @{testimonial.username}
                </Text>
              </Flex>
            </Flex>

            {/* Instance info */}
            <Flex
              pt={3}
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid var(--border)"
              }}
            >
              <Text variant="subBody" sx={{ fontSize: 11 }}>
                {version.status === "fulfilled" &&
                !!version.value &&
                version.value.instance !== "default" ? (
                  <>
                    {strings.usingInstance(
                      version.value.instance,
                      version.value.version
                    )}
                  </>
                ) : (
                  <>{strings.usingOfficialInstance()}</>
                )}
              </Text>
              <Button
                variant="anchor"
                sx={{ fontSize: 11 }}
                onClick={() =>
                  SettingsDialog.show({ activeSection: "servers" })
                }
              >
                {strings.configure()}
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Box>

      {/* ── Right form panel ── */}
      <Flex sx={{ position: "relative", flex: 1.5, flexDirection: "column" }}>
        {/* Subtle gradient — doesn't compete with the form */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(160deg, var(--background-secondary) 0%, var(--background) 55%)",
            pointerEvents: "none"
          }}
        />
        {props.children}
      </Flex>
    </Flex>
  );
}

export default AuthContainer;
