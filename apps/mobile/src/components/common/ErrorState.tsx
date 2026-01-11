import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Theme } from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = '문제가 발생했습니다',
  message = '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  onRetry,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <Ionicons name="alert-circle" size={64} color={Theme.colors.destructive} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <Button
          title="다시 시도"
          onPress={onRetry}
          variant="outline"
          size="md"
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.xl,
  },
  iconContainer: {
    marginBottom: Theme.spacing.lg,
    opacity: 0.8,
  },
  title: {
    ...Theme.typography.h3,
    color: Theme.colors.secondary,
    textAlign: 'center',
    marginBottom: Theme.spacing.xs,
  },
  message: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.mutedForeground,
    textAlign: 'center',
    marginBottom: Theme.spacing.xl,
    lineHeight: 20,
  },
  button: {
    minWidth: 160,
  },
});
