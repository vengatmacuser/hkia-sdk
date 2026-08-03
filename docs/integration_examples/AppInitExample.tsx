/**
 * Reference Backup Example: App.tsx HKIA SDK Initialization
 * Location: App.tsx
 */

import React, { useEffect } from 'react';
import { CheckInSDKService, BagDropSDKService } from 'react-native-hkia-sdk';
import envConfig from './src/network/envConfig';

export const useHKIASDKInit = () => {
  useEffect(() => {
    const initHKIA = async () => {
      try {
        if (envConfig.hkiaCheckInAppId && envConfig.hkiaCheckInApiKey) {
          await CheckInSDKService.initializeConfig({
            appId: envConfig.hkiaCheckInAppId,
            apiKey: envConfig.hkiaCheckInApiKey,
            language: 'en', // Optional: 'cn' | 'de' | 'en' | 'fr' | 'gb' | 'hk' | 'it' | 'jp' | 'ko' | 'th' | 'tw' | 'zh'
          });
        }
        if (envConfig.hkiaBagDropAppId && envConfig.hkiaBagDropApiKey) {
          await BagDropSDKService.initializeConfig({
            appId: envConfig.hkiaBagDropAppId,
            apiKey: envConfig.hkiaBagDropApiKey,
            language: 'en',
          });
        }
      } catch (e) {
        console.warn('[HKIA-SDK] Initialization error:', e);
      }
    };
    initHKIA();
  }, []);
};
