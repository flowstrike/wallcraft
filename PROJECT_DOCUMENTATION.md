# 🎨 WallCraft — Project Documentation

> A premium **React Native** wallpaper application powered by the **Wallhaven API**.
> Browse, search, download, and apply stunning wallpapers directly to your Android device.

---

## 📑 Table of Contents

1. [Technology Stack](#-technology-stack)
2. [Project Structure](#-project-structure)
3. [How the App Works](#-how-the-app-works)
4. [Screens & Features](#-screens--features)
5. [Core Components](#-core-components)
6. [Custom Hooks](#-custom-hooks)
7. [API Integration](#-api-integration)
8. [Theming System](#-theming-system)
9. [Navigation Architecture](#-navigation-architecture)
10. [Data Persistence](#-data-persistence)
11. [Android Permissions](#-android-permissions)
12. [How to Run](#-how-to-run)

---

## 🛠 Technology Stack

| Category | Technology | Version | Purpose |
|---|---|---|---|
| **Framework** | React Native | `0.84.1` | Cross-platform mobile framework |
| **Language** | JavaScript / TypeScript | TS `5.8.3` | App entry point in TSX, screens in JS |
| **UI Library** | React | `19.2.3` | Component-based UI rendering |
| **Navigation** | React Navigation | `7.x` | Bottom tabs + native stack navigators |
| **Image Loading** | react-native-fast-image | `8.6.3` | High-performance cached image rendering |
| **File System** | react-native-fs | `2.20.0` | Download files, manage local storage |
| **Wallpaper Setter** | react-native-manage-wallpaper | `1.2.1` | Natively set home/lock screen wallpapers |
| **Icons** | react-native-vector-icons | `10.3.0` | Material Design icons throughout the app |
| **Storage** | @react-native-async-storage | `1.24.0` | Persistent key-value storage (favorites, theme) |
| **Safe Area** | react-native-safe-area-context | `5.7.0` | Handle notch/status bar insets |
| **Screen Management** | react-native-screens | `4.24.0` | Native screen containers for navigation |
| **API** | Wallhaven REST API | `v1` | Source for all wallpaper data |
| **Build System** | Metro Bundler | — | JavaScript bundler for React Native |
| **Native (Android)** | Kotlin | — | `MainActivity.kt` & `MainApplication.kt` |
| **Testing** | Jest | `29.6.3` | Unit testing framework |
| **Linting** | ESLint + Prettier | — | Code quality & formatting |

---

## 📁 Project Structure

```
WallCraft/
├── App.tsx                     # Root component (SafeAreaProvider + AppNavigator)
├── index.js                    # React Native entry point
├── package.json                # Dependencies & scripts
├── .env                        # Wallhaven API key
├── metro.config.js             # Metro bundler configuration
├── babel.config.js             # Babel transpiler config
├── tsconfig.json               # TypeScript configuration
│
├── src/
│   ├── api/
│   │   └── wallhaven.js        # Wallhaven API client (search + details)
│   │
│   ├── screens/
│   │   ├── HomeScreen.js       # Main feed with topic/sort filters
│   │   ├── SearchScreen.js     # Keyword search with sort options
│   │   ├── WallpaperDetailScreen.js  # Full-screen preview + download/apply
│   │   ├── SavedScreen.js      # User's favorite wallpapers
│   │   └── SettingsScreen.js   # Dark mode toggle
│   │
│   ├── components/
│   │   ├── WallpaperCard.js    # Thumbnail card in grid layouts
│   │   ├── CategoryChip.js     # Pill-shaped topic/sort filter button
│   │   ├── ApplyWallpaperSheet.js  # Bottom sheet modal for applying wallpaper
│   │   └── LoadingSpinner.js   # Reusable loading indicator
│   │
│   ├── hooks/
│   │   ├── useWallpapers.js    # Wallpaper fetching, pagination & filtering
│   │   ├── useDownload.js      # File download with progress tracking
│   │   └── useFavorites.js     # Favorites management (add/remove/check)
│   │
│   ├── navigation/
│   │   ├── AppNavigator.js     # Navigation container + tab/stack setup
│   │   └── BottomTabBar.js     # Custom floating bottom tab bar
│   │
│   ├── context/
│   │   └── ThemeContext.js     # Theme provider (dark/light/incognito)
│   │
│   ├── theme/
│   │   └── colors.js           # Color palette definitions for all 3 themes
│   │
│   └── utils/
│       └── storage.js          # AsyncStorage wrapper (save/get/favorites)
│
└── android/                    # Native Android project (Kotlin)
    └── app/src/main/
        ├── AndroidManifest.xml # Permissions (Internet, Storage)
        └── java/com/wallcraft/
            └── MainActivity.kt
```

---

## ⚙ How the App Works

### High-Level Data Flow

```
┌──────────────┐     HTTP/REST     ┌──────────────────┐
│  Wallhaven   │ ◄───────────────► │  wallhaven.js    │
│  API Server  │                   │  (API Client)    │
└──────────────┘                   └────────┬─────────┘
                                            │
                                   ┌────────▼─────────┐
                                   │  useWallpapers   │
                                   │  (Custom Hook)   │
                                   │  Manages state,  │
                                   │  pagination,     │
                                   │  filters         │
                                   └────────┬─────────┘
                                            │
                              ┌─────────────┼──────────────┐
                              │             │              │
                     ┌────────▼──┐  ┌───────▼───┐  ┌──────▼──────┐
                     │HomeScreen │  │SearchScreen│  │DetailScreen │
                     │(Feed Grid)│  │(Query Grid)│  │(Full Preview│
                     └───────────┘  └───────────┘  │ + Actions)  │
                                                   └──────┬──────┘
                                                          │
                                          ┌───────────────┼───────────────┐
                                          │               │               │
                                 ┌────────▼──┐   ┌───────▼───┐   ┌──────▼──────┐
                                 │useDownload│   │useFavorites│   │ManageWall-  │
                                 │(RNFS)     │   │(AsyncStore)│   │paper(Native)│
                                 └───────────┘   └───────────┘   └─────────────┘
```

### Step-by-Step Flow

1. **App Launch** → `index.js` registers `App.tsx` → wraps everything in `SafeAreaProvider` → renders `AppNavigator`
2. **Theme Initialization** → `ThemeProvider` loads saved theme preference from AsyncStorage, defaults to system color scheme
3. **Navigation Setup** → Bottom Tab Navigator with 4 tabs (Home, Search, Saved, Settings), each tab has its own Stack Navigator
4. **Data Fetching** → `useWallpapers` hook calls `wallhaven.js` API client → fetches portrait-ratio wallpapers with pagination
5. **User Interaction** → User taps a wallpaper card → navigates to `WallpaperDetailScreen` with full-resolution image
6. **Actions** → User can **Save** (favorites via AsyncStorage), **Download** (to Pictures/WallCraft folder via RNFS), or **Apply** (set as wallpaper via native module)

---

## 📱 Screens & Features

### 1. Home Screen (`HomeScreen.js`)

The main landing screen with a curated wallpaper feed.

**Features:**
- **Topic Filters** — Horizontal scrollable chips: All, Nature, Cyberpunk, AMOLED, Space, Cars, Gaming, Anime
- **Sort Options** — 🔥 Hot, ⭐ Top, 🎲 Random, 🕐 Latest
- **2-Column Grid** — Portrait wallpaper thumbnails loaded via `FlatList`
- **Infinite Scroll** — Automatically loads next page when reaching the bottom
- **Pull-to-Refresh** — Swipe down to reload the feed
- **Incognito Mode** — Toggle button switches feed to sketchy/NSFW content with a private pink-themed UI

### 2. Search Screen (`SearchScreen.js`)

Full-text search for wallpapers by keyword, tag, or color.

**Features:**
- **Search Bar** — Text input with clear button and submit-on-enter
- **Sort Chips** — Filter results by Relevant, Hot, Top, or Random
- **Empty State** — Helpful hint icon when no search is active
- **Same grid layout** as Home Screen with infinite scroll

### 3. Wallpaper Detail Screen (`WallpaperDetailScreen.js`)

Full-screen wallpaper preview with comprehensive metadata and actions.

**Features:**
- **Hero Image** — Full-resolution image covering 62% of screen height using `FastImage`
- **Resolution & Views Pills** — Overlay badges showing image dimensions and view count
- **Color Palette** — Horizontal scroll of color dots extracted from the image
- **Stats Grid** — 2×2 cards showing Wallhaven Favorites, File Size, Purity, and Category
- **Tags** — Up to 14 tag chips from the wallpaper metadata
- **Source Link** — Opens the original source URL in browser
- **Floating Action Bar** with 3 actions:
  - ❤️ **Save/Unsave** — Toggle favorite status (persisted in AsyncStorage)
  - ⬇️ **Download** — Save full-res image to `Pictures/WallCraft/` with progress indicator
  - 🖼️ **Apply** — Opens bottom sheet to set as Home Screen, Lock Screen, or Both

### 4. Saved Screen (`SavedScreen.js`)

Displays all wallpapers the user has favorited.

**Features:**
- **Favorites Grid** — 2-column layout of saved wallpapers
- **Auto-Refresh** — Reloads favorites every time the screen comes into focus using `useFocusEffect`
- **Empty State** — Friendly message with a "Browse Wallpapers" button linking back to Home
- **Tap to Detail** — Navigate to full detail screen for any saved wallpaper

### 5. Settings Screen (`SettingsScreen.js`)

App configuration and preferences.

**Features:**
- **Dark Mode Toggle** — Switch between light and dark themes (persisted in AsyncStorage)
- **Incognito Lock** — Theme toggle is disabled while Incognito Mode is active
- **Clean card-based UI** with icon, title, subtitle, and switch

---

## 🧩 Core Components

### `WallpaperCard.js`
- Portrait-ratio card (`1.8:1` aspect) with rounded corners
- Uses `FastImage` for high-performance cached image loading
- Displays a small color dot badge from the wallpaper's dominant color
- Wrapped in `React.memo` for render optimization

### `CategoryChip.js`
- Pill-shaped button used for both topic and sort filters
- Two variants: `topicChip` (larger, with icon) and `sortChip` (compact)
- Active state highlighted with primary color background
- Wrapped in `React.memo`

### `ApplyWallpaperSheet.js`
- Bottom sheet modal (React Native `Modal` with slide animation)
- Shows mini preview of the wallpaper
- Three options: Home Screen, Lock Screen, Both Screens
- Each option has icon, label, and description

### `LoadingSpinner.js`
- Two modes: inline (small) and fullScreen (centered large)
- Themed with primary color from current theme

---

## 🪝 Custom Hooks

### `useWallpapers(initialQuery)`
The core data-fetching hook powering Home and Search screens.

| Feature | Details |
|---|---|
| **State Managed** | `wallpapers[]`, `loading`, `error`, `page`, `query`, `categories`, `sorting`, `seed`, `hasMore` |
| **Pagination** | Automatic page tracking, `loadMore()` increments page, detects last page from API meta |
| **Incognito Support** | Dynamically switches purity filter — `100` (SFW) in normal mode, `011` (Sketchy+NSFW) in incognito |
| **Random Seed** | Preserves seed for consistent random ordering across pages |
| **`updateFilters()`** | Accepts partial filter updates, resets page to 1, clears results |
| **`refresh()`** | Full reset — clears seed, resets page, re-fetches |

### `useDownload()`
Handles wallpaper downloads to local storage.

| Feature | Details |
|---|---|
| **Permission Handling** | Requests `READ_MEDIA_IMAGES` (Android 13+) or `WRITE_EXTERNAL_STORAGE` (older) |
| **Download Location** | `Pictures/WallCraft/wallhaven-{id}.{ext}` |
| **Progress Tracking** | Real-time percentage via RNFS progress callback |
| **Duplicate Detection** | Checks if file already exists before downloading |
| **Media Scanner** | Triggers `RNFS.scanFile()` so the image appears in the gallery immediately |

### `useFavorites()`
Manages the user's saved wallpapers collection.

| Feature | Details |
|---|---|
| **Storage** | AsyncStorage with key `favorites_list` |
| **Operations** | `addFavorite()`, `removeFavorite()`, `toggleFavorite()`, `isFavorite()` |
| **State** | `favorites[]` array, `loading` boolean |
| **Refresh** | `refreshFavorites()` for manual reload (called on screen focus) |

---

## 🌐 API Integration

### Wallhaven API (`src/api/wallhaven.js`)

The app uses the **[Wallhaven API v1](https://wallhaven.cc/help/api)** as its sole data source.

**Base URL:** `https://wallhaven.cc/api/v1`

#### Endpoints Used

| Function | Endpoint | Purpose |
|---|---|---|
| `searchWallpapers()` | `GET /search` | Search/browse wallpapers with filters |
| `getWallpaperDetails()` | `GET /w/{id}` | Get full metadata for a single wallpaper |

#### Search Parameters

| Parameter | Default | Description |
|---|---|---|
| `q` | `''` | Search query (keyword, tag, color) |
| `page` | `1` | Pagination page number |
| `purity` | `'100'` | Content filter: `100`=SFW, `011`=Sketchy+NSFW |
| `categories` | `'111'` | Category filter: General, Anime, People |
| `sorting` | `'random'` | Sort method: hot, toplist, random, date_added, relevance |
| `seed` | `''` | Random seed for consistent pagination |
| `ratios` | `'portrait'` | Only fetch portrait-orientation wallpapers |

#### Error Handling
- **429** → Rate limit exceeded
- **401** → Invalid API key
- Generic error catching with console logging

---

## 🎨 Theming System

The app features a **3-mode theming system** managed by React Context.

### Theme Modes

| Mode | Background | Primary Color | Trigger |
|---|---|---|---|
| **Light** | `#F5F5FA` | `#6200EE` (Deep Purple) | Default on light system theme |
| **Dark** | `#0A0A0F` | `#7C4DFF` (Purple) | Toggle in Settings or dark system theme |
| **Incognito** | `#000000` | `#E91E63` (Pink) | Toggle from Home Screen lock icon |

### Architecture

```
ThemeContext.js (Provider)
    │
    ├── Reads system color scheme via useColorScheme()
    ├── Loads saved preference from AsyncStorage
    ├── Provides: { isDark, isIncognito, colors, toggleTheme, toggleIncognito, fonts }
    │
    └── colors.js (Token Definitions)
         ├── darkTheme   → 16 color tokens
         ├── lightTheme  → 16 color tokens
         └── incognitoTheme → 16 color tokens
```

### Color Tokens (per theme)

`background`, `surface`, `surfaceElevated`, `primary`, `primaryGlow`, `text`, `textSecondary`, `accent`, `danger`, `border`, `card`, `tabBar`, `tabBarActive`, `tabBarInactive`, `notification`, `gradient`

---

## 🧭 Navigation Architecture

Built with **React Navigation v7** using a combination of Bottom Tabs and Native Stacks.

```
NavigationContainer
└── Tab.Navigator (Bottom Tabs — custom BottomTabBar)
    ├── HomeTab (Stack Navigator)
    │   ├── Home (HomeScreen)
    │   └── WallpaperDetail (WallpaperDetailScreen)
    │
    ├── SearchTab (Stack Navigator)
    │   ├── Search (SearchScreen)
    │   └── WallpaperDetail (WallpaperDetailScreen)
    │
    ├── SavedTab (Stack Navigator)
    │   ├── SavedMain (SavedScreen)
    │   └── WallpaperDetail (WallpaperDetailScreen)
    │
    └── SettingsTab (SettingsScreen — no stack)
```

### Custom Bottom Tab Bar
- **Floating pill design** — Rounded container (`borderRadius: 28`) positioned absolutely at the bottom
- **Material Icons** — Home, Search, Favorite, Settings
- **Active indicator** — Highlighted icon background with `primaryGlow` color
- **Auto-hide** — Tab bar disappears on the WallpaperDetail screen for immersive viewing
- **Safe area aware** — Respects device bottom insets

---

## 💾 Data Persistence

All persistence uses **AsyncStorage** via the `storage.js` utility.

| Key | Data | Purpose |
|---|---|---|
| `theme_pref` | `"dark"` or `"light"` | Remember the user's theme choice across app restarts |
| `favorites_list` | JSON array of wallpaper objects | Full wallpaper data for offline display in Saved screen |

> **Note:** Incognito mode is session-only — it resets on app restart and stores nothing.

---

## 🔒 Android Permissions

Declared in `AndroidManifest.xml`:

| Permission | Purpose |
|---|---|
| `INTERNET` | Fetch wallpapers from Wallhaven API |
| `WRITE_EXTERNAL_STORAGE` | Save downloads (Android < 13) |
| `READ_MEDIA_IMAGES` | Access media gallery (Android 13+) |

Runtime permission requests are handled in `useDownload.js` with appropriate user-facing dialogs.

---

## 🚀 How to Run

### Prerequisites
- Node.js `>= 22.11.0`
- React Native CLI
- Android Studio with SDK configured
- JDK 17+

### Commands

```bash
# Install dependencies
npm install

# Start Metro bundler
npm start

# Run on Android device/emulator
npm run android

# Run on iOS (requires macOS + Xcode)
npm run ios

# Run tests
npm test

# Lint code
npm run lint
```

### Build Release APK

```bash
cd android
./gradlew assembleRelease
```

The release APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

---

## 📊 Summary

| Metric | Value |
|---|---|
| **Total Screens** | 5 |
| **Reusable Components** | 4 |
| **Custom Hooks** | 3 |
| **Theme Modes** | 3 (Light, Dark, Incognito) |
| **API Endpoints Used** | 2 |
| **Dependencies** | 13 runtime + 12 dev |
| **Platform** | Android (primary), iOS (supported) |
| **Source Files** | ~20 JavaScript/TypeScript files |

---

*Documentation generated on March 13, 2026*
