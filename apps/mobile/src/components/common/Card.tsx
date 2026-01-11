import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { Theme } from '../../constants/Theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  padding?: keyof typeof Theme.spacing;
  backgroundColor?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  elevation = 'sm',
  padding = 'md',
  backgroundColor = Theme.colors.surface,
}) => {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container 
      style={[
        styles.container, 
        Theme.shadows[elevation], 
        { 
          padding: Theme.spacing[padding],
          backgroundColor, 
          borderRadius: Theme.radius['2xl'] 
        }, 
        style
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Theme.spacing.xs,
  },
});
