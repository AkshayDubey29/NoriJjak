import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import { TRANSLATIONS } from '@norijjak/shared';
import { useRoute } from '@react-navigation/native';

export default function VenueDetailScreen() {
  const route = useRoute<any>();
  const { id } = route.params;
  const [venue, setVenue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const t = TRANSLATIONS['ko-KR'];

  useEffect(() => {
    fetch(`http://localhost:4000/venues/${id}`)
      .then(res => res.json())
      .then(data => {
        setVenue(data.venue);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <ActivityIndicator style={styles.loader} />;
  if (!venue) return <View style={styles.container}><Text>Venue not found</Text></View>;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.category}>{venue.category}</Text>
        <Text style={styles.name}>{venue.name}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>{t.venues.address_label}</Text>
        <Text style={styles.value}>{venue.address || venue.area}</Text>
        {venue.mapLink && (
          <TouchableOpacity onPress={() => Linking.openURL(venue.mapLink)}>
            <Text style={styles.link}>지도에서 보기</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>{t.venues.contact_label}</Text>
        <Text style={styles.value}>{venue.contact || 'N/A'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>{t.venues.amenities_label}</Text>
        <View style={styles.tags}>
          {venue.amenities?.map((a: string) => (
            <View key={a} style={styles.tag}><Text style={styles.tagText}>{a}</Text></View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Supported Sports</Text>
        <View style={styles.tags}>
          {venue.sports.map((s: any) => (
            <View key={s.id} style={[styles.tag, styles.sportTag]}>
              <Text style={[styles.tagText, styles.sportTagText]}>{s.name_ko}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.gamesCard}>
          <Text style={styles.gamesCount}>{venue._count.games} {t.venues.open_games}</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>경기 보기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loader: { flex: 1, justifyContent: 'center' },
  header: { backgroundColor: '#333', padding: 30, paddingTop: 50 },
  category: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  name: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 8 },
  section: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  label: { fontSize: 12, color: '#999', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 8 },
  value: { fontSize: 16, fontWeight: '500' },
  link: { color: '#007AFF', fontWeight: 'bold', marginTop: 8 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { backgroundColor: '#f0f0f0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  tagText: { fontSize: 12, color: '#666', fontWeight: 'bold' },
  sportTag: { backgroundColor: '#E3F2FD' },
  sportTagText: { color: '#1976D2' },
  footer: { padding: 20 },
  gamesCard: { backgroundColor: '#F5F5F5', padding: 20, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  gamesCount: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  button: { backgroundColor: '#007AFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});

