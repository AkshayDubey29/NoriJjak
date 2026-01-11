import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { TRANSLATIONS } from '@norijjak/shared';
import { useNavigation } from '@react-navigation/native';

export default function ClubsListScreen() {
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const navigation = useNavigation<any>();
  const t = TRANSLATIONS['ko-KR'];

  const fetchClubs = (search: string = '') => {
    const url = new URL('http://localhost:4000/clubs');
    if (search) url.searchParams.append('query', search);
    
    fetch(url.toString())
      .then(res => res.json())
      .then(data => {
        setClubs(data.clubs);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  if (loading && clubs.length === 0) return <ActivityIndicator style={styles.loader} />;

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput 
          placeholder={t.clubs.search_placeholder}
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => { setLoading(true); fetchClubs(query); }}
        />
      </View>

      <FlatList 
        data={clubs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('ClubDetail', { id: item.id })}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.memberCount}>{item._count.members} Members</Text>
            </View>
            <Text style={styles.area}>{item.homeArea}</Text>
            <View style={styles.sportsContainer}>
              {item.sports.map((s: any) => (
                <View key={s.id} style={styles.sportTag}>
                  <Text style={styles.sportText}>{s.name_ko}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>{t.clubs.no_clubs}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  loader: { flex: 1, justifyContent: 'center' },
  searchBar: { padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  searchInput: { backgroundColor: '#f0f0f0', padding: 10, borderRadius: 8 },
  card: { backgroundColor: '#fff', padding: 20, marginHorizontal: 15, marginTop: 15, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 18, fontWeight: 'bold' },
  memberCount: { fontSize: 12, color: '#007AFF', fontWeight: 'bold' },
  area: { fontSize: 14, color: '#666', marginTop: 4 },
  sportsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, gap: 5 },
  sportTag: { backgroundColor: '#E3F2FD', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  sportText: { color: '#1976D2', fontSize: 12, fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 50, color: '#999' }
});

