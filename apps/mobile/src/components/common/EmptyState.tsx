import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Theme } from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  actionTitle?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = 'document-text-outline',
  actionTitle,
  onAction,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={64} color={Theme.colors.muted} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {actionTitle && onAction && (
        <Button
          title={actionTitle}
          onPress={onAction}
          variant="secondary"
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
    opacity: 0.5,
  },
  title: {
    ...Theme.typography.h3,
    color: Theme.colors.secondary,
    textAlign: 'center',
    marginBottom: Theme.spacing.xs,
  },
  description: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.mutedForeground,
    textAlign: 'center',
    marginBottom: Theme.spacing.xl,
  },
  button: {
    minWidth: 160,
  },
});
