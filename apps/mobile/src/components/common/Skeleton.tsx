import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Theme } from '../../constants/Theme';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  circle?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  width = '100%', 
  height = 20, 
  circle = false,
  style 
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [opacity]);

  const skeletonStyle: ViewStyle = {
    width: width as any,
    height: height as any,
    borderRadius: circle ? 9999 : Theme.radius.md,
    backgroundColor: Theme.colors.slate[200],
  };

  return (
    <Animated.View style={[skeletonStyle, { opacity }, style]} />
  );
};
