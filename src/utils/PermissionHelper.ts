import { Platform } from 'react-native';

/**
 * PermissionHelper - Cross-platform device capability and permission checker.
 */
export class PermissionHelper {
  /**
   * Returns true if running on a real mobile device (Android/iOS) with potential NFC hardware.
   */
  static isNfcSupported(): boolean {
    return Platform.OS === 'ios' || Platform.OS === 'android';
  }
}
