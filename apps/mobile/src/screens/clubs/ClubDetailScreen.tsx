import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { TRANSLATIONS } from '@norijjak/shared';
import { useRoute } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ClubDetailScreen() {
  const route = useRoute<any>();
  const { id } = route.params;
  const { user } = useAuth();
  const [club, setClub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const t = TRANSLATIONS['ko-KR'];

  const fetchClub = () => {
    fetch(`http://localhost:4000/clubs/${id}`)
      .then(res => res.json())
      .then(data => {
        setClub(data.club);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchClub();
  }, [id]);

  const handleJoin = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const res = await fetch(`http://localhost:4000/clubs/${id}/join`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      Alert.alert('Success', data.message);
      fetchClub();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  if (loading) return <ActivityIndicator style={styles.loader} />;
  if (!club) return <View style={styles.container}><Text>Club not found</Text></View>;

  const myMembership = club.members.find((m: any) => m.user.id === user?.id);
  const isApproved = myMembership?.status === 'APPROVED';
  const isPending = myMembership?.status === 'REQUESTED';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{club.name}</Text>
        <Text style={styles.area}>{club.homeArea}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>{t.clubs.about_club}</Text>
        <Text style={styles.description}>{club.description || 'No description provided.'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>{t.clubs.sports_label}</Text>
        <View style={styles.tags}>
          {club.sports.map((s: any) => (
            <View key={s.id} style={styles.tag}>
              <Text style={styles.tagText}>{s.name_ko}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Members ({club._count.members})</Text>
        {club.members.slice(0, 5).map((m: any) => (
          <View key={m.id} style={styles.memberItem}>
            <Text style={styles.memberName}>{m.user.displayName || 'Anonymous'}</Text>
            <Text style={styles.memberRole}>{m.role}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actionContainer}>
        {!myMembership ? (
          <TouchableOpacity style={styles.button} onPress={handleJoin}>
            <Text style={styles.buttonText}>{t.clubs.join_button}</Text>
          </TouchableOpacity>
        ) : isPending ? (
          <View style={styles.pendingBox}>
            <Text style={styles.pendingText}>{t.clubs.request_pending}</Text>
          </View>
        ) : (
          <TouchableOpacity style={[styles.button, styles.memberBtn]}>
            <Text style={styles.buttonText}>Member ({myMembership.role})</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loader: { flex: 1, justifyContent: 'center' },
  header: { backgroundColor: '#007AFF', padding: 30, paddingTop: 50 },
  name: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  area: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 4 },
  section: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  label: { fontSize: 12, color: '#999', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 8 },
  description: { fontSize: 16, color: '#333', lineHeight: 24 },
  tags: { flexDirection: 'row' as 'row', flexWrap: 'wrap' as 'wrap', gap: 8 },
  tag: { backgroundColor: '#f0f0f0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  tagText: { fontSize: 12, color: '#666', fontWeight: 'bold' },
  memberItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  memberName: { fontSize: 16, color: '#333' },
  memberRole: { fontSize: 12, color: '#999', textTransform: 'uppercase' },
  actionContainer: { padding: 20 },
  button: { backgroundColor: '#007AFF', padding: 18, borderRadius: 12, alignItems: 'center' },
  memberBtn: { backgroundColor: '#34C759' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  pendingBox: { backgroundColor: '#FFF9E6', padding: 18, borderRadius: 12, alignItems: 'center' },
  pendingText: { color: '#D4A017', fontWeight: 'bold' }
});

