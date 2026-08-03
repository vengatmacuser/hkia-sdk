import React from 'react';
import { StyleSheet, View } from 'react-native';

export interface ScreenGradientProps {
  children?: React.ReactNode;
}

export const ScreenGradient: React.FC<ScreenGradientProps> = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
