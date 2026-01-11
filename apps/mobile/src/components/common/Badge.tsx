import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Theme } from '../../constants/Theme';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'destructive' | 'warning' | 'info' | 'slate';
  size?: 'sm' | 'md';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  style,
  textStyle,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return { container: styles.successContainer, text: styles.successText };
      case 'destructive':
        return { container: styles.destructiveContainer, text: styles.destructiveText };
      case 'warning':
        return { container: styles.warningContainer, text: styles.warningText };
      case 'info':
        return { container: styles.infoContainer, text: styles.infoText };
      case 'slate':
        return { container: styles.slateContainer, text: styles.slateText };
      default:
        return { container: styles.primaryContainer, text: styles.primaryText };
    }
  };

  const vStyles = getVariantStyles();

  return (
    <View style={[
      styles.baseContainer, 
      vStyles.container, 
      size === 'sm' ? styles.smContainer : styles.mdContainer,
      style
    ]}>
      <Text style={[
        styles.baseText, 
        vStyles.text, 
        size === 'sm' ? styles.smText : styles.mdText,
        textStyle
      ]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    borderRadius: Theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    fontWeight: '700',
  },
  smContainer: {
    paddingHorizontal: Theme.spacing.xs,
    paddingVertical: 1,
  },
  mdContainer: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 2,
  },
  smText: {
    fontSize: 10,
  },
  mdText: {
    fontSize: 12,
  },
  // Variants
  primaryContainer: { backgroundColor: Theme.colors.indigo[50] },
  primaryText: { color: Theme.colors.primary },
  successContainer: { backgroundColor: Theme.colors.emerald[50] },
  successText: { color: Theme.colors.emerald[600] },
  destructiveContainer: { backgroundColor: Theme.colors.rose[50] },
  destructiveText: { color: Theme.colors.rose[600] },
  warningContainer: { backgroundColor: Theme.colors.amber[50] },
  warningText: { color: Theme.colors.amber[600] },
  infoContainer: { backgroundColor: Theme.colors.blue[50] },
  infoText: { color: Theme.colors.blue[600] },
  slateContainer: { backgroundColor: Theme.colors.slate[100] },
  slateText: { color: Theme.colors.slate[600] },
});
