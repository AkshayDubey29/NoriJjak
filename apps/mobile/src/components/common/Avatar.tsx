import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { Theme } from '../../constants/Theme';

interface AvatarProps {
  source?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 'md',
  style,
}) => {
  const getDimensions = () => {
    switch (size) {
      case 'xs': return 24;
      case 'sm': return 32;
      case 'lg': return 56;
      case 'xl': return 80;
      default: return 40;
    }
  };

  const dim = getDimensions();
  const radius = Theme.radius.lg; // Premium squircle look

  const getInitials = () => {
    if (!name) return '?';
    return name
      .trim()
      .split(/\s+/)
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <View style={[
      styles.container, 
      { width: dim, height: dim, borderRadius: radius },
      style
    ]}>
      {source ? (
        <Image 
          source={{ uri: source }} 
          style={{ width: dim, height: dim, borderRadius: radius }} 
        />
      ) : (
        <Text style={[styles.initials, { fontSize: dim * 0.4 }]}>
          {getInitials()}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.slate[100],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.slate[200],
  },
  initials: {
    fontWeight: '700',
    color: Theme.colors.slate[500],
  },
});
