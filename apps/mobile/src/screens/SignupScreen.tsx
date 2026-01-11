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
import { Ionicons } from '@expo/vector-icons';

export default function SignupScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
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

    if (password !== confirmPassword) {
      setConfirmPasswordError(t.auth.confirm_password_error);
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    return isValid;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    
    setError('');
    setIsSubmitting(true);
    try {
      const res = await fetch('http://10.0.2.2:4000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t.auth.signup_failed);
      
      // Auto login after signup
      const loginRes = await fetch('http://10.0.2.2:4000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok) throw new Error(loginData.error || t.auth.login_failed);
      await login(loginData.accessToken, loginData.user);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t.auth.signup_failed;
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
        <TouchableOpacity 
          onPress={() => navigation?.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Theme.colors.secondary} />
        </TouchableOpacity>
        <Text style={styles.title}>{t.auth.signup_title}</Text>
        <Text style={styles.subtitle}>{t.auth.signup_description}</Text>
      </View>

      <Card elevation="none" padding="lg" style={styles.formCard}>
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

        <Input
          label={t.auth.confirm_password}
          placeholder={t.auth.confirm_password_placeholder}
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (confirmPasswordError) setConfirmPasswordError('');
          }}
          error={confirmPasswordError}
          secureTextEntry
          icon="checkmark-circle-outline"
        />

        <Button
          title={t.auth.signup}
          onPress={handleSignup}
          loading={isSubmitting}
          style={styles.signupButton}
          size="lg"
        />

        <Text style={styles.termsText}>
          {t.auth.terms_prefix}
          <Text style={styles.termsLink}>{t.auth.terms_link}</Text>
          {t.auth.terms_middle}
          <Text style={styles.termsLink}>{t.auth.privacy_link}</Text>
          {t.auth.terms_suffix}
        </Text>
      </Card>
      
      <View style={styles.bottomPadding} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: Theme.spacing.xl,
    marginBottom: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.xs,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: Theme.radius.lg,
    backgroundColor: Theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.sm,
    marginBottom: Theme.spacing.lg,
  },
  title: { 
    ...Theme.typography.h2, 
    color: Theme.colors.secondary,
    marginBottom: Theme.spacing.xs,
  },
  subtitle: { 
    ...Theme.typography.bodyMedium, 
    color: Theme.colors.mutedForeground,
  },
  formCard: {
    width: '100%',
    backgroundColor: Theme.colors.surface,
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
  signupButton: {
    marginTop: Theme.spacing.md,
  },
  termsText: {
    ...Theme.typography.caption,
    color: Theme.colors.mutedForeground,
    textAlign: 'center',
    marginTop: Theme.spacing.lg,
    lineHeight: 18,
  },
  termsLink: {
    color: Theme.colors.secondary,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  bottomPadding: {
    height: Theme.spacing.xxl,
  },
});
