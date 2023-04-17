Mixer
=====
Human Computer Interactors &bull; CS 378: Introduction to Human/Computer
Interactions

## Instructions to run and develop locally

First, [install and set up Expo](https://docs.expo.dev/get-started/installation/).

This project runs on web, Android, and iOS. Note that the web version
currently has limited functionality (cannot play tracks).

### Web

To run on web, simply run the command
```bash
npx expo start
```

Then type `w` to build for web client. The build should be hosted at
[http://localhost:19006](http://localhost:19006), which you can also
open on other devices.

### Development Builds

To run on iOS or Android, you will need to create an EAS development
build. Run the following commands to install and set up EAS CLI:
```bash
npm install -g eas-cli
eas login
```
You can check whether you are logged in by running `eas whoami`.

### iOS Device

To run on your own iOS device, you will need to have an Apple Developer
account. Additionally, you cannot connect connect to the Expo development
server on UT wifi. If either of these are an issue, try running on an iOS
simulator instead.

First, you'll need to register your device with EAS:
```bash
eas device:create
```
After following the provided prompts, you can create the development build
by running
```bash
eas build --profile development --platform ios
```

### iOS Simulator

To run on an iOS simulator, you'll first need to
[install Xcode](https://apps.apple.com/us/app/xcode/id497799835?mt=12).
Once it has finished installing, open Xcode and the Simulator app and agree
to all provided terms.

Then, create the build by running
```bash
eas build --profile development-simulator --platform ios
```

Once the build is complete, the CLI will prompt you to install it on
the Simulator. Press `Y` to proceed. Alternatively, you can run
```bash
eas build:run -p ios
```
This allows you to select the specific build you would like to install on
the Simulator.

### Android (Device or Emulator)

For Android, you simply need to generate an .apk file that can be downloaded
on either a device or emulator. Run the command
```bash
eas build --profile development --platform android
```

For an emulator, wait until the build finishes and then select `Y` when
prompted to install the build. Alternatively, you can follow the provided
link on the build details page (linked when building) on your Android
device to install the build.

### More details

For more details on building and running the app, refer to
[Expo documentation](https://docs.expo.dev/develop/development-builds/create-a-build/#create-a-development-build-for-the-device)