# WallCraft

A cross-platform mobile application built with React Native that enables users to discover, search, save, and apply high-quality wallpapers sourced from the Wallhaven API.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [License](#license)

---

## Overview

WallCraft connects to the [Wallhaven API](https://wallhaven.cc/help/api) to fetch thousands of curated, categorized wallpapers. Users can browse a home feed, perform keyword searches, save favorites locally, and apply any image directly as their device wallpaper — all within a single, unified interface.

---

## Features

- Browse a curated or randomized feed of high-resolution wallpapers
- Full-text keyword search with category and purity filtering
- Save wallpapers locally for offline access
- View wallpapers in full resolution before applying
- Apply wallpapers directly to the Home Screen or Lock Screen
- Dark mode and incognito mode support via a global theme context
- Optimized image loading with aggressive caching
- Responsive UI that accounts for device notches and safe areas

---

## Tech Stack

| Category | Library / Tool |
|---|---|
| Framework | React Native 0.84.1 |
| UI Library | React 19.2.3 |
| Language | TypeScript / JavaScript |
| Navigation | React Navigation (Native Stack + Bottom Tabs) |
| Local Storage | @react-native-async-storage/async-storage |
| Image Loading | react-native-fast-image |
| File System | react-native-fs |
| Wallpaper Control | react-native-manage-wallpaper |
| Icons | react-native-vector-icons |
| Safe Area | react-native-safe-area-context |
| Data Source | Wallhaven API v1 |
| Linting | ESLint + Prettier |
| Testing | Jest |

---

## Project Structure

```
WallCraft/
├── android/                  # Native Android project files
├── ios/                      # Native iOS project files
├── src/
│   ├── api/                  # API integration (Wallhaven API calls)
│   ├── components/           # Reusable UI components
│   ├── context/              # Global state via React Context (Theme, etc.)
│   ├── hooks/                # Custom React hooks
│   ├── navigation/           # Stack and bottom tab navigator setup
│   ├── screens/              # Application screens
│   │   ├── HomeScreen
│   │   ├── SearchScreen
│   │   ├── SavedScreen
│   │   ├── SettingsScreen
│   │   └── WallpaperDetailScreen
│   ├── theme/                # Color palettes and typography constants
│   └── utils/                # Shared utility functions
├── App.tsx                   # Application entry point
├── index.js                  # React Native registration
├── package.json
└── tsconfig.json
```

---

## Prerequisites

Ensure the React Native development environment is fully configured before proceeding.

- **Node.js** >= 22.11.0
- **npm** or **Yarn**
- **Android Studio** with an Android emulator or physical device (for Android)
- **Xcode** (macOS only) with a simulator or physical device (for iOS)
- A valid [Wallhaven API key](https://wallhaven.cc/settings/account)

Refer to the [official React Native environment setup guide](https://reactnative.dev/docs/environment-setup) for detailed instructions.

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/WallCraft.git
   cd WallCraft
   ```

2. Install JavaScript dependencies:

   ```bash
   npm install
   ```

3. (iOS only) Install CocoaPods dependencies:

   ```bash
   cd ios && pod install && cd ..
   ```

---

## Running the App

### Android

Start the Metro bundler in one terminal:

```bash
npm run start
```

In a separate terminal, build and launch on Android:

```bash
npm run android
```

### iOS (macOS only)

Start the Metro bundler in one terminal:

```bash
npm run start
```

In a separate terminal, build and launch on iOS:

```bash
npm run ios
```

---

## Environment Variables

Create a `.env` file in the project root and provide the following:

```env
WALLHAVEN_API_KEY=your_api_key_here
```

The API key is used by `src/api/wallhaven.js` to authenticate requests to the Wallhaven API. Without a valid key, search results and wallpaper details may be limited or unavailable.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run start` | Start the Metro bundler |
| `npm run android` | Build and run the app on Android |
| `npm run ios` | Build and run the app on iOS |
| `npm run lint` | Run ESLint across the codebase |
| `npm run test` | Run Jest unit tests |

---

## License

This project is private. All rights reserved.