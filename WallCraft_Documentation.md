# WallCraft Project Documentation

Welcome to the **WallCraft** documentation! This document explains how the project works, the underlying architecture and technologies used, and provides a step-by-step guide on how to run and use the application.

## Table of Contents
1. [Overview](#overview)
2. [How It Works](#how-it-works)
3. [Technologies Used](#technologies-used)
4. [Project Structure](#project-structure)
5. [Step-by-Step Usage Guide](#step-by-step-usage-guide)

---

## Overview
**WallCraft** is a mobile application built for Android and iOS that allows users to discover, search, save, and download high-quality wallpapers. It leverages an external API to fetch thousands of wallpapers dynamically and provides native functionalities to set these images directly as the device's home or lock screen wallpaper.

---

## How It Works
1. **Fetching Wallpapers:** 
   The app connects to the **Wallhaven API** to retrieve lists of random, curated, or search-specific wallpapers. It uses query parameters (e.g., categories, purity, ratios, search strings) to fetch results tailored to user preferences.
2. **Displaying Content:** 
   Lists of wallpapers are displayed across various screens (Home and Search). The app uses an optimized image rendering library to ensure smooth scrolling and fast image loading, even for high-resolution pictures.
3. **Saving Locally:** 
   Users can mark wallpapers as "Saved". The application stores these preferences locally on the device using basic asynchronous storage mechanisms. Saved wallpapers can be browsed later in the "Saved" tab without executing new search queries.
4. **Applying Wallpapers:** 
   On the Wallpaper Detail Screen, users can download the full-resolution image to their phone's local file system. From there, they can directly apply it as their phone's wallpaper (Home Screen or Lock Screen).

---

## Technologies Used

### Core Frameworks
* **[React Native]((https://reactnative.dev/)):** The core framework used to build cross-platform mobile apps using React.
* **[React]((https://react.dev/)):** The foundational UI library used for component architecture and state management.

### Navigation
* **[React Navigation]((https://reactnavigation.org/)):** The standard routing and navigation library for React Native. Specifically, `@react-navigation/native`, `@react-navigation/native-stack`, and `@react-navigation/bottom-tabs` handle transitions between screens like Home, Search, Saved, Settings, and Details.

### Data & State Management
* **@react-native-async-storage/async-storage:** An asynchronous, unencrypted, persistent, key-value storage system for React Native, used here to persist the user's "Saved" wallpapers locally.
* **Wallhaven API:** Provides the backend imagery and metadata. (Communication handled via native `fetch` API).

### Image Optimization & File Management
* **react-native-fast-image:** A highly performant React Native image component that caches images aggresively and loads them quickly, replacing the standard `<Image>` component.
* **react-native-fs:** Accesses the native file system to download and save wallpaper files securely to the device.
* **react-native-manage-wallpaper:** Interacts with native Android/iOS APIs to programmatically change the device's wallpaper.

### Additional Utilities
* **react-native-vector-icons:** Provides standard icons (like search, home, heart/saved indicators) throughout the UI.
* **react-native-safe-area-context:** Ensures that the UI renders correctly on devices with notches or varied screen form factors.

---

## Project Structure
The source code resides mainly under the `src/` directory:

```text
WallCraft/
├── android/            # Native Android project files
├── ios/                # Native iOS project files
├── package.json        # Dependencies and build scripts
└── src/
    ├── api/            # API integration (e.g., wallhaven.js fetching data)
    ├── components/     # Reusable UI components (buttons, image cards)
    ├── context/        # React Context for global state (if applicable)
    ├── hooks/          # Custom React hooks
    ├── navigation/     # Setup for stack and bottom tab navigators
    ├── screens/        # Main app screens (HomeScreen, SearchScreen, etc.)
    ├── theme/          # Theming, colors, and typography constants
    └── utils/          # Helper functions and constants
```

---

## Step-by-Step Usage Guide

### Prerequisites
Before running the project, ensure you have the React Native environment set up. You need:
* **Node.js** (>= 22.11.0 recommended based on `package.json` engines)
* **npm** or **Yarn** package manager
* **Android Studio** (for Android) and/or **Xcode** (for iOS, macOS only)
* Emulators/Simulators or a physical device connected.

### 1. Installation
1. Open up your terminal and navigate to the project root directory:
   ```bash
   cd "WallCraft"
   ```
2. Install the JavaScript dependencies:
   ```bash
   npm install
   ```
3. *(iOS Only)* Install CocoaPods dependencies:
   ```bash
   cd ios && pod install && cd ..
   ```

### 2. Running the Application
To start the React Native Metro bundler and run the app:

**For Android:**
1. Start the Metro Bundler:
   ```bash
   npm run start
   ```
2. In a new terminal window, run the Android build command:
   ```bash
   npm run android
   ```

**For iOS (macOS required):**
1. Start the Metro Bundler:
   ```bash
   npm run start
   ```
2. In a new terminal window, run the iOS build command:
   ```bash
   npm run ios
   ```

### 3. Using the App
Once the app is running on your device/emulator, follow these steps to use its features:

1. **Browsing:** Upon launch, the **HomeScreen** will greet you with a curated or random list of high-quality wallpapers loaded from the Wallhaven API. Scroll down to discover more.
2. **Searching:** Tap on the **Search Screen** tab in the bottom navigation bar. Enter keywords (e.g., "nature", "cyberpunk") to find specific types of wallpapers.
3. **Viewing Details:** Tap on any wallpaper thumbnail to open the **WallpaperDetailScreen**. Here you can see the high-resolution version of the image.
4. **Saving:** On the detail screen, click the "Save/Heart" icon. This will store the wallpaper in your local device data using `AsyncStorage`.
5. **Viewing Saved Items:** Tap the **Saved Screen** tab at the bottom to view the collection of wallpapers you previously saved.
6. **Setting a Wallpaper:** 
   - Open a specific image detail screen.
   - Click the **Download/Set Wallpaper** button.
   - The app will securely download the image via `react-native-fs` and subsequently apply it using `react-native-manage-wallpaper`.
7. **Settings:** Navigate to the **Settings Screen** to manage basic app preferences and options.

---
*Happy Customizing!*
