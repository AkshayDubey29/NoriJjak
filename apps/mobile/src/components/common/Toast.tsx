import React, { useEffect, useRef } from 'react';
import { 
  Animated, 
  Text, 
  StyleSheet, 
  Dimensions, 
  Platform 
} from 'react-native';
import { Theme } from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onHide: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'info', 
  onHide, 
  duration = 3000 
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      hide();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const hide = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -20,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onHide());
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: Theme.colors.success,
          icon: 'checkmark-circle' as const,
        };
      case 'error':
        return {
          backgroundColor: Theme.colors.destructive,
          icon: 'alert-circle' as const,
        };
      default:
        return {
          backgroundColor: Theme.colors.secondary,
          icon: 'information-circle' as const,
        };
    }
  };

  const { backgroundColor, icon } = getStyles();

  return (
    <Animated.View style={[
      styles.container, 
      { backgroundColor, opacity, transform: [{ translateY }] }
    ]}>
      <Ionicons name={icon} size={20} color="#fff" style={styles.icon} />
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
    borderRadius: Theme.radius.lg,
    ...Theme.shadows.md,
    zIndex: 9999,
  },
  icon: {
    marginRight: Theme.spacing.sm,
  },
  message: {
    flex: 1,
    ...Theme.typography.bodySmallMedium,
    color: '#ffffff',
  },
});
