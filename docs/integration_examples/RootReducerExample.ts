/**
 * Reference Backup Example: root-reducer.ts Redux Slice Combination
 * Location: src/redux/reducers/root-reducer.ts
 */

import { combineReducers } from 'redux';
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
  // Other host app reducers...
});
