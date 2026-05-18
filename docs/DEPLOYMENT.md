# EtherScope V2 — Deployment Guide

## Overview

EtherScope uses **EAS (Expo Application Services)** for building and deploying to iOS and Android.

---

## Prerequisites

- Node.js and npm installed
- Expo CLI (`npm install -g eas-cli`)
- Apple Developer Account (for iOS)
- Google Play Developer Account (for Android)
- Git repository initialized

---

## Initial Setup (First Time Only)

### 1. Install EAS CLI
```bash
npm install -g eas-cli
```

### 2. Initialize EAS Project
```bash
eas init
```

This creates `eas.json` and links your project to Expo Dashboard.

### 3. Configure Build Profiles
Your `eas.json` should have:
```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  }
}
```

### 4. Update app.json
Ensure these fields are set:
```json
{
  "expo": {
    "name": "EtherScope",
    "slug": "ether-scope-v2",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#000000"
    },
    "android": {
      "versionCode": 1,
      "package": "com.yourcompany.etherscope"
    },
    "ios": {
      "bundleIdentifier": "com.yourcompany.etherscope",
      "buildNumber": "1"
    }
  }
}
```

---

## Deployment Steps

### Step 1: Prepare for Deployment
```bash
cd ether-scope
npm install
npm run build  # Ensure no TypeScript errors
```

### Step 2: Update Version Numbers
In `app.json`:
```json
{
  "expo": {
    "version": "1.0.1"  // Bump minor/patch version
  },
  "android": {
    "versionCode": 2    // Increment by 1
  },
  "ios": {
    "buildNumber": "2"  // Increment by 1
  }
}
```

### Step 3: Test Locally (Optional)
```bash
npm start
# Test on simulator/device before building
```

### Step 4: Build for iOS
```bash
eas build --platform ios
```

This will:
- Compile your app for iOS
- Sign it with your certificates
- Create an .ipa file
- Upload to Expo Dashboard

**Status**: Check at `https://expo.dev/accounts/[your-account]/projects/ether-scope-v2/builds`

### Step 5: Build for Android
```bash
eas build --platform android
```

This will:
- Compile your app for Android
- Sign it with your keystore
- Create an .aab file (for Play Store) or .apk (for testing)
- Upload to Expo Dashboard

### Step 6: Build Both Platforms (Recommended)
```bash
eas build --platform all
```

Builds iOS and Android in parallel.

---

## Publishing to App Stores

### iOS App Store
```bash
eas submit --platform ios
```

Prompts for:
- Apple ID credentials
- App Store Connect credentials
- Whether to skip waiting for review

### Android Play Store
```bash
eas submit --platform android
```

Prompts for:
- Google Play credentials
- Which track (internal, alpha, beta, production)

### Submit Both
```bash
eas submit --platform all
```

---

## Testing Before Production

### Preview Build (for TestFlight/Beta Testing)
```bash
# iOS preview (simulator)
eas build --platform ios --profile preview

# Android preview (APK for testing)
eas build --platform android --profile preview
```

### Internal Testing Track
```bash
eas submit --platform android --track internal
```

This uploads to Google Play's internal testing track without public release.

---

## Post-Deployment Checklist

- [ ] Version numbers incremented in `app.json`
- [ ] Changes committed to git
- [ ] Build completed successfully
- [ ] Test app on physical device/TestFlight
- [ ] Check App Store/Play Store listing
- [ ] Monitor analytics in Firebase/Amplitude
- [ ] Update SESSION_LOG.md with deployment info

---

## Troubleshooting

### Build fails with "No signing certificate"
```bash
eas credentials
```
This opens the credentials manager to set up signing certificates.

### "Unauthorized" when submitting
Verify your Apple/Google account credentials:
```bash
eas submit --platform ios --clear-cache
```

### Slow build times
- Clear Expo cache: `eas build --platform all --clear-cache`
- Check internet connection
- Monitor at https://expo.dev (may show queue)

### Version already exists
Increment version and versionCode in `app.json`:
```json
{
  "version": "1.0.2",
  "android": { "versionCode": 3 }
}
```

---

## Monitoring & Analytics

After deployment:
1. Check app store reviews and ratings
2. Monitor crash logs in Expo Dashboard
3. Track user metrics in Firebase Console
4. Review build logs for warnings

---

## Rollback (If Needed)

If deployment breaks the app:
1. Revert changes locally: `git revert <commit>`
2. Increment version number again
3. Run `eas build --platform all`
4. Submit update to app stores

---

## Environment Variables

Ensure sensitive data is in `.env` or Expo secrets:
```bash
eas secret:create --scope project --name CLERK_SECRET_KEY
eas secret:list
```

These are injected at build time securely.

---

## Further Reading

- [Expo EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [Expo EAS Submit Docs](https://docs.expo.dev/submit/introduction/)
- [Expo Versioning Guide](https://docs.expo.dev/build/updates/)
