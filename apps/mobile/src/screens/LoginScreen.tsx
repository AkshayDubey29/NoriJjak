import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { TRANSLATIONS } from '@norijjak/shared';
import { Theme } from '../constants/Theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const t = TRANSLATIONS['ko-KR'];

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await login(data.accessToken, data.user);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoEmoji}>⚽</Text>
          </View>
          <Text style={styles.title}>{t.app_name}</Text>
          <Text style={styles.subtitle}>Partner for your sports journey</Text>
        </View>

        <View style={styles.form}>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="name@example.com"
              placeholderTextColor={Theme.colors.muted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={Theme.colors.muted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, isSubmitting && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <ActivityIndicator color={Theme.colors.primaryForeground} />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Theme.colors.background },
  container: { flex: 1, padding: Theme.spacing.lg, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: Theme.spacing.xxl },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: Theme.radius.xl,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.md,
  },
  logoEmoji: { fontSize: 32 },
  title: { ...Theme.typography.h1, color: Theme.colors.secondary, marginBottom: Theme.spacing.xs },
  subtitle: { ...Theme.typography.body, color: Theme.colors.muted },
  form: { width: '100%', backgroundColor: Theme.colors.surface, padding: Theme.spacing.lg, borderRadius: Theme.radius.lg, ...Theme.shadows.sm },
  errorContainer: {
    backgroundColor: '#fff1f2',
    padding: Theme.spacing.md,
    borderRadius: Theme.radius.md,
    marginBottom: Theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: { color: Theme.colors.destructive, textAlign: 'center', fontWeight: '500' },
  inputContainer: { marginBottom: Theme.spacing.lg },
  label: { ...Theme.typography.label, marginBottom: Theme.spacing.sm, color: Theme.colors.secondary },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.radius.md,
    paddingHorizontal: Theme.spacing.md,
    backgroundColor: Theme.colors.background,
    color: Theme.colors.secondary,
    fontSize: 16,
  },
  button: {
    height: 52,
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Theme.spacing.sm,
    ...Theme.shadows.sm,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: Theme.colors.primaryForeground, fontSize: 16, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: Theme.spacing.xl, gap: Theme.spacing.xs },
  footerText: { color: Theme.colors.muted },
  linkText: { color: Theme.colors.primary, fontWeight: '600' },
});

