import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { TRANSLATIONS } from '@norijjak/shared';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RatingFormProps {
  gameId?: string;
  targetUserId?: string;
  targetVenueId?: string;
  targetClubId?: string;
  targetName: string;
  onSuccess?: () => void;
}

export default function RatingForm({ gameId, targetUserId, targetVenueId, targetClubId, targetName, onSuccess }: RatingFormProps) {
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const t = TRANSLATIONS['ko-KR'];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const res = await fetch('http://10.0.2.2:4000/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ gameId, targetUserId, targetVenueId, targetClubId, score, comment })
      });
      if (res.ok) {
        Alert.alert('Success', '평가가 등록되었습니다.');
        onSuccess?.();
      } else {
        const err = await res.json();
        Alert.alert('Error', err.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{targetName} 평가</Text>
      <View style={styles.ratingRow}>
        {[1, 2, 3, 4, 5].map(num => (
          <TouchableOpacity
            key={num}
            onPress={() => setScore(num)}
            style={[styles.scoreBtn, score === num && styles.scoreBtnActive]}
          >
            <Text style={[styles.scoreText, score === num && styles.scoreTextActive]}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="평가 내용을 입력하세요"
        value={comment}
        onChangeText={setComment}
        multiline
      />
      <TouchableOpacity 
        style={[styles.submitBtn, loading && styles.disabled]} 
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitText}>제출하기</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#FFF', padding: 15, borderRadius: 15, marginBottom: 15, borderWidth: 1, borderColor: '#EEE' },
  title: { fontWeight: 'bold', marginBottom: 10 },
  ratingRow: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  scoreBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#EEE', alignItems: 'center', justifyContent: 'center' },
  scoreBtnActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  scoreText: { fontWeight: 'bold', color: '#999' },
  scoreTextActive: { color: '#FFF' },
  input: { borderWidth: 1, borderColor: '#EEE', borderRadius: 10, padding: 10, height: 60, backgroundColor: '#F9F9F9', marginBottom: 15 },
  submitBtn: { backgroundColor: '#007AFF', padding: 12, borderRadius: 10, alignItems: 'center' },
  submitText: { color: '#FFF', fontWeight: 'bold' },
  disabled: { backgroundColor: '#CCC' }
});

