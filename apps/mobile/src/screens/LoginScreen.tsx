import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { TRANSLATIONS } from '@norijjak/shared';
import { Theme } from '../constants/Theme';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, user } = useAuth();
  const currentLocale = (user?.locale || 'ko-KR') as keyof typeof TRANSLATIONS;
  const t = TRANSLATIONS[currentLocale];

  const validate = () => {
    let isValid = true;
    if (!email) {
      setEmailError(t.auth.email_required);
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(t.auth.email_error);
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError(t.auth.password_required);
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError(t.auth.password_error);
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    
    setError('');
    setIsSubmitting(true);
    try {
      const res = await fetch('http://10.0.2.2:4000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t.auth.login_failed);
      await login(data.accessToken, data.user);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t.auth.login_failed;
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenContainer 
      backgroundColor={Theme.colors.background} 
      scrollable 
      withKeyboardAvoidingView
    >
      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoEmoji}>⚽</Text>
        </View>
        <Text style={styles.title}>{t.app_name}</Text>
        <Text style={styles.subtitle}>{t.auth.welcome_back}</Text>
      </View>

      <Card elevation="none" padding="lg" style={styles.formCard}>
        <Text style={styles.formTitle}>{t.auth.login_title}</Text>
        
        {error ? (
          <Badge 
            label={error} 
            variant="destructive" 
            style={styles.globalError}
            textStyle={styles.globalErrorText}
          />
        ) : null}

        <Input
          label={t.auth.email}
          placeholder={t.auth.email_placeholder}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (emailError) setEmailError('');
          }}
          error={emailError}
          autoCapitalize="none"
          keyboardType="email-address"
          icon="mail-outline"
        />

        <Input
          label={t.auth.password}
          placeholder={t.auth.password_placeholder}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (passwordError) setPasswordError('');
          }}
          error={passwordError}
          secureTextEntry
          icon="lock-closed-outline"
        />

        <TouchableOpacity 
          style={styles.forgotPassword}
          onPress={() => {/* TODO: Implement forgot password */}}
        >
          <Text style={styles.forgotPasswordText}>{t.auth.forgot_password}</Text>
        </TouchableOpacity>

        <Button
          title={t.auth.login}
          onPress={handleLogin}
          loading={isSubmitting}
          style={styles.loginButton}
          size="lg"
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t.auth.no_account}</Text>
          <Button 
            title={t.auth.signup} 
            variant="ghost" 
            size="sm"
            onPress={() => navigation?.navigate('Signup')} 
            textStyle={styles.signupLink}
          />
        </View>
      </Card>
      
      <View style={styles.bottomPadding} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginTop: Theme.spacing.xxl,
    marginBottom: Theme.spacing.xl,
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: Theme.radius['3xl'],
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.md,
    marginBottom: Theme.spacing.lg,
  },
  logoEmoji: { fontSize: 40 },
  title: { 
    ...Theme.typography.h1, 
    color: Theme.colors.secondary,
    marginBottom: Theme.spacing.xs,
  },
  subtitle: { 
    ...Theme.typography.bodyMedium, 
    color: Theme.colors.mutedForeground,
    textAlign: 'center',
    paddingHorizontal: Theme.spacing.xl,
  },
  formCard: {
    width: '100%',
    backgroundColor: Theme.colors.surface,
  },
  formTitle: {
    ...Theme.typography.h2,
    color: Theme.colors.secondary,
    marginBottom: Theme.spacing.xl,
  },
  globalError: {
    width: '100%',
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.radius.md,
    marginBottom: Theme.spacing.lg,
  },
  globalErrorText: {
    textTransform: 'none',
    fontSize: 13,
    fontWeight: '600',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: Theme.spacing.lg,
  },
  forgotPasswordText: {
    ...Theme.typography.bodySmallMedium,
    color: Theme.colors.primary,
  },
  loginButton: {
    marginTop: Theme.spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Theme.spacing.xl,
  },
  footerText: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.mutedForeground,
  },
  signupLink: {
    color: Theme.colors.primary,
    fontWeight: '700',
  },
  bottomPadding: {
    height: Theme.spacing.xxl,
  },
});

