import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { TRANSLATIONS } from '@norijjak/shared';
import { useNavigation } from '@react-navigation/native';

export default function GamesListScreen() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const t = TRANSLATIONS['ko-KR'];
  const navigation = useNavigation<any>();

  const fetchGames = (currentCursor: string | null = null) => {
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
      });
  };

  useEffect(() => {
    fetchGames();
  }, []);

  if (loading && games.length === 0) return <ActivityIndicator style={styles.loader} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={games}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.gameCard}
            onPress={() => navigation.navigate('GameDetail', { id: item.id })}
          >
            <View style={styles.cardHeader}>
              <View style={styles.sportInfo}>
                <Text style={styles.sportTag}>{item.sport.name_ko}</Text>
                {item.visibility === 'PRIVATE' && <Text style={styles.privateTag}>비공개</Text>}
              </View>
              <Text style={styles.capacityText}>
                {item._count.participants} / {item.capacity}
              </Text>
            </View>
            <Text style={styles.gameTitle}>{item.title}</Text>
            <Text style={styles.gameMeta}>
              {new Date(item.startTime).toLocaleString('ko-KR')}
            </Text>
            <Text style={styles.gameMeta}>{item.homeArea}</Text>
          </TouchableOpacity>
        )}
        onEndReached={() => hasMore && fetchGames(cursor)}
        onEndReachedThreshold={0.5}
        ListFooterComponent={hasMore ? <ActivityIndicator style={{ padding: 20 }} /> : null}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>등록된 경기가 없습니다.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loader: { flex: 1, justifyContent: 'center' },
  gameCard: { backgroundColor: '#fff', padding: 20, marginHorizontal: 15, marginTop: 15, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  sportInfo: { flexDirection: 'row', alignItems: 'center' },
  sportTag: { color: '#007AFF', fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase' },
  privateTag: { backgroundColor: '#f0f0f0', color: '#666', fontSize: 10, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 8 },
  capacityText: { fontSize: 12, color: '#666' },
  gameTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  gameMeta: { fontSize: 14, color: '#888', marginTop: 2 },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#999' }
});
