/**
 * Reference Backup Example: Navigators.tsx Screen Registration
 * Location: src/navigation/Navigators.tsx
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  BoardingPassGenerator as BoardingPassGeneratorScreen,
  TravelReadyGuide,
} from 'react-native-hkia-sdk';

const Stack = createNativeStackNavigator();

export const AppNavigatorExample = () => (
  <Stack.Navigator>
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
  </Stack.Navigator>
);
