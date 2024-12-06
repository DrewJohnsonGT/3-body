# 3-Body Problem

Cross platform mobile app for simulating 2D N-body gravitational systems.

iOS - https://apps.apple.com/us/app/3-body/id6642661687

Create the Android and iOS projects

```bash
pnpm exec cap add android
pnpm exec cap add ios
```

Sync the app with the native projects

```bash
pnpm exec cap sync
```

Open the Android project in Android Studio

```bash
pnpm exec cap open android
```

Open the iOS project in Xcode

```bash
pnpm exec cap open ios
```

Run the app on Android

```bash
pnpm exec cap run android
```

Run the app on iOS

```bash
pnpm exec cap run ios
```

Live reloading using ionic

```bash
ionic cap run android -l --external
ionic cap run ios -l --external
```

## Capacitor Assets

https://github.com/ionic-team/capacitor-assets

For generating the splash screen and icon assets, use the following command:

```bash
npx @capacitor/assets generate
```

## Building Android Bundle

Sync project

```bash
pnpm run build
pnpm exec cap sync
```

Open in Android Studio

```bash
pnpm exec cap open android
```

Select `Build` -> `Generate Signed App Bundle / APK`

Fill out the information

Then continue and build the release bundle This will produce a
`/android/app/release/app-release.aab` file

## Building iOS Archive

Sync project

```bash
pnpm run build
pnpm exec cap sync
```

Open in Xcode

```bash
pnpm exec cap open ios
```

In `Signing & Capabilities` make sure Team is selected In the top bar make sure
`Any iOS Device` is selected

Then select `Product` -> `Archive`

Once the archive is complete, select `Distribute App` and follow the steps to
upload to the App Store or to TestFlight

## Versioning

`capacitor-set-version` can be used to easily set the version of the app in the
iOS and Android projects.

````bash
npx capacitor-set-version -v 1.0.0 -b 1 # Set version to 1.0.0 and build number to 1
# Current version: 1.2.4, build number: 25
# Command:

npx capacitor-set-version -v 1.2.4 -b 25
```
````
