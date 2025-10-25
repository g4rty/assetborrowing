import 'dart:io' show Platform;

class ApiConfig {
  ApiConfig._();

  // Android emulator maps this to host loopback (use when testing on Android Studio emulator).
  static const String androidEmulatorBaseUrl = 'http://10.0.2.2:3000';

  // iOS simulator talks directly to the host loopback (use when testing on Xcode Simulator).
  static const String iosSimulatorBaseUrl = 'http://127.0.0.1:3000';

  // Set this to your machine's LAN IP when testing on physical devices (edit as needed).
  // static const String lanBaseUrl = 'http://192.168.1.50:3000';

  // Helper that returns the right URL by platform; default falls back to Android emulator value.
  static String apihost() {
    // if (const bool.fromEnvironment('USE_LAN_URL')) {
    //   return lanBaseUrl;
    // }
    if (Platform.isIOS) {
      return iosSimulatorBaseUrl;
    }
    return androidEmulatorBaseUrl;
  }
}
