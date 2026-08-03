import { NativeModules } from 'react-native';
import { HKIAInitConfig, HKIABagDropOptions, HKIABagDropResult } from '../types/native';
import { HKIALanguage } from '../types/i18n';
import { HKIALogger } from './logger';

const { BagDropSDKModule } = NativeModules;

/**
 * BagDropSDKService - Strongly-typed JS Proxy for HKIA Self BagDrop SDK.
 */
export class BagDropSDKService {
  private static activeLanguage: HKIALanguage = 'en';

  private static getNativeModule() {
    if (!BagDropSDKModule) {
      HKIALogger.warn('HKIA:BagDrop', 'NATIVE_MODULE_MISSING', 'BagDropSDKModule unlinked or running in mock environment.');
      return null;
    }
    return BagDropSDKModule;
  }

  static async initializeConfig(config: HKIAInitConfig): Promise<boolean> {
    HKIALogger.info('HKIA:BagDrop', 'STEP 1/3: BAGDROP_CONFIG_INIT', `Initializing BagDrop config (appId=${config.appId})`);
    if (config.language) this.activeLanguage = config.language as HKIALanguage;
    const native = this.getNativeModule();
    if (!native) return true;
    try {
      return await native.initializeBagDropConfig(config.appId, config.apiKey);
    } catch (e: any) {
      HKIALogger.error('HKIA:BagDrop', 'ERROR_BAGDROP_CONFIG', `BagDrop config failed: ${e.message}`);
      return false;
    }
  }

  static async startBagDropFlow(options?: HKIABagDropOptions, language?: HKIALanguage): Promise<HKIABagDropResult> {
    const lang = language || this.activeLanguage;
    HKIALogger.info('HKIA:BagDrop', 'STEP 2/3: BAGDROP_LAUNCH', `Launching BagDrop flow (lang=${lang})`);
    const native = this.getNativeModule();
    if (!native) {
      return {
        success: true,
        claimTagJson: JSON.stringify({ claimTag: `HKIA_TAG_MOCK_${Date.now()}`, passenger: 'PASSENGER' }),
      };
    }
    try {
      const res = await native.startBagDropFlow(options || {});
      HKIALogger.info('HKIA:BagDrop', 'STEP 3/3: BAGDROP_SUCCESS', `BagDrop claim tag generated`);
      return res;
    } catch (e: any) {
      HKIALogger.error('HKIA:BagDrop', 'ERROR_BAGDROP_LAUNCH', `BagDrop flow failed: ${e.message}`);
      return { success: false };
    }
  }
}
