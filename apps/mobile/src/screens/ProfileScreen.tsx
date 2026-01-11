import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TRANSLATIONS, Locale } from '@norijjak/shared';
import { Theme } from '../constants/Theme';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCALE_KEY = '@norijjak_locale';

export default function ProfileScreen({ locale, setLocale }: { locale: Locale, setLocale: (l: Locale) => void }) {
  const t = TRANSLATIONS[locale];
  const { logout, user } = useAuth();
  const [reputation, setReputation] = useState<any>(null);
  
  useEffect(() => {
    if (user) {
      fetch(`http://10.0.2.2:4000/ratings/summary/user/${user.id}`)
        .then(res => res.json())
        .then(data => setReputation(data))
        .catch(() => {});
    }
  }, [user]);

  const toggleLocale = async () => {
    const newLocale = locale === 'ko-KR' ? 'en-US' : 'ko-KR';
    setLocale(newLocale);
    await AsyncStorage.setItem(LOCALE_KEY, newLocale);
  };

  const confirmLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.displayName?.[0] || 'U'}</Text>
            </View>
            <TouchableOpacity style={styles.editBtn}>
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.displayName || '플레이어'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{reputation?.average || '0.0'}</Text>
            <Text style={styles.statLabel}>매너 온도</Text>
          </View>
          <View style={[styles.statItem, styles.statBorder]}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>참가 경기</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{reputation?.badges?.length || 0}</Text>
            <Text style={styles.statLabel}>활동 배지</Text>
          </View>
        </View>

        {/* Menu Sections */}
        <View style={styles.menuContainer}>
          <Text style={styles.sectionHeader}>애플리케이션 설정</Text>
          
          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: Theme.colors.blue[50] }]}>
                <Ionicons name="language" size={20} color={Theme.colors.blue[600]} />
              </View>
              <Text style={styles.menuText}>{t.labels.language}</Text>
            </View>
            <View style={styles.menuRight}>
              <Text style={styles.menuDetail}>{locale === 'ko-KR' ? '한국어' : 'English'}</Text>
              <Switch value={locale === 'en-US'} onValueChange={toggleLocale} />
            </View>
          </View>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: Theme.colors.amber[50] }]}>
                <Ionicons name="notifications" size={20} color={Theme.colors.amber[600]} />
              </View>
              <Text style={styles.menuText}>알림 설정</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Theme.colors.slate[300]} />
          </TouchableOpacity>

          <Text style={[styles.sectionHeader, { marginTop: Theme.spacing.xl }]}>계정</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: Theme.colors.slate[100] }]}>
                <Ionicons name="person" size={20} color={Theme.colors.slate[600]} />
              </View>
              <Text style={styles.menuText}>회원 정보 수정</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Theme.colors.slate[300]} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={confirmLogout}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: Theme.colors.rose[50] }]}>
                <Ionicons name="log-out" size={20} color={Theme.colors.rose[600]} />
              </View>
              <Text style={[styles.menuText, { color: Theme.colors.rose[600] }]}>로그아웃</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Theme.spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.shadows.md,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '900',
    color: '#fff',
  },
  editBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Theme.colors.slate[900],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 22,
    fontWeight: '900',
    color: Theme.colors.slate[900],
  },
  userEmail: {
    fontSize: 14,
    color: Theme.colors.slate[500],
    fontWeight: '500',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.lg,
    backgroundColor: Theme.colors.slate[50],
    borderRadius: Theme.radius['2xl'],
    marginBottom: Theme.spacing.xl,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Theme.colors.slate[200],
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: Theme.colors.slate[900],
  },
  statLabel: {
    fontSize: 12,
    color: Theme.colors.slate[500],
    fontWeight: '700',
    marginTop: 4,
  },
  menuContainer: {
    paddingHorizontal: Theme.spacing.lg,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '900',
    color: Theme.colors.slate[400],
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Theme.spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Theme.spacing.md,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.slate[800],
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuDetail: {
    fontSize: 14,
    color: Theme.colors.slate[400],
    fontWeight: '600',
  }
});
