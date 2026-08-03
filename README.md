# react-native-hkia-sdk

Enterprise React Native SDK plugin for Hong Kong International Airport (HKIA) Check-In and Self BagDrop integration.

## Installation

```bash
npm install react-native-hkia-sdk
# iOS
cd ios && pod install
```

---

## Minimal Usage Examples

### 1. Initialize SDK Credentials (App.tsx from Environment)

```typescript
// App.tsx
import React, { useEffect } from 'react';
import { CheckInSDKService, BagDropSDKService } from 'react-native-hkia-sdk';
import envConfig from './src/network/envConfig'; // or Config from 'react-native-config'

useEffect(() => {
  const initHKIASDK = async () => {
    try {
      if (envConfig.hkiaCheckInAppId && envConfig.hkiaCheckInApiKey) {
        await CheckInSDKService.initializeConfig({
          appId: envConfig.hkiaCheckInAppId,
          apiKey: envConfig.hkiaCheckInApiKey,
          language: 'en', // Optional: defaults to 'en'
        });
      }
      if (envConfig.hkiaBagDropAppId && envConfig.hkiaBagDropApiKey) {
        await BagDropSDKService.initializeConfig({
          appId: envConfig.hkiaBagDropAppId,
          apiKey: envConfig.hkiaBagDropApiKey,
          language: 'en', // Optional: defaults to 'en'
        });
      }
    } catch (error) {
      console.warn('HKIA SDK initialization error:', error);
    }
  };

  initHKIASDK();
}, []);
```

---

### 2 & 3. Scan Passport, Enroll BCBP Token & Launch BagDrop (CheckInCard.tsx)

```typescript
// CheckInCard.tsx / HKIACheckInButton.tsx
import { CheckInSDKService, BagDropSDKService } from 'react-native-hkia-sdk';

const handleHKIAAction = async () => {
  if (!isTokenEnrolled) {
    // Step 2: Launch passport scanner & enroll BCBP token (package name handled natively)
    const scanSuccess = await CheckInSDKService.initializeWithNames(
      passengerSurname,
      passengerGivenName
    );

    if (scanSuccess) {
      const processRes = await CheckInSDKService.processPassport(bcbpToken);
      if (processRes.success) {
        console.log('Enrolled Token:', processRes.enrollmentToken);
      }
    }
  } else {
    // Step 3: Launch Self BagDrop Flow (hkiaIsSandbox configured per environment; default false)
    const bagDropRes = await BagDropSDKService.startBagDropFlow({
      bcbp: bcbpToken,
      isSandbox: envConfig?.hkiaIsSandbox ?? false,
    });

    if (bagDropRes.success) {
      console.log('Claim Tag JSON:', bagDropRes.claimTagJson);
    }
  }
};
```

---

### 4. Screen Navigation Integration (Navigators.tsx)

```tsx
// src/navigation/Navigators.tsx
import { BoardingPassGenerator as BoardingPassGeneratorScreen, TravelReadyGuide } from 'react-native-hkia-sdk';

<Stack.Screen
  name="BoardingPassGeneratorScreen"
  component={BoardingPassGeneratorScreen}
  options={{
    headerShown: true,
  }}
/>
<Stack.Screen
  name="TravelReadyGuide"
  component={TravelReadyGuide}
  options={{
    headerShown: false,
  }}
/>
```

---

### 5. Redux Reducer Integration (root-reducer.ts)

```typescript
// src/redux/reducers/root-reducer.ts
import {
  checkInTokenEnrolmentReducer,
  modularSdkReducer,
  journeyReducer,
  hkiaTrackingReducer,
} from 'react-native-hkia-sdk';

export const appReducer = combineReducers({
  checkInTokenEnrolment: checkInTokenEnrolmentReducer,
  modularSdk: modularSdkReducer,
  journey: journeyReducer,
  hkiaTracking: hkiaTrackingReducer,
  // ...
});
```

---

## 📁 Backup & Integration Reference Files

Standalone backup reference implementations are stored in the `./docs/integration_examples/` directory for reference and copy-paste operations:

1. 📄 **[App Initialization Example](file:///Users/vengateswaran/Downloads/ThaiAirwaysApp/packages/react-native-hkia-sdk/docs/integration_examples/AppInitExample.tsx)**: Full `App.tsx` startup hook initializing Check-In and BagDrop credentials dynamically.
2. 📄 **[CheckIn Button & Card Example](file:///Users/vengateswaran/Downloads/ThaiAirwaysApp/packages/react-native-hkia-sdk/docs/integration_examples/HKIACheckInButtonExample.tsx)**: Full `HKIACheckInButton.tsx` / `CheckInCard.tsx` component executing Step 2 (Passport Scan & Token Enrollment) and Step 3 (Self BagDrop).
3. 📄 **[Navigation Registration Example](file:///Users/vengateswaran/Downloads/ThaiAirwaysApp/packages/react-native-hkia-sdk/docs/integration_examples/NavigatorsExample.tsx)**: Full `Navigators.tsx` screen registration for `BoardingPassGeneratorScreen` and `TravelReadyGuide`.
4. 📄 **[Redux Reducers Combination Example](file:///Users/vengateswaran/Downloads/ThaiAirwaysApp/packages/react-native-hkia-sdk/docs/integration_examples/RootReducerExample.ts)**: Full `root-reducer.ts` slice combination setup for `checkInTokenEnrolment`, `modularSdk`, `journey`, and `hkiaTracking`.
5. 📄 **[Package Manifest Example](file:///Users/vengateswaran/Downloads/ThaiAirwaysApp/packages/react-native-hkia-sdk/docs/integration_examples/PackageJsonExample.json)**: Full standalone `package.json` manifest for `react-native-hkia-sdk`.

---

## License

MIT
