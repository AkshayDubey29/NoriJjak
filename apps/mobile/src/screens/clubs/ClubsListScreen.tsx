import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput, RefreshControl } from 'react-native';
import { TRANSLATIONS } from '@norijjak/shared';
import { useNavigation } from '@react-navigation/native';
import { Theme } from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';

export default function ClubsListScreen() {
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  const navigation = useNavigation<any>();
  const t = TRANSLATIONS['ko-KR'];

  const fetchClubs = (search: string = '', showLoading = true) => {
    if (showLoading) setLoading(true);
    const url = new URL('http://localhost:4000/clubs');
    if (search) url.searchParams.append('query', search);
    
    fetch(url.toString())
      .then(res => res.json())
      .then(data => {
        setClubs(data.clubs || []);
        setLoading(false);
        setRefreshing(false);
      })
      .catch(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchClubs(query, false);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.clubCard}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('ClubDetail', { id: item.id })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.clubInfo}>
          <View style={styles.clubAvatar}>
            <Text style={styles.avatarText}>{item.name[0]}</Text>
          </View>
          <View>
            <Text style={styles.clubName}>{item.name}</Text>
            <View style={styles.areaRow}>
              <Ionicons name="location-outline" size={12} color={Theme.colors.slate[400]} />
              <Text style={styles.areaText}>{item.homeArea}</Text>
            </View>
          </View>
        </View>
        <View style={styles.memberBadge}>
          <Text style={styles.memberCount}>{item._count.members}</Text>
          <Text style={styles.memberLabel}>멤버</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.sportsWrapper}>
          {item.sports.slice(0, 3).map((s: any) => (
            <View key={s.id} style={styles.sportTag}>
              <Text style={styles.sportText}>{s.name_ko}</Text>
            </View>
          ))}
        </View>
        <View style={styles.visibilityBadge}>
          <Ionicons 
            name={item.visibility === 'PUBLIC' ? 'globe-outline' : 'lock-closed-outline'} 
            size={12} 
            color={item.visibility === 'PUBLIC' ? Theme.colors.emerald[600] : Theme.colors.amber[600]} 
          />
          <Text style={[styles.visibilityText, { color: item.visibility === 'PUBLIC' ? Theme.colors.emerald[600] : Theme.colors.amber[600] }]}>
            {item.visibility === 'PUBLIC' ? '공개' : '비공개'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && clubs.length === 0) {
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
            placeholder={t.clubs.search_placeholder}
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholderTextColor={Theme.colors.slate[400]}
            onSubmitEditing={() => fetchClubs(query)}
          />
        </View>
      </View>

      <FlatList 
        data={clubs}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Theme.colors.primary} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color={Theme.colors.slate[200]} />
            <Text style={styles.emptyTitle}>클럽을 찾을 수 없습니다</Text>
            <Text style={styles.emptySubtitle}>다른 이름으로 검색하거나 새로운 클럽을 만들어보세요.</Text>
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
  clubCard: { 
    backgroundColor: '#fff', 
    padding: Theme.spacing.lg, 
    marginHorizontal: Theme.spacing.lg, 
    marginBottom: Theme.spacing.md, 
    borderRadius: Theme.radius['2xl'],
    ...Theme.shadows.sm,
    borderWidth: 1,
    borderColor: Theme.colors.slate[100]
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  clubInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  clubAvatar: { 
    width: 48, 
    height: 48, 
    borderRadius: 14, 
    backgroundColor: Theme.colors.indigo[500], 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: '900' },
  clubName: { fontSize: 17, fontWeight: '800', color: Theme.colors.slate[900] },
  areaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  areaText: { fontSize: 13, color: Theme.colors.slate[400], fontWeight: '600' },
  memberBadge: { alignItems: 'center', backgroundColor: Theme.colors.blue[50], paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  memberCount: { fontSize: 15, fontWeight: '900', color: Theme.colors.primary },
  memberLabel: { fontSize: 9, fontWeight: '800', color: Theme.colors.primary, marginTop: -2 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: Theme.colors.slate[50], paddingTop: 12 },
  sportsWrapper: { flexDirection: 'row', gap: 6 },
  sportTag: { backgroundColor: Theme.colors.slate[50], paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  sportText: { color: Theme.colors.slate[600], fontSize: 11, fontWeight: '700' },
  visibilityBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  visibilityText: { fontSize: 11, fontWeight: '800' },
  emptyContainer: { padding: 60, alignItems: 'center', justifyContent: 'center', marginTop: 50 },
  emptyTitle: { fontSize: 18, fontWeight: '900', color: Theme.colors.slate[900], marginTop: 20 },
  emptySubtitle: { fontSize: 14, color: Theme.colors.slate[500], textAlign: 'center', marginTop: 8 }
});

