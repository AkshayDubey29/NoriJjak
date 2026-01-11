import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { TRANSLATIONS } from '@norijjak/shared';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OnboardingScreen() {
  const { user } = useAuth();
  const t = TRANSLATIONS['ko-KR'];

  const [displayName, setDisplayName] = useState('');
  const [homeArea, setHomeArea] = useState('');
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [availableSports, setAvailableSports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/sports')
      .then(res => res.json())
      .then(data => {
        setAvailableSports(data.sports);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem('@token');
    
    // 1. Update Profile
    await fetch('http://localhost:4000/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ displayName }),
    });

    // 2. Update Preferences
    await fetch('http://localhost:4000/user/preferences', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ 
        homeArea, 
        sports: selectedSports.map(sId => ({ sportId: sId, level: 'BEGINNER' })) 
      }),
    });

    // In a real app, we'd update AuthContext or navigate
    // For now, let's just alert
    alert('Onboarding complete!');
  };

  if (loading) return <ActivityIndicator style={styles.loader} />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t.onboarding.title}</Text>
      <Text style={styles.subtitle}>{t.onboarding.subtitle}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>{t.onboarding.display_name}</Text>
        <TextInput 
          style={styles.input} 
          value={displayName} 
          onChangeText={setDisplayName} 
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>{t.onboarding.home_area}</Text>
        <TextInput 
          style={styles.input} 
          value={homeArea} 
          onChangeText={setHomeArea} 
          placeholder="e.g. Seoul"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>{t.onboarding.select_sports}</Text>
        <View style={styles.sportsGrid}>
          {availableSports.map(sport => (
            <TouchableOpacity
              key={sport.id}
              style={[styles.sportItem, selectedSports.includes(sport.id) && styles.sportItemSelected]}
              onPress={() => {
                setSelectedSports(prev => prev.includes(sport.id) ? prev.filter(id => id !== sport.id) : [...prev, sport.id])
              }}
            >
              <Text style={[styles.sportText, selectedSports.includes(sport.id) && styles.sportTextSelected]}>
                {sport.name_ko}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>{t.onboarding.complete}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  loader: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginTop: 40, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30 },
  section: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12 },
  sportsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  sportItem: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#ddd' },
  sportItemSelected: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  sportText: { fontSize: 14 },
  sportTextSelected: { color: '#fff' },
  submitButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, marginTop: 20, alignItems: 'center' },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

