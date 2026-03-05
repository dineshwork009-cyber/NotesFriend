<p align="center">
<img style="align:center;" src="./resources/icon.png" alt="Notesfriend Logo" width="100" />
</p>

<h1 align="center">Notesfriend</h1>
<h3 align="center">An end-to-end encrypted note taking alternative to Evernote.</h3>
<p align="center">
<a href="https://notesfriend.com/">Website</a> | <a href="https://notesfriend.com/about">About us</a> | <a href="https://notesfriend.com/roadmap">Roadmap</a> | <a href="https://notesfriend.com/downloads">Downloads</a> | <a href="https://twitter.com/@notesfriend">Twitter</a> | <a href="https://discord.gg/5davZnhw3V">Discord</a>
</p>

## Overview

Notesfriend is a free (as in speech) & open-source note-taking app focused on user privacy & ease of use. To ensure zero knowledge principles, Notesfriend encrypts everything on your device using `XChaCha20-Poly1305` & `Argon2`.

Notesfriend is our **proof** that privacy does _not_ (always) have to come at the cost of convenience. We aim to provide users peace of mind & 100% confidence that their notes are safe and secure. The decision to go fully open source is one of the most crucial steps towards that.

This repository contains all the code required to build & use the Notesfriend web, desktop & mobile clients. If you are looking for a full feature list or screenshots, please check the [website](https://notesfriend.com/).

## Developer guide

### Technologies & languages

Notesfriend is built using the following technologies:

1. JavaScript/Typescript — this repo is in a hybrid state. A lot of the newer code is being written in Typescript & the old code is slowly being ported over.
2. React — the whole front-end across all platforms is built using React.
3. React Native — For mobile apps we are using React Native
4. Electron — For desktop app
5. NPM — listed here because we **don't** use Yarn or PNPM or XYZ across any of our projects.

> **Note: Each project in the monorepo contains its own architecture details which you can refer to.**

### Monorepo structure

| Name                       | Path                                               | Description                                                          |
| -------------------------- | -------------------------------------------------- | -------------------------------------------------------------------- |
| `@notesfriend/web`           | [/apps/web](/apps/web)                             | Web client                                                           |
| `@notesfriend/desktop`       | [/apps/desktop](/apps/desktop)                     | Desktop client                                                       |
| `@notesfriend/mobile`        | [/apps/mobile](/apps/mobile)                       | Android/iOS clients                                                  |
| `@notesfriend/web-clipper`   | [/extensions/web-clipper](/extensions/web-clipper) | Web clipper                                                          |
| `@notesfriend/core`          | [/packages/core](/packages/core)                   | Shared core between all platforms                                    |
| `@notesfriend/crypto`        | [/packages/crypto](/packages/crypto)               | Cryptography library wrapper around libsodium                        |
| `@notesfriend/clipper`       | [/packages/clipper](/packages/clipper)             | Web clipper core handling everything related to actual page clipping |
| `@notesfriend/editor`        | [/packages/editor](/packages/editor)               | Notesfriend editor + all extensions                                    |
| `@notesfriend/editor-mobile` | [/packages/editor-mobile](/packages/editor-mobile) | A very thin wrapper around `@notesfriend/editor` for mobile clients    |
| `@notesfriend/logger`        | [/packages/logger](/packages/logger)               | Simple & pluggable logger                                            |
| `@notesfriend/sodium`        | [/packages/sodium](/packages/sodium)               | Wrapper around libsodium to support Node.js & Browser                |
| `@notesfriend/streamable-fs` | [/packages/streamable-fs](/packages/streamable-fs) | Streaming interface around an IndexedDB based file system            |
| `@notesfriend/theme`         | [/packages/theme](/packages/theme)                 | The core theme used in web & desktop clients                         |

### Contributing guidelines

If you are interested in contributing to Notesfriend, I highly recommend checking out the [contributing guidelines](/CONTRIBUTING.md). You'll find all the relevant information such as [style guideline](/CONTRIBUTING.md#style-guidelines), [how to make a PR](/CONTRIBUTING.md#opening--submitting-a-pull-request), [how to commit](/CONTRIBUTING.md#commit-guidelines) etc., there.

### Support & help

You can reach out to us via:

1. [Email](mailto:support@notesfriend.app)
2. [Discord](https://discord.gg/5davZnhw3V)
3. [Twitter](https://twitter.com/notesfriend)
4. [Create an issue](https://github.com/streetwriters/notesfriend/issues/new)

We take all queries, issues and bug reports that you might have. Feel free to ask.

## Additional Resources

- [Migrating & Importing your data from other apps — Importer](https://help.notesfriend.com/importing-notes)
- [Privacy policy](https://notesfriend.com/privacy) & [Terms of service](https://notesfriend.com/terms)
- [Verify Notesfriend encryption claims yourself — Vericrypt](https://vericrypt.notesfriend.com/)
- [Why Notesfriend requires an email address?](https://blog.notesfriend.com/why-notesfriend-requires-an-email-address/)
