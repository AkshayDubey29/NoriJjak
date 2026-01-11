import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TRANSLATIONS } from '@norijjak/shared';
import { Theme } from '../constants/Theme';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function HomeScreen({ locale = 'ko-KR' }: { locale?: string }) {
  const t = TRANSLATIONS[locale as keyof typeof TRANSLATIONS];
  const { user } = useAuth();
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>안녕하세요,</Text>
            <Text style={styles.userName}>{user?.displayName || '플레이어'}님! 👋</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name="notifications-outline" size={24} color={Theme.colors.slate[900]} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Featured Card */}
        <LinearGradient
          colors={[Theme.colors.primary, Theme.colors.indigo[600]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.featuredCard}
        >
          <View style={styles.featuredContent}>
            <Text style={styles.featuredTitle}>인기 급상승 경기</Text>
            <Text style={styles.featuredSubtitle}>지금 바로 참가하고 프로 포인트를 획득하세요!</Text>
            <TouchableOpacity style={styles.featuredBtn}>
              <Text style={styles.featuredBtnText}>참가하기</Text>
              <Ionicons name="arrow-forward" size={16} color={Theme.colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.featuredIconContainer}>
            <Ionicons name="trophy" size={80} color="rgba(255,255,255,0.2)" />
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>빠른 시작</Text>
        </View>
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.actionIcon, { backgroundColor: Theme.colors.blue[50] }]}>
              <Ionicons name="football" size={24} color={Theme.colors.blue[600]} />
            </View>
            <Text style={styles.actionLabel}>경기 찾기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.actionIcon, { backgroundColor: Theme.colors.emerald[50] }]}>
              <Ionicons name="people" size={24} color={Theme.colors.emerald[600]} />
            </View>
            <Text style={styles.actionLabel}>클럽 찾기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.actionIcon, { backgroundColor: Theme.colors.amber[50] }]}>
              <Ionicons name="location" size={24} color={Theme.colors.amber[600]} />
            </View>
            <Text style={styles.actionLabel}>구장 예약</Text>
          </TouchableOpacity>
        </View>

        {/* Upcoming Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>추천 경기</Text>
          <TouchableOpacity>
            <Text style={styles.seeMore}>전체보기</Text>
          </TouchableOpacity>
        </View>

        {[1, 2].map((i) => (
          <TouchableOpacity key={i} style={styles.gameCard}>
            <View style={styles.gameImagePlaceholder}>
              <Ionicons name="image-outline" size={32} color={Theme.colors.slate[300]} />
            </View>
            <View style={styles.gameInfo}>
              <View style={styles.sportBadge}>
                <Text style={styles.sportBadgeText}>FOOTBALL</Text>
              </View>
              <Text style={styles.gameTitle}>주말 아침 풋살 매치 {i}</Text>
              <View style={styles.gameMeta}>
                <Ionicons name="time-outline" size={14} color={Theme.colors.slate[400]} />
                <Text style={styles.metaText}>내일 오전 10:00</Text>
                <Ionicons name="location-outline" size={14} color={Theme.colors.slate[400]} style={{ marginLeft: 8 }} />
                <Text style={styles.metaText}>강남 풋살장</Text>
              </View>
              <View style={styles.participantsContainer}>
                <View style={styles.avatars}>
                  {[1, 2, 3].map(j => (
                    <View key={j} style={[styles.avatar, { marginLeft: j === 1 ? 0 : -8 }]} />
                  ))}
                </View>
                <Text style={styles.participantCount}>8 / 12 참가중</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.slate[50],
  },
  scrollContent: {
    padding: Theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
  },
  welcomeText: {
    fontSize: 16,
    color: Theme.colors.slate[500],
    fontWeight: '500',
  },
  userName: {
    fontSize: 24,
    fontWeight: '900',
    color: Theme.colors.slate[900],
    marginTop: 2,
  },
  notificationBtn: {
    width: 48,
    height: 48,
    borderRadius: Theme.radius.xl,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.shadows.sm,
  },
  notificationDot: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.colors.rose[500],
    borderWidth: 2,
    borderColor: '#fff',
  },
  featuredCard: {
    borderRadius: Theme.radius['3xl'],
    padding: Theme.spacing.xl,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: Theme.spacing.xl,
    ...Theme.shadows.md,
  },
  featuredContent: {
    flex: 1,
    zIndex: 1,
  },
  featuredTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 8,
  },
  featuredSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 20,
  },
  featuredBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Theme.radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
  },
  featuredBtnText: {
    color: Theme.colors.primary,
    fontWeight: '900',
    fontSize: 14,
  },
  featuredIconContainer: {
    position: 'absolute',
    right: -20,
    bottom: -20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
    marginTop: Theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Theme.colors.slate[900],
  },
  seeMore: {
    color: Theme.colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
    marginBottom: Theme.spacing.xl,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: Theme.radius['2xl'],
    paddingVertical: Theme.spacing.lg,
    alignItems: 'center',
    ...Theme.shadows.sm,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: Theme.radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.colors.slate[700],
  },
  gameCard: {
    backgroundColor: '#fff',
    borderRadius: Theme.radius['2xl'],
    padding: Theme.spacing.md,
    flexDirection: 'row',
    gap: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.sm,
  },
  gameImagePlaceholder: {
    width: 90,
    height: 110,
    backgroundColor: Theme.colors.slate[50],
    borderRadius: Theme.radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  sportBadge: {
    backgroundColor: Theme.colors.blue[50],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  sportBadgeText: {
    color: Theme.colors.blue[600],
    fontSize: 10,
    fontWeight: '900',
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.colors.slate[900],
    marginBottom: 6,
  },
  gameMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  metaText: {
    fontSize: 12,
    color: Theme.colors.slate[500],
    fontWeight: '500',
    marginLeft: 4,
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.slate[50],
  },
  avatars: {
    flexDirection: 'row',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Theme.colors.slate[200],
    borderWidth: 2,
    borderColor: '#fff',
  },
  participantCount: {
    fontSize: 11,
    fontWeight: '700',
    color: Theme.colors.slate[400],
  },
});
