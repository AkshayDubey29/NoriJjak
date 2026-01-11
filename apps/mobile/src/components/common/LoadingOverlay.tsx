import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { Theme } from '../../constants/Theme';

interface LoadingOverlayProps {
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  content: {
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.xl,
    borderRadius: Theme.radius['2xl'],
    alignItems: 'center',
    ...Theme.shadows.md,
  },
  message: {
    marginTop: Theme.spacing.md,
    ...Theme.typography.bodySmall,
    color: Theme.colors.secondary,
    fontWeight: '600',
  },
});
