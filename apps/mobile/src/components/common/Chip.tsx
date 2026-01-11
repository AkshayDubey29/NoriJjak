import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import { Theme } from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'outline' | 'slate';
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  icon,
  style,
  textStyle,
  variant = 'outline',
}) => {
  const isPressable = !!onPress;

  const getVariantStyles = () => {
    if (selected) {
      return {
        container: styles.selectedContainer,
        text: styles.selectedText,
        icon: Theme.colors.primaryForeground,
      };
    }

    switch (variant) {
      case 'primary':
        return {
          container: styles.primaryContainer,
          text: styles.primaryText,
          icon: Theme.colors.primaryForeground,
        };
      case 'slate':
        return {
          container: styles.slateContainer,
          text: styles.slateText,
          icon: Theme.colors.slate[500],
        };
      default:
        return {
          container: styles.outlineContainer,
          text: styles.outlineText,
          icon: Theme.colors.muted,
        };
    }
  };

  const vStyles = getVariantStyles();

  return (
    <TouchableOpacity
      disabled={!isPressable}
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.baseContainer,
        vStyles.container,
        style,
      ]}
    >
      {icon && (
        <Ionicons 
          name={icon} 
          size={16} 
          color={vStyles.icon} 
          style={styles.icon} 
        />
      )}
      <Text style={[styles.baseText, vStyles.text, textStyle]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.radius.full,
    marginRight: Theme.spacing.xs,
    marginBottom: Theme.spacing.xs,
    borderWidth: 1,
  },
  baseText: {
    fontSize: 14,
    fontWeight: '600',
  },
  icon: {
    marginRight: Theme.spacing.xs,
  },
  // Variants
  outlineContainer: {
    backgroundColor: Theme.colors.surface,
    borderColor: Theme.colors.slate[200],
  },
  outlineText: {
    color: Theme.colors.slate[600],
  },
  primaryContainer: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  primaryText: {
    color: Theme.colors.primaryForeground,
  },
  slateContainer: {
    backgroundColor: Theme.colors.slate[50],
    borderColor: Theme.colors.slate[100],
  },
  slateText: {
    color: Theme.colors.slate[700],
  },
  selectedContainer: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
    ...Theme.shadows.sm,
  },
  selectedText: {
    color: Theme.colors.primaryForeground,
  },
});
