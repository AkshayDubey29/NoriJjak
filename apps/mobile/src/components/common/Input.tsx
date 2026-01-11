import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  TextInputProps,
  ViewStyle,
  Animated,
  StyleProp,
  Platform
} from 'react-native';
import { Theme } from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: StyleProp<ViewStyle>;
  icon?: keyof typeof Ionicons.glyphMap;
  onIconPress?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  containerStyle,
  icon,
  onIconPress,
  secureTextEntry,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const focusAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(focusAnim, {
      toValue: isFocused ? 1 : 0,
      duration: Theme.timing.fast,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const isPassword = secureTextEntry;
  const shouldHidePassword = isPassword && !isPasswordVisible;

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Theme.colors.slate[200], Theme.colors.primary],
  });

  const backgroundColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Theme.colors.surface, Theme.colors.surface],
  });

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, isFocused && styles.labelFocused, !!error && styles.labelError]}>{label}</Text>}
      
      <Animated.View style={[
        styles.inputWrapper,
        { borderColor, backgroundColor },
        isFocused && styles.inputWrapperFocused,
        !!error && styles.inputWrapperError
      ]}>
        {icon && (
          <TouchableOpacity onPress={onIconPress} disabled={!onIconPress}>
            <Ionicons 
              name={icon} 
              size={20} 
              color={error ? Theme.colors.destructive : isFocused ? Theme.colors.primary : Theme.colors.mutedForeground} 
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
        
        <TextInput
          style={styles.input}
          placeholderTextColor={Theme.colors.muted}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={shouldHidePassword}
          selectionColor={Theme.colors.primary}
          autoCorrect={false}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons 
              name={shouldHidePassword ? 'eye-outline' : 'eye-off-outline'} 
              size={20} 
              color={Theme.colors.mutedForeground} 
            />
          </TouchableOpacity>
        )}
      </Animated.View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Theme.spacing.md,
  },
  label: {
    ...Theme.typography.bodySmallMedium,
    color: Theme.colors.slate[600],
    marginBottom: Theme.spacing.xs,
    marginLeft: 2,
  },
  labelFocused: {
    color: Theme.colors.primary,
  },
  labelError: {
    color: Theme.colors.destructive,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: Theme.radius.lg,
    paddingHorizontal: Theme.spacing.md,
    height: 54,
    ...Platform.select({
      ios: {
        shadowColor: Theme.colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0, // Switched on focus if desired
        shadowRadius: 4,
      },
    })
  },
  inputWrapperFocused: {
    ...Platform.select({
      ios: {
        shadowOpacity: 0.05,
      },
    })
  },
  inputWrapperError: {
    borderColor: Theme.colors.destructive,
  },
  icon: {
    marginRight: Theme.spacing.sm,
  },
  input: {
    flex: 1,
    ...Theme.typography.bodyMedium,
    color: Theme.colors.secondary,
    height: '100%',
    paddingVertical: 0,
  },
  eyeIcon: {
    padding: Theme.spacing.xs,
  },
  errorContainer: {
    marginTop: Theme.spacing.xs,
    marginLeft: 2,
  },
  errorText: {
    ...Theme.typography.caption,
    color: Theme.colors.destructive,
    fontWeight: '600',
  },
  helperText: {
    ...Theme.typography.caption,
    color: Theme.colors.mutedForeground,
    marginTop: Theme.spacing.xs,
    marginLeft: 2,
  },
});
