import React from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  ViewStyle, 
  StatusBar, 
  Platform, 
  StyleProp, 
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import { Theme } from '../../constants/Theme';

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  safeAreaStyle?: StyleProp<ViewStyle>;
  useSafeArea?: boolean;
  backgroundColor?: string;
  scrollable?: boolean;
  withKeyboardAvoidingView?: boolean;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  style,
  safeAreaStyle,
  useSafeArea = true,
  backgroundColor = Theme.colors.background,
  scrollable = false,
  withKeyboardAvoidingView = false,
}) => {
  const Container = useSafeArea ? SafeAreaView : View;

  const content = (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );

  const maybeScrollable = scrollable ? (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {content}
    </ScrollView>
  ) : content;

  const maybeKeyboardAvoiding = withKeyboardAvoidingView ? (
    <KeyboardAvoidingView 
      style={styles.flex} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {maybeScrollable}
    </KeyboardAvoidingView>
  ) : maybeScrollable;

  return (
    <Container style={[styles.safeArea, { backgroundColor }, safeAreaStyle]}>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'default'}
        backgroundColor={backgroundColor}
      />
      {maybeKeyboardAvoiding}
    </Container>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: Theme.spacing.md,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
