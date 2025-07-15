# 📱 DrishiQ Mobile App Deployment Guide

## 🚀 Overview
This guide will help you deploy your DrishiQ Next.js web app to both Google Play Store and Apple App Store using Capacitor.

## 📋 Prerequisites

### For Android (Google Play Store):
- Android Studio installed
- Java Development Kit (JDK) 11 or higher
- Android SDK and build tools
- Google Play Console account ($25 one-time fee)

### For iOS (Apple App Store):
- macOS computer
- Xcode installed
- Apple Developer account ($99/year)
- iOS device for testing

## 🔧 Setup Instructions

### 1. Build the Web App
```bash
npm run build
```

### 2. Sync with Mobile Platforms
```bash
npx cap sync
```

## 📱 Android Deployment

### 1. Open Android Studio
```bash
npm run mobile:android
```

### 2. Configure App Details
- Open `android/app/src/main/res/values/strings.xml`
- Update app name and package details
- Add app icons in `android/app/src/main/res/mipmap-*` folders

### 3. Generate Signed APK
1. In Android Studio: Build → Generate Signed Bundle/APK
2. Choose "Android App Bundle" (recommended)
3. Create a new keystore or use existing one
4. Fill in keystore details and save them securely
5. Select "release" build variant
6. Click "Finish"

### 4. Upload to Google Play Console
1. Go to [Google Play Console](https://play.google.com/console)
2. Create a new app
3. Fill in app details:
   - App name: DrishiQ
   - Description: Your app description
   - Category: Productivity/Education
   - Privacy Policy: Required
4. Upload the generated AAB file
5. Complete store listing with screenshots
6. Submit for review

## 🍎 iOS Deployment

### 1. Open Xcode
```bash
npm run mobile:ios
```

### 2. Configure Project Settings
1. Select your project in Xcode
2. Update Bundle Identifier: `com.drishiq.app`
3. Set Team to your Apple Developer account
4. Configure signing certificates

### 3. Add App Icons and Launch Screen
1. Add app icons to `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
2. Configure launch screen in `ios/App/App/Base.lproj/LaunchScreen.storyboard`

### 4. Archive and Upload
1. In Xcode: Product → Archive
2. Once archived, click "Distribute App"
3. Choose "App Store Connect"
4. Upload to App Store Connect

### 5. Submit to App Store
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Complete app information
3. Add screenshots and metadata
4. Submit for review

## 🎨 App Assets Required

### Android Icons (Place in `android/app/src/main/res/`)
- `mipmap-mdpi/ic_launcher.png` (48x48px)
- `mipmap-hdpi/ic_launcher.png` (72x72px)
- `mipmap-xhdpi/ic_launcher.png` (96x96px)
- `mipmap-xxhdpi/ic_launcher.png` (144x144px)
- `mipmap-xxxhdpi/ic_launcher.png` (192x192px)

### iOS Icons (Place in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`)
- Various sizes from 20x20 to 1024x1024px

### Screenshots for Store Listings
- Android: 1080x1920px (portrait), 1920x1080px (landscape)
- iOS: Various device sizes (iPhone, iPad)

## 🔐 Security Considerations

### Environment Variables
Make sure to set these in your production environment:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

### App Permissions
Update permissions in:
- Android: `android/app/src/main/AndroidManifest.xml`
- iOS: `ios/App/App/Info.plist`

## 🚀 Quick Commands

```bash
# Build and sync all platforms
npm run mobile:build

# Open Android Studio
npm run mobile:android

# Open Xcode
npm run mobile:ios

# Run on Android device
npm run mobile:run:android

# Run on iOS device
npm run mobile:run:ios
```

## 📝 Store Listing Information

### App Description Template
```
DrishiQ - Intelligence of Perception

Transform your digital experience with DrishiQ, a powerful multi-language application that brings intelligence to your fingertips.

Features:
✓ Multi-language support (17 languages)
✓ Secure authentication with Supabase
✓ Phone verification with Firebase
✓ Modern, responsive design
✓ Offline support with PWA capabilities
✓ Cross-platform compatibility

"See Through the Challenge" - Experience the power of perception with DrishiQ.
```

### Keywords
- productivity
- multi-language
- authentication
- secure
- mobile app
- cross-platform

## 🔄 Update Process

1. Make changes to your web app
2. Test thoroughly
3. Run `npm run build`
4. Run `npx cap sync`
5. Build new versions in Android Studio/Xcode
6. Upload to respective stores

## 📞 Support

For issues or questions:
- Check Capacitor documentation: https://capacitorjs.com/docs
- Android: https://developer.android.com/studio
- iOS: https://developer.apple.com/xcode

## 📊 Analytics and Monitoring

Consider adding:
- Google Analytics for Firebase
- Crashlytics for crash reporting
- Performance monitoring

---

**Note**: This process may take several days to weeks for first-time submissions due to store review processes. Plan accordingly! 