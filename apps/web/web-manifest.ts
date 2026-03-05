import { ManifestOptions } from "vite-plugin-pwa";

export const WEB_MANIFEST: Partial<ManifestOptions> = {
  name: "Notesfriend",
  description:
    "A fully open source & end-to-end encrypted note taking alternative to Evernote.",
  short_name: "Notesfriend",
  shortcuts: [
    {
      name: "New note",
      url: "/#/notes/create",
      description: "Create a new note",
      icons: [
        {
          src: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png"
        }
      ]
    },
    {
      name: "New notebook",
      url: "/#/notebooks/create",
      description: "Create a new notebook",
      icons: [
        {
          src: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png"
        }
      ]
    }
  ],
  icons: [
    {
      src: "/android-chrome-192x192.png",
      sizes: "192x192",
      type: "image/png"
    },
    {
      src: "/android-chrome-512x512.png",
      sizes: "512x512",
      type: "image/png"
    },
    {
      src: "/android-chrome-maskable-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "maskable"
    },
    {
      src: "/android-chrome-maskable-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable"
    }
  ],
  screenshots: [
    {
      src: "/screenshots/screenshot-1.jpg",
      sizes: "1080x1920",
      type: "image/jpeg"
    },
    {
      src: "/screenshots/screenshot-2.jpg",
      sizes: "1080x1920",
      type: "image/jpeg"
    },
    {
      src: "/screenshots/screenshot-3.jpg",
      sizes: "1080x1920",
      type: "image/jpeg"
    },
    {
      src: "/screenshots/screenshot-4.jpg",
      sizes: "1080x1920",
      type: "image/jpeg"
    },
    {
      src: "/screenshots/screenshot-5.jpg",
      sizes: "1080x1920",
      type: "image/jpeg"
    },
    {
      src: "/screenshots/screenshot-6.jpg",
      sizes: "1080x1920",
      type: "image/jpeg"
    },
    {
      src: "/screenshots/screenshot-7.jpg",
      sizes: "1080x1920",
      type: "image/jpeg"
    }
  ],
  related_applications: [
    {
      platform: "play",
      url: "https://play.google.com/store/apps/details?id=com.streetwriters.notesfriend",
      id: "com.streetwriters.notesfriend"
    },
    {
      platform: "itunes",
      url: "https://apps.apple.com/us/app/notesfriend-private-notes-app/id1544027013"
    }
  ],
  prefer_related_applications: true,
  orientation: "any",
  start_url: ".",
  theme_color: "#01c352",
  background_color: "#ffffff",
  display: "standalone",
  categories: ["productivity", "lifestyle", "education", "books"]
};
