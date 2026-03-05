# Notesfriend — Complete Project Documentation

> **Forked from:** [Notesnook](https://github.com/streetwriters/notesnook)
> **License:** GPL-3.0-or-later
> **Last Updated:** 2026-03-04

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture Overview](#2-architecture-overview)
3. [Technology Stack](#3-technology-stack)
4. [Repository Structure](#4-repository-structure)
5. [Packages](#5-packages)
6. [Apps](#6-apps)
7. [Extensions](#7-extensions)
8. [Servers](#8-servers)
9. [Getting Started](#9-getting-started)
10. [Development Workflow](#10-development-workflow)
11. [Build System](#11-build-system)
12. [CI/CD Pipelines](#12-cicd-pipelines)
13. [Naming Conventions & Key Decisions](#13-naming-conventions--key-decisions)
14. [Known Issues & Workarounds](#14-known-issues--workarounds)
15. [Contributing Guidelines](#15-contributing-guidelines)
16. [Contact & Support](#16-contact--support)

---

## 1. Project Overview

**Notesfriend** is an open-source, end-to-end encrypted note-taking application — a privacy-focused fork of Notesnook. It supports Web, Desktop (Electron), and Mobile (React Native) clients, all sharing a common encrypted core.

**Core Principles:**
- Zero-knowledge encryption — the server never sees plaintext data
- End-to-end encryption using **XChaCha20-Poly1305** and **Argon2**
- Fully open source (GPL-3.0-or-later)
- Cross-platform: Web, Desktop (Windows/macOS/Linux), iOS, Android

**What was changed from Notesnook:**
- All internal package scopes renamed: `@notesnook/xxx` → `@notesfriend/xxx`
- All user-visible strings and branding updated to "Notesfriend"
- Contact info updated: `support@notesfriend.app`
- **Exception:** `@notesnook-importer/core` kept as-is (external npm package, not part of this repo)

---

## 2. Architecture Overview

```
notesfriend/
├── apps/           # Client applications (web, desktop, mobile, etc.)
├── packages/       # Shared libraries consumed by apps
├── extensions/     # Browser extensions (web clipper)
├── servers/        # Backend/API services
└── scripts/        # Monorepo tooling (build, bootstrap, etc.)
```

The project is a **monorepo** managed with npm workspaces. A custom task runner (`scripts/execute.mjs`) handles build ordering with dependency graph resolution and file-hash caching.

**Data Flow (simplified):**
```
User Input → Editor (@notesfriend/editor)
           → Core Logic (@notesfriend/core)
           → Crypto Layer (@notesfriend/crypto → @notesfriend/sodium → libsodium)
           → Storage (IndexedDB on web / SQLite on desktop)
           → Sync Server (via tRPC + SignalR)
```

---

## 3. Technology Stack

### Core

| Layer | Technology | Version |
|---|---|---|
| Language | TypeScript | 5.6.3 |
| React (Web/Desktop) | React | 18.3.1 |
| Mobile | React Native | 0.82.1 |
| Desktop wrapper | Electron | 37.0.0 |
| Web bundler | Vite | 5.4.11 |
| Transpiler | SWC / esbuild | latest |

### State Management

| Library | Purpose |
|---|---|
| Zustand 4.5.5 | Global UI state |
| @tanstack/react-query 4.36.1 | Server state & caching |
| Mutative | Immutable state updates |

### Styling

| Library | Purpose |
|---|---|
| @emotion/react 11.11.1 | CSS-in-JS |
| @theme-ui/core & components 0.16.1 | Theming system |
| Autoprefixer | CSS vendor prefixes |

### Editor

| Library | Purpose |
|---|---|
| @tiptap/core 2.6.6 | Editor framework (ProseMirror-based) |
| ProseMirror 1.34.2 | Document model |
| KaTeX 0.16.11 | Math equation rendering |
| Prism.js 1.29.0 | Syntax highlighting |
| Linkify.js 4.1.3 | Auto URL detection |

### Cryptography

| Library | Purpose |
|---|---|
| @notesfriend/crypto | High-level crypto API |
| @notesfriend/sodium | libsodium JS wrapper |
| libsodium-wrappers-sumo 0.7.15 | Underlying crypto primitives |
| hash-wasm 4.12.0 | Hashing utilities |

**Algorithms used:**
- Encryption: XChaCha20-Poly1305
- Key derivation: Argon2

### Storage

| Platform | Technology |
|---|---|
| Web / PWA | IndexedDB (via `@notesfriend/streamable-fs`) |
| Desktop | SQLite (`better-sqlite3-multiple-ciphers`) with FTS5 |

### Networking & RPC

| Library | Purpose |
|---|---|
| @trpc/client + server 10.45.2 | Type-safe RPC |
| @trpc/react-query | tRPC + React Query integration |
| electron-trpc 0.7.1 | tRPC over Electron IPC |
| @microsoft/signalr 8.0.0 | Real-time sync |

### Internationalization

| Library | Purpose |
|---|---|
| @lingui/core 5.1.2 | i18n framework |
| @lingui/react 5.1.2 | React bindings |
| @lingui/cli 5.1.2 | String extraction & compilation |

### Testing

| Library | Scope |
|---|---|
| Playwright 1.57.0 | Web E2E tests |
| Vitest 2.1.8 | Unit tests |
| Detox | Mobile E2E |
| Jest | Mobile unit tests |

### Code Quality

| Tool | Purpose |
|---|---|
| ESLint 8.42.0 | Linting (TS + React) |
| Prettier 2.8.8 | Formatting |
| commitlint | Commit message validation |
| Husky | Git hooks |

---

## 4. Repository Structure

```
notesfriend/
│
├── apps/
│   ├── web/            # Web client (React + Vite + PWA)
│   ├── desktop/        # Desktop client (Electron)
│   ├── mobile/         # iOS + Android (React Native)
│   ├── monograph/      # Documentation site (Remix)
│   ├── vericrypt/      # Encryption verification tool (Vite)
│   └── theme-builder/  # Theme builder UI (Vite)
│
├── packages/
│   ├── core/           # Core business logic (sync, models, DB queries)
│   ├── crypto/         # Cryptography wrapper
│   ├── editor/         # Rich text editor + all extensions
│   ├── editor-mobile/  # Mobile editor wrapper
│   ├── theme/          # Theme engine
│   ├── intl/           # Internationalization/translations
│   ├── logger/         # Pluggable logging utility
│   ├── sodium/         # libsodium (Node.js + Browser)
│   ├── common/         # Shared React hooks & utilities
│   ├── clipper/        # Web clipper core logic
│   ├── ui/             # Shared UI components
│   └── streamable-fs/  # IndexedDB streaming filesystem
│
├── extensions/
│   └── web-clipper/    # Chrome + Firefox extension
│
├── servers/
│   └── themes/         # Themes REST API (tRPC + Node.js)
│
├── scripts/
│   ├── bootstrap.mjs   # Dependency installer for monorepo
│   ├── execute.mjs     # Task runner with dependency graph
│   ├── build.mjs       # Build orchestrator
│   ├── clean.mjs       # Clean build outputs
│   ├── analyze.mjs     # Dependency analyzer
│   ├── publish.mjs     # Publishing helper
│   └── generate-sources.mjs
│
├── docs/               # Static documentation assets
├── resources/          # Static resources (icons, images)
├── fastlane/           # Mobile build automation (iOS/Android)
├── .github/workflows/  # GitHub Actions CI/CD
│
├── package.json        # Root — workspace config + scripts
├── package-lock.json   # Lock file
├── tsconfig.json       # Root TypeScript config
├── .eslintrc.js        # ESLint config
├── .prettierrc.js      # Prettier config
├── .gitignore
└── .gitattributes
```

---

## 5. Packages

All packages live under `packages/` and are scoped as `@notesfriend/*`.

### `@notesfriend/core` (v8.1.3)
**Path:** `packages/core/`
The heart of the application. Contains:
- All business logic: notes, notebooks, tags, reminders, attachments
- Database models and queries (Kysely SQL builder)
- Sync engine
- Full-text search (FTS5/trigram)
- Background task scheduling
Builds as both ESM and CJS for cross-platform use.

### `@notesfriend/crypto` (v2.1.3)
**Path:** `packages/crypto/`
High-level cryptography API. Wraps `@notesfriend/sodium`.
Handles: key generation, data encryption/decryption, key derivation.
Algorithms: XChaCha20-Poly1305, Argon2.

### `@notesfriend/sodium` (v2.1.3)
**Path:** `packages/sodium/`
Low-level libsodium wrapper. Works in both Node.js and browser environments.
Provides: `libsodium-wrappers-sumo` with a unified API.

### `@notesfriend/editor` (v2.1.3)
**Path:** `packages/editor/`
Custom rich text editor built on **Tiptap** + **ProseMirror**.
Includes extensions for: tables, code blocks, math (KaTeX), checklists, embeds, attachments, callouts, and more.

### `@notesfriend/editor-mobile` (v1.0.0)
**Path:** `packages/editor-mobile/`
Mobile-specific editor wrapper. Bridges the web-based editor to React Native WebView.

### `@notesfriend/theme` (v2.1.3)
**Path:** `packages/theme/`
Core theming engine. Provides light/dark themes and custom theme support.
Used by all client apps.

### `@notesfriend/intl` (v1.0.0)
**Path:** `packages/intl/`
Internationalization system built with **Lingui**.
Handles string extraction, compilation, and runtime translation.

### `@notesfriend/logger` (v2.1.3)
**Path:** `packages/logger/`
Pluggable logging utility. Supports multiple log targets (console, file, remote).

### `@notesfriend/common` (v2.1.3)
**Path:** `packages/common/`
Shared utilities used across apps:
- Custom React hooks
- Helper functions
- Common TypeScript types

### `@notesfriend/clipper` (v2.1.3)
**Path:** `packages/clipper/`
Core logic for the web clipper: article parsing, Readability integration, formatting.

### `@notesfriend/ui` (v2.1.3)
**Path:** `packages/ui/`
Shared UI component library (buttons, modals, inputs, etc.) built with Theme UI + Emotion.

### `@notesfriend/streamable-fs` (v2.1.3)
**Path:** `packages/streamable-fs/`
Streaming filesystem backed by IndexedDB.
Used on web for storing attachments and large binary data in-browser.

---

## 6. Apps

### `apps/web` — Web Client
**Stack:** React 18 + TypeScript + Vite 5 + PWA
**Dev server:** `http://localhost:3000` (auto-increments if port taken)

**Source structure (`apps/web/src/`):**
```
src/
├── index.ts                  # Entry point
├── index.html                # HTML template
├── app.tsx                   # Root App component
├── app-effects.tsx           # App-level side effects
├── bootstrap.tsx             # App bootstrap logic
├── root.tsx                  # Root wrapper
├── app.css                   # Global CSS
├── service-worker.ts         # PWA service worker
├── service-worker-registration.ts
│
├── components/               # Reusable React components
├── views/                    # Full-page views/screens
├── dialogs/                  # Dialog/modal components
├── hooks/                    # Custom React hooks
├── stores/                   # Zustand state stores
├── utils/                    # Utility functions
├── common/                   # Shared app-level logic
├── interfaces/               # TypeScript interfaces
├── navigation/               # Routing logic
├── assets/                   # Static assets (icons, images)
└── re-exports/               # Module re-exports
```

**Vite config highlights:**
- Root: `src/`
- Output: `../build`
- Environment variable prefix: `NN_`
- PWA enabled (Service Worker)
- Platform detection: `desktop` vs `web` builds
- Custom prefetch plugin for bundle optimization

**Build command:** `npm run build:web`
**Dev command:** `npm run start:web`

---

### `apps/desktop` — Desktop Client (Electron)
**Stack:** Electron 37 + React (shared web bundle) + SQLite
**Storage:** `better-sqlite3-multiple-ciphers` (encrypted SQLite)
**Networking:** electron-trpc (IPC-based tRPC)

> **Note:** Requires native module compilation. On Windows, Visual Studio C++ Build Tools are needed for `better-sqlite3-multiple-ciphers`. Without them, the desktop app will not start, but the web app is unaffected.

---

### `apps/mobile` — Mobile Client (React Native)
**Stack:** React Native 0.82.1 + TypeScript
**Platforms:** iOS, Android
**Navigation:** React Native Navigation
**Animations:** React Native Reanimated 4.2.0, Gesture Handler 2.28.0
**Build Automation:** Fastlane (see `fastlane/`)
**Testing:** Detox (E2E), Jest (unit)

---

### `apps/monograph` — Documentation Site
**Stack:** Remix 2.12.1 + TypeScript
**Purpose:** User-facing documentation and help articles
**Deployment:** Dockerfile available (`apps/monograph/Dockerfile`)

---

### `apps/vericrypt` — Encryption Verifier
**Stack:** Vite
**Purpose:** Standalone tool allowing users to independently verify their encrypted data using the same crypto algorithms, proving zero-knowledge encryption.

---

### `apps/theme-builder` — Theme Builder
**Stack:** Vite
**Purpose:** UI tool for creating and previewing custom themes for Notesfriend.

---

## 7. Extensions

### `@notesfriend/web-clipper`
**Path:** `extensions/web-clipper/`
**Supports:** Chrome (Manifest v3), Firefox (Manifest v2)
**Build tool:** Webpack + RSBuild
**Core logic:** `@notesfriend/clipper` package

**Build commands:**
```bash
# From extensions/web-clipper/
npm run build:chrome   # Chrome extension
npm run build:firefox  # Firefox extension
npm run dev:chrome     # Chrome dev mode
npm run dev:firefox    # Firefox dev mode
```

> **Known issue:** `node-sass` may fail to compile on some systems. This only affects the extension, not the web/desktop apps.

---

## 8. Servers

### `@notesfriend/themes-server`
**Path:** `servers/themes/`
**Stack:** Node.js + tRPC + Cloudflare
**Build:** esbuild
**Purpose:** REST/RPC API serving theme definitions to clients
**Deployment:** Docker (`servers/themes/Dockerfile`)

---

## 9. Getting Started

### Prerequisites

| Tool | Required Version | Notes |
|---|---|---|
| Node.js | 22.20.0 (recommended) | v24.x also works |
| npm | 11.x | Comes with Node |
| Git | Any | For version control |
| VS C++ Build Tools | Optional | Only needed for desktop/Electron |

> **Windows Note:** The project is tested on Windows 11. Use bash (Git Bash / WSL) for all commands — not PowerShell or cmd.

### First-Time Setup

```bash
# 1. Install root dependencies (skip husky if not a git repo)
npm install --ignore-scripts

# 2. Bootstrap all monorepo packages (installs cross-package deps)
node scripts/bootstrap.mjs --scope=web

# 3. Start the web development server
npm run start:web
```

The web app will be available at `http://localhost:3000` (or 3001/3002 if port 3000 is taken).

> **First run:** On the very first `npm run start:web`, all packages will be built sequentially. This takes approximately 1–2 minutes. Subsequent starts are fast due to caching.

### Bootstrap Scope Options

```bash
# Web only (recommended for web development)
node scripts/bootstrap.mjs --scope=web

# All packages
node scripts/bootstrap.mjs

# Offline mode (uses cached packages)
node scripts/bootstrap.mjs --offline
```

---

## 10. Development Workflow

### Running Apps

```bash
# Web app
npm run start:web

# Desktop app (requires native modules compiled)
npm run start:desktop

# Mobile (requires Android Studio / Xcode)
npm run start:mobile
```

### Linting & Formatting

```bash
# Lint all files
npm run lint

# Format all files with Prettier
npm run prettier
```

### Running Tests

```bash
# Web unit tests (Vitest)
cd apps/web && npm run test

# Web E2E tests (Playwright)
cd apps/web && npm run test:e2e

# Core package tests
cd packages/core && npm run test
```

### Building for Production

```bash
# Build web app
npm run build:web

# Build all packages (excluding apps)
npm run build
```

### Environment Variables

The web app uses the `NN_` prefix for environment variables (Vite convention):

```env
# apps/web/.env.local (not committed)
NN_API_HOST=https://api.notesfriend.app
NN_SUBSCRIPTIONS_HOST=...
NN_ISSUES_HOST=...
```

---

## 11. Build System

### Custom Task Runner (`scripts/execute.mjs`)

The monorepo uses a custom task runner instead of Turborepo or Nx. It:
1. Reads task definitions from `package.json` (`taskRunner.projects` and `taskRunner.tasks`)
2. Resolves the dependency graph for each task
3. Executes tasks in batches (respecting dependencies)
4. Caches results using file hashing (stored in `.taskcache`)
5. Detects and reports cyclic dependencies

```bash
# Run a specific task
npm run tx -- <task-name>
```

### Bootstrap Script (`scripts/bootstrap.mjs`)

Scans all packages across `packages/*`, `apps/*`, `extensions/*`, `servers/*`, resolves local workspace dependencies, and installs them in the correct order. Uses multithreading (max of 4 or half available CPUs).

Skips native packages that require compilation:
- `better-sqlite3-multiple-ciphers`
- `electron`
- `canvas`

### Package Build Pattern

All packages use the same build entry point:
```bash
node ../../scripts/build.mjs
```

Each package's `package.json` scripts:
```json
{
  "scripts": {
    "build": "node ../../scripts/build.mjs",
    "test": "vitest run"
  }
}
```

### After Package.json Changes

If you rename or add a package, re-run bootstrap:
```bash
node scripts/bootstrap.mjs --scope=web
```

---

## 12. CI/CD Pipelines

All pipelines are defined in `.github/workflows/`.

| Workflow File | Trigger | Purpose |
|---|---|---|
| `web.publish.yml` | Push/tag | Build & publish web app |
| `web.tests.yml` | PR | Run web tests |
| `web.benchmarks.yml` | PR | Performance benchmarks |
| `desktop.publish.yml` | Tag | Build & publish desktop installers |
| `desktop.tests.yml` | PR | Desktop tests |
| `android.publish.yml` | Tag | Release Android app (Play Store) |
| `android.publish.internal.yml` | Manual | Internal Android release |
| `android.e2e.yml` | PR | Android E2E tests (Detox) |
| `ios.publish.yml` | Tag | Release iOS app (App Store) |
| `core.tests.yml` | PR | Core package tests |
| `editor.tests.yml` | PR | Editor package tests |
| `theme-builder.publish.yml` | Tag | Publish theme builder |
| `monograph.publish.yml` | Tag | Deploy documentation site |
| `vericrypt.publish.yml` | Tag | Publish vericrypt |
| `themes.publish.yml` | Tag | Deploy themes server |
| `help.publish.yml` | Tag | Deploy help docs |

**Mobile deployment** uses Fastlane (see `fastlane/` directory).

---

## 13. Naming Conventions & Key Decisions

### Package Scopes

| Type | Scope | Example |
|---|---|---|
| Internal monorepo packages | `@notesfriend/xxx` | `@notesfriend/core` |
| External npm packages | kept original | `@notesnook-importer/core` |

> The importer package (`@notesnook-importer/core`) is an **external npm dependency** and was NOT renamed. Do not rename it in import statements.

### Commit Message Format

```
<scope>: <short description>
```

Valid scopes:
`mobile`, `web`, `desktop`, `crypto`, `editor`, `logger`, `theme`, `config`, `ci`, `setup`, `docs`, `misc`, `global`

Examples:
```
web: add dark mode toggle to settings
crypto: fix key derivation edge case on mobile
docs: update getting started guide
```

### Code Style

Enforced by ESLint + Prettier. Key rules:
- Double quotes (not single)
- Semicolons required
- 2-space indentation
- LF line endings (Unix-style, even on Windows)
- Print width: 80 characters
- Trailing commas: none

Run before committing:
```bash
npm run prettier
npm run lint
```

### TypeScript Config

- Target: ES2016
- Module: ESNext
- Module resolution: Node
- Strict mode: enabled
- Declaration files generated: yes

### React Version

React 18.3.1 — uses concurrent mode features. All new components should be functional (hooks-based), not class components.

### State Management Convention

- **UI state** → Zustand stores (`src/stores/`)
- **Server/async state** → @tanstack/react-query
- **Local component state** → `useState` / `useReducer`

---

## 14. Known Issues & Workarounds

### `better-sqlite3-multiple-ciphers` Build Failure

**Symptom:** Error during `npm install` or bootstrap about missing native build tools.
**Root cause:** This native Node.js module requires Microsoft Visual C++ Build Tools on Windows.
**Impact:** Only affects the **desktop/Electron** app.
**Workaround:** For web development, ignore this error. The web app uses IndexedDB and does not depend on SQLite.

To fix for desktop development:
1. Install [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
2. Select "Desktop development with C++"
3. Re-run `node scripts/bootstrap.mjs`

---

### `node-sass` Build Failure

**Symptom:** Error about `node-sass` bindings.
**Root cause:** `node-sass` is deprecated and has poor Node 18+ support.
**Impact:** Only affects `extensions/web-clipper`.
**Workaround:** For web or desktop development, ignore this error.

---

### Port 3000 Already in Use

**Symptom:** Vite outputs "Port 3000 is in use, trying 3001..."
**Impact:** None — Vite auto-selects the next available port.
**Fix:** Access the app at the port Vite reports in the terminal.

---

### Husky Git Hooks Fail on Setup

**Symptom:** `npm install` fails with husky errors.
**Root cause:** Husky requires a git repository.
**Fix:** Use `npm install --ignore-scripts` to skip hook installation.

---

### `.taskcache` File

The `.taskcache` file is auto-generated by `scripts/execute.mjs` to cache build states. It is gitignored. If builds behave strangely, delete it:
```bash
rm .taskcache
```

---

## 15. Contributing Guidelines

### Before You Start

1. All contributions must include a **Developer Certificate of Origin (DCO)** — sign commits with your real name.
2. Fork from the `master` branch (no separate development branches).
3. Run `npm run bootstrap` after any package.json changes.

### Workflow

```bash
# 1. Fork and clone
git clone <your-fork-url>
cd notesfriend

# 2. Install dependencies
npm install --ignore-scripts
node scripts/bootstrap.mjs --scope=web

# 3. Create a feature branch
git checkout -b web/your-feature-name

# 4. Make changes, then format and lint
npm run prettier
npm run lint

# 5. Commit with proper scope
git commit -m "web: add your feature description"

# 6. Push and open a Pull Request
git push origin web/your-feature-name
```

### Pull Request Guidelines

- Keep PRs focused — one feature or fix per PR
- All existing tests must pass
- Add tests for new functionality
- Minimize breaking changes to the public API
- Describe what changed and why in the PR description
- Expect maintainer feedback; address review comments promptly

### DCO Sign-off

All commits must be signed off:
```bash
git commit -s -m "web: add feature"
# Adds: Signed-off-by: Your Name <your@email.com>
```

---

## 16. Contact & Support

| Channel | Details |
|---|---|
| Email | support@notesfriend.app |
| GitHub Issues | Open an issue in this repository |
| Original Project | [Notesnook on GitHub](https://github.com/streetwriters/notesnook) |

---

## Quick Reference Card

```bash
# === SETUP ===
npm install --ignore-scripts          # Root deps (skip husky)
node scripts/bootstrap.mjs --scope=web # Web + all local deps

# === DEVELOPMENT ===
npm run start:web                      # Start web dev server (localhost:3000)
npm run start:desktop                  # Start desktop app

# === CODE QUALITY ===
npm run prettier                       # Format all files
npm run lint                           # Lint all files

# === TESTING ===
cd apps/web && npm run test            # Web unit tests
cd apps/web && npm run test:e2e        # Web E2E tests

# === BUILD ===
npm run build                          # Build all packages
npm run build:web                      # Build web app only

# === TROUBLESHOOTING ===
rm .taskcache                          # Clear build cache
node scripts/bootstrap.mjs --scope=web # Re-bootstrap after package changes
```

---

*This document covers the full Notesfriend monorepo as of 2026-03-04. Update this file whenever major architectural changes are made.*
