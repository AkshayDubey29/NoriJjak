import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { TRANSLATIONS } from '@norijjak/shared';
import { useNavigation } from '@react-navigation/native';
import { Theme } from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function GamesListScreen() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const t = TRANSLATIONS['ko-KR'];
  const navigation = useNavigation<any>();

  const fetchGames = (currentCursor: string | null = null, isInitial = false) => {
    if (isInitial) setLoading(true);
    const url = new URL('http://localhost:4000/games');
    if (currentCursor) url.searchParams.append('cursor', currentCursor);
    url.searchParams.append('limit', '10');

    fetch(url.toString())
      .then(res => res.json())
      .then(data => {
        if (currentCursor) {
          setGames(prev => [...prev, ...data.games]);
        } else {
          setGames(data.games);
        }
        setCursor(data.nextCursor);
        setHasMore(!!data.nextCursor);
        setLoading(false);
        setRefreshing(false);
      })
      .catch(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchGames(null, true);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchGames(null, false);
  };

  const renderGameCard = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.gameCard}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('GameDetail', { id: item.id })}
    >
      <View style={styles.cardTop}>
        <View style={styles.sportBadge}>
          <Text style={styles.sportBadgeText}>{item.sport.name_ko}</Text>
        </View>
        <View style={styles.capacityBadge}>
          <Ionicons name="people" size={14} color={Theme.colors.slate[400]} />
          <Text style={styles.capacityText}>
            {item._count.participants} <Text style={{ color: Theme.colors.slate[300] }}>/ {item.capacity}</Text>
          </Text>
        </View>
      </View>
      
      <Text style={styles.gameTitle}>{item.title}</Text>
      
      <View style={styles.cardFooter}>
        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={16} color={Theme.colors.primary} />
          <Text style={styles.metaText}>
            {new Date(item.startTime).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        <View style={[styles.metaRow, { marginTop: 6 }]}>
          <Ionicons name="location-outline" size={16} color={Theme.colors.primary} />
          <Text style={styles.metaText}>{item.homeArea}</Text>
        </View>
      </View>

      <View style={styles.cardAction}>
        <Text style={styles.actionText}>참가하기</Text>
        <Ionicons name="chevron-forward" size={16} color={Theme.colors.primary} />
      </View>
    </TouchableOpacity>
  );

  if (loading && games.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color={Theme.colors.primary} size="large" />
        <Text style={styles.loaderText}>경기를 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={games}
        keyExtractor={item => item.id}
        renderItem={renderGameCard}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Theme.colors.primary} />
        }
        onEndReached={() => hasMore && fetchGames(cursor)}
        onEndReachedThreshold={0.5}
        ListFooterComponent={hasMore ? <ActivityIndicator style={{ padding: 20 }} color={Theme.colors.primary} /> : null}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color={Theme.colors.slate[200]} />
            <Text style={styles.emptyTitle}>참가 가능한 경기 없음</Text>
            <Text style={styles.emptySubtitle}>다른 지역을 검색하거나 직접 경기를 만들어보세요.</Text>
            <TouchableOpacity style={styles.createBtn}>
              <Text style={styles.createBtnText}>경기 만들기</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.slate[50] },
  listContent: { paddingVertical: Theme.spacing.md },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  loaderText: { marginTop: 12, color: Theme.colors.slate[500], fontWeight: '600' },
  gameCard: { 
    backgroundColor: '#fff', 
    padding: Theme.spacing.lg, 
    marginHorizontal: Theme.spacing.lg, 
    marginBottom: Theme.spacing.md, 
    borderRadius: Theme.radius['2xl'],
    ...Theme.shadows.sm,
    borderWidth: 1,
    borderColor: Theme.colors.slate[100],
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sportBadge: {
    backgroundColor: Theme.colors.blue[50],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sportBadgeText: {
    color: Theme.colors.blue[600],
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  capacityBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  capacityText: { fontSize: 13, fontWeight: '800', color: Theme.colors.slate[700] },
  gameTitle: { fontSize: 18, fontWeight: '900', color: Theme.colors.slate[900], marginBottom: Theme.spacing.lg },
  cardFooter: { borderTopWidth: 1, borderTopColor: Theme.colors.slate[50], paddingTop: Theme.spacing.md },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText: { fontSize: 13, color: Theme.colors.slate[500], fontWeight: '600' },
  cardAction: {
    position: 'absolute',
    bottom: Theme.spacing.lg,
    right: Theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  actionText: {
    color: Theme.colors.primary,
    fontSize: 13,
    fontWeight: '900',
  },
  emptyContainer: { padding: 60, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '900', color: Theme.colors.slate[900], marginTop: 20 },
  emptySubtitle: { fontSize: 14, color: Theme.colors.slate[500], textAlign: 'center', marginTop: 8, lineHeight: 20 },
  createBtn: {
    marginTop: 24,
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: Theme.radius.lg,
  },
  createBtnText: { color: '#fff', fontWeight: '900', fontSize: 14 },
});
