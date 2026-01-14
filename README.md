# Trip Countdown

Simple local-only Expo app that tracks a single business trip and shows a countdown with fun status images.

## What to install on Ubuntu

1) Node.js (LTS) and npm
- Recommended: use `nvm` to install Node LTS.

2) Expo CLI (local)
- You will run Expo using `npx expo ...` after installing dependencies.

3) Android/Apple device support
- Android: no extra local install needed if you use the Expo Go app on your phone.
- iOS: no extra local install needed if you use the Expo Go app on your phone.

Optional for device simulators:
- Android Studio (Android emulator)
- Xcode (iOS simulator, macOS only)

## Install Node.js (Ubuntu)

Using nvm (recommended):
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts
```

Check versions:
```bash
node -v
npm -v
```

## Setup and run the app

```bash
npm install
npx expo start
```

This starts the Expo development server and shows a QR code.

## Run on a phone (Android or iOS)

1) Install the Expo Go app:
   - Android: Google Play
   - iOS: App Store
2) Make sure your phone and computer are on the same Wi‑Fi network.
3) In the Expo terminal, scan the QR code:
   - Android: use the Expo Go app scanner.
   - iOS: use the Camera app, then open in Expo Go.

## Project structure

```
.
├── App.tsx
├── app.json
├── babel.config.js
├── package.json
├── tsconfig.json
├── assets
│   ├── pretrip.png
│   ├── tired.png
│   ├── cope.png
│   ├── almost.png
│   └── celebration.png
└── src
    ├── lib
    │   ├── date.ts
    │   ├── storage.ts
    │   └── trip.tsx
    └── screens
        ├── HomeScreen.tsx
        └── SettingsScreen.tsx
```

## How the app works

- The app stores one trip (start/end) locally using AsyncStorage.
- Dates are normalized to local midnight before calculations to avoid timezone off‑by‑one issues.
- Countdown rules:
  - Before trip: “Trip starts in X days”
  - During trip: “X days left until Friday” (Mon–Fri default) or “until trip ends” for custom range
  - After trip: “Trip finished 🎉” and “Days since trip ended: Y”

## Key files

- `App.tsx`: Navigation + app-wide context for trip dates.
- `src/lib/date.ts`: Date helpers (startOfDay, diffDays, Mon/Fri helpers, range format).
- `src/lib/storage.ts`: AsyncStorage wrapper with JSON parsing.
- `src/screens/HomeScreen.tsx`: Countdown display + status image + Settings button.
- `src/screens/SettingsScreen.tsx`: Date pickers + quick set buttons + validation.

## Replace images

Replace any of the PNGs in `assets/` with your own. Keep filenames the same.
