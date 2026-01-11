import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TRANSLATIONS } from '@norijjak/shared';
import { Theme } from '../constants/Theme';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ExploreScreen({ locale = 'ko-KR' }: { locale?: string }) {
  const t = TRANSLATIONS[locale as keyof typeof TRANSLATIONS];
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t.nav.explore}</Text>
        <Text style={styles.headerSubtitle}>Find venues and clubs near you</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Theme.colors.slate[400]} />
        <TextInput 
          placeholder="Search areas, sports or venues..."
          style={styles.searchInput}
          placeholderTextColor={Theme.colors.slate[400]}
        />
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="options-outline" size={20} color={Theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>추천 지역</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          {['강남구', '송파구', '마포구', '서초구', '성동구'].map((area, i) => (
            <TouchableOpacity key={i} style={[styles.chip, i === 0 && styles.activeChip]}>
              <Text style={[styles.chipText, i === 0 && styles.activeChipText]}>{area}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={[styles.sectionTitle, { marginTop: Theme.spacing.xl }]}>검색 카테고리</Text>
        <View style={styles.categoryGrid}>
          {[
            { name: '축구/풋살', icon: 'football', color: Theme.colors.blue[500] },
            { name: '농구', icon: 'basketball', color: Theme.colors.amber[500] },
            { name: '배드민턴', icon: 'fitness', color: Theme.colors.emerald[500] },
            { name: '테니스', icon: 'tennisball', color: Theme.colors.rose[500] },
          ].map((cat, i) => (
            <TouchableOpacity key={i} style={styles.categoryCard}>
              <View style={[styles.iconBox, { backgroundColor: cat.color + '10' }]}>
                <Ionicons name={cat.icon as any} size={28} color={cat.color} />
              </View>
              <Text style={styles.categoryName}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.promoCard}>
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>새로운 구장 등록!</Text>
            <Text style={styles.promoDesc}>강남에 새로 오픈한 하이엔드 풋살장을 만나보세요.</Text>
            <TouchableOpacity style={styles.promoBtn}>
              <Text style={styles.promoBtnText}>둘러보기</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.promoVisual}>
            <Ionicons name="map" size={60} color="rgba(255,255,255,0.3)" />
          </View>
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
  header: {
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: Theme.colors.slate[900],
  },
  headerSubtitle: {
    fontSize: 14,
    color: Theme.colors.slate[500],
    fontWeight: '500',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Theme.spacing.lg,
    paddingHorizontal: Theme.spacing.md,
    height: 54,
    backgroundColor: Theme.colors.slate[50],
    borderRadius: Theme.radius.xl,
    borderWidth: 1,
    borderColor: Theme.colors.slate[100],
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '600',
    color: Theme.colors.slate[700],
  },
  filterBtn: {
    padding: 8,
  },
  scrollContent: {
    padding: Theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Theme.colors.slate[900],
    marginBottom: Theme.spacing.md,
  },
  chipScroll: {
    marginBottom: Theme.spacing.lg,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Theme.radius.lg,
    backgroundColor: Theme.colors.slate[50],
    marginRight: 10,
    borderWidth: 1,
    borderColor: Theme.colors.slate[100],
  },
  activeChip: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.slate[600],
  },
  activeChipText: {
    color: '#fff',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.md,
  },
  categoryCard: {
    width: (width - Theme.spacing.lg * 2 - Theme.spacing.md) / 2,
    backgroundColor: '#fff',
    borderRadius: Theme.radius['2xl'],
    padding: Theme.spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.slate[50],
    ...Theme.shadows.sm,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: Theme.radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '800',
    color: Theme.colors.slate[800],
  },
  promoCard: {
    marginTop: Theme.spacing.xl,
    backgroundColor: Theme.colors.slate[900],
    borderRadius: Theme.radius['3xl'],
    padding: Theme.spacing.xl,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  promoContent: {
    flex: 1,
    zIndex: 1,
  },
  promoTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 8,
  },
  promoDesc: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  promoBtn: {
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Theme.radius.md,
    alignSelf: 'flex-start',
  },
  promoBtnText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 13,
  },
  promoVisual: {
    position: 'absolute',
    right: -10,
    bottom: -10,
  }
});

