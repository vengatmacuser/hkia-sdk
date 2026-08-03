/**
 * Reference Backup Example: HKIACheckInButton.tsx
 * Location: src/components/myTripComponents/HKIACheckInButton.tsx
 */

import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

// HKIA Plugin Package
import {
  setBCBPData,
  CheckInSDKService,
  BagDropSDKService,
} from 'react-native-hkia-sdk';

import envConfig from '../../network/envConfig';

export const HKIACheckInButtonExample = ({ item, lastName }: any) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isTokenEnrolled, setIsTokenEnrolled] = useState(false);

  // Dynamic sandbox flag per env profile (SIT, UAT, PREPROD = true; PROD = false)
  const isSandboxEnv = envConfig?.hkiaIsSandbox ?? false;

  const handlePress = async () => {
    try {
      // Step 2: Scan Passport & Enroll BCBP Token
      if (!isTokenEnrolled) {
        const scanSuccess = await CheckInSDKService.initializeWithNames(
          'SMITH',
          'JOHN'
        );

        if (scanSuccess) {
          const bcbpToken = 'M1SMITH/JOHN       EPNR123HKGBKK...';
          const processRes = await CheckInSDKService.processPassport(bcbpToken);
          if (processRes.success) {
            setIsTokenEnrolled(true);
            Alert.alert('Passport Enrolled', 'Passport chip scanned successfully!');
          }
        }
      } else {
        // Step 3: Launch Self BagDrop Flow
        const bagDropRes = await BagDropSDKService.startBagDropFlow({
          bcbp: 'M1SMITH/JOHN       EPNR123HKGBKK...',
          isSandbox: isSandboxEnv,
        });

        if (bagDropRes.success) {
          Alert.alert('BagDrop Completed', 'Self BagDrop completed successfully!');
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'HKIA SDK error');
    }
  };

  return (
    <View style={{ marginTop: 8 }}>
      {/* Button component UI */}
    </View>
  );
};
