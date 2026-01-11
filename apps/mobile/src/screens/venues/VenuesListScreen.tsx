import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput, RefreshControl } from 'react-native';
import { TRANSLATIONS } from '@norijjak/shared';
import { useNavigation } from '@react-navigation/native';
import { Theme } from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';

export default function VenuesListScreen() {
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  const navigation = useNavigation<any>();
  const t = TRANSLATIONS['ko-KR'];

  const fetchVenues = (search: string = '', showLoading = true) => {
    if (showLoading) setLoading(true);
    const url = new URL('http://localhost:4000/venues');
    if (search) url.searchParams.append('query', search);
    
    fetch(url.toString())
      .then(res => res.json())
      .then(data => {
        setVenues(data.venues || []);
        setLoading(false);
        setRefreshing(false);
      })
      .catch(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVenues(query, false);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.venueCard}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('VenueDetail', { id: item.id })}
    >
      <View style={styles.imagePlaceholder}>
        <Ionicons name="business-outline" size={32} color={Theme.colors.slate[300]} />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{item.category}</Text>
        </View>
      </View>
      
      <View style={styles.cardInfo}>
        <Text style={styles.venueName}>{item.name}</Text>
        <View style={styles.areaRow}>
          <Ionicons name="location-sharp" size={14} color={Theme.colors.primary} />
          <Text style={styles.areaText}>{item.area}</Text>
        </View>
        
        <View style={styles.sportsWrapper}>
          {item.sports.slice(0, 3).map((s: any) => (
            <View key={s.id} style={styles.sportTag}>
              <Text style={styles.sportText}>{s.name_ko}</Text>
            </View>
          ))}
          {item.sports.length > 3 && (
            <Text style={styles.moreSports}>+{item.sports.length - 3}</Text>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Theme.colors.slate[300]} />
    </TouchableOpacity>
  );

  if (loading && venues.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator color={Theme.colors.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchHeader}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={Theme.colors.slate[400]} />
          <TextInput 
            placeholder={t.venues.search_placeholder}
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholderTextColor={Theme.colors.slate[400]}
            onSubmitEditing={() => fetchVenues(query)}
          />
        </View>
      </View>

      <FlatList 
        data={venues}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Theme.colors.primary} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="map-outline" size={64} color={Theme.colors.slate[200]} />
            <Text style={styles.emptyTitle}>검색 결과 없음</Text>
            <Text style={styles.emptySubtitle}>다른 검색어나 지역을 시도해보세요.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.slate[50] },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchHeader: { padding: Theme.spacing.lg, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: Theme.colors.slate[100] },
  searchBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: Theme.colors.slate[50], 
    paddingHorizontal: 12, 
    height: 48, 
    borderRadius: Theme.radius.xl 
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, fontWeight: '600', color: Theme.colors.slate[800] },
  listContent: { paddingVertical: Theme.spacing.md },
  venueCard: { 
    backgroundColor: '#fff', 
    padding: Theme.spacing.md, 
    marginHorizontal: Theme.spacing.lg, 
    marginBottom: Theme.spacing.md, 
    borderRadius: Theme.radius['2xl'],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...Theme.shadows.sm
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: Theme.colors.slate[50],
    borderRadius: Theme.radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden'
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 2,
    alignItems: 'center'
  },
  categoryBadgeText: { color: '#fff', fontSize: 8, fontWeight: '900', textTransform: 'uppercase' },
  cardInfo: { flex: 1 },
  venueName: { fontSize: 16, fontWeight: '800', color: Theme.colors.slate[900], marginBottom: 4 },
  areaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  areaText: { fontSize: 13, color: Theme.colors.slate[500], fontWeight: '600' },
  sportsWrapper: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sportTag: { backgroundColor: Theme.colors.blue[50], paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  sportText: { color: Theme.colors.blue[600], fontSize: 10, fontWeight: '800' },
  moreSports: { fontSize: 10, color: Theme.colors.slate[400], fontWeight: '700' },
  emptyContainer: { padding: 60, alignItems: 'center', justifyContent: 'center', marginTop: 50 },
  emptyTitle: { fontSize: 18, fontWeight: '900', color: Theme.colors.slate[900], marginTop: 20 },
  emptySubtitle: { fontSize: 14, color: Theme.colors.slate[500], textAlign: 'center', marginTop: 8 }
});

