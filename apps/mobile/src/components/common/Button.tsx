import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ViewStyle, 
  TextStyle,
  Animated,
  StyleProp,
  Platform
} from 'react-native';
import { Theme } from '../../constants/Theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const animatedValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(animatedValue, {
      toValue: 0.97,
      useNativeDriver: true,
      ...Theme.timing.spring,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
      ...Theme.timing.spring,
    }).start();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          container: styles.secondaryContainer,
          text: styles.secondaryText,
          loader: Theme.colors.secondary,
        };
      case 'ghost':
        return {
          container: styles.ghostContainer,
          text: styles.ghostText,
          loader: Theme.colors.primary,
        };
      case 'outline':
        return {
          container: styles.outlineContainer,
          text: styles.outlineText,
          loader: Theme.colors.primary,
        };
      case 'destructive':
        return {
          container: styles.destructiveContainer,
          text: styles.destructiveText,
          loader: Theme.colors.destructiveForeground,
        };
      default:
        return {
          container: styles.primaryContainer,
          text: styles.primaryText,
          loader: Theme.colors.primaryForeground,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          container: styles.smContainer,
          text: styles.smText,
        };
      case 'lg':
        return {
          container: styles.lgContainer,
          text: styles.lgText,
        };
      default:
        return {
          container: styles.mdContainer,
          text: styles.mdText,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <Animated.View style={[{ transform: [{ scale: animatedValue }] }, style]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={1}
        style={[
          styles.baseContainer,
          variantStyles.container,
          sizeStyles.container,
          disabled && styles.disabledContainer,
        ]}
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || loading, busy: loading }}
        accessibilityLabel={title}
      >
        {loading ? (
          <ActivityIndicator color={variantStyles.loader} size="small" />
        ) : (
          <>
            {icon && <Animated.View style={styles.iconContainer}>{icon}</Animated.View>}
            <Text
              style={[
                styles.baseText,
                variantStyles.text,
                sizeStyles.text,
                disabled && styles.disabledText,
                textStyle,
              ]}
            >
              {title}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Theme.radius.lg,
    ...Platform.select({
      ios: {
        shadowColor: 'transparent',
      },
      android: {
        elevation: 0,
      }
    })
  },
  baseText: {
    fontWeight: '700',
    textAlign: 'center',
  },
  iconContainer: {
    marginRight: Theme.spacing.sm,
  },
  // Variants
  primaryContainer: {
    backgroundColor: Theme.colors.primary,
    ...Theme.shadows.sm,
  },
  primaryText: {
    color: Theme.colors.primaryForeground,
  },
  secondaryContainer: {
    backgroundColor: Theme.colors.slate[100],
  },
  secondaryText: {
    color: Theme.colors.secondary,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Theme.colors.primary,
  },
  outlineText: {
    color: Theme.colors.primary,
  },
  ghostContainer: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: Theme.colors.primary,
  },
  destructiveContainer: {
    backgroundColor: Theme.colors.destructive,
    ...Theme.shadows.sm,
  },
  destructiveText: {
    color: Theme.colors.destructiveForeground,
  },
  disabledContainer: {
    backgroundColor: Theme.colors.slate[100],
    borderColor: 'transparent',
    opacity: 0.5,
  },
  disabledText: {
    color: Theme.colors.mutedForeground,
  },
  // Sizes
  smContainer: {
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.md,
    height: 36,
    borderRadius: Theme.radius.md,
  },
  smText: {
    fontSize: 13,
  },
  mdContainer: {
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.lg,
    height: 48,
    borderRadius: Theme.radius.lg,
  },
  mdText: {
    fontSize: 15,
  },
  lgContainer: {
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.xl,
    height: 56,
    borderRadius: Theme.radius.xl,
  },
  lgText: {
    fontSize: 17,
  },
});
