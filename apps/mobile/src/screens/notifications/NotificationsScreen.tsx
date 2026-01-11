import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { TRANSLATIONS } from '@norijjak/shared';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const t = TRANSLATIONS['ko-KR'];
  const navigation = useNavigation<any>();

  const fetchNotifications = async () => {
    const token = await AsyncStorage.getItem('@token');
    fetch('http://localhost:4000/notifications', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setNotifications(data.notifications);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markRead = async (id: string) => {
    const token = await AsyncStorage.getItem('@token');
    await fetch(`http://localhost:4000/notifications/${id}/read`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const getMessage = (n: any) => {
    switch (n.type) {
      case 'GAME_REQUEST': return t.games.notification_game_request.replace('{{userName}}', n.payload.userName).replace('{{gameTitle}}', n.payload.gameTitle);
      case 'GAME_APPROVED': return t.games.notification_game_approved.replace('{{gameTitle}}', n.payload.gameTitle);
      case 'GAME_DENIED': return t.games.notification_game_denied.replace('{{gameTitle}}', n.payload.gameTitle);
      case 'GAME_CANCELLED': return t.games.notification_game_cancelled.replace('{{gameTitle}}', n.payload.gameTitle);
      case 'WAITLIST_PROMOTED': return t.games.notification_waitlist_promoted.replace('{{gameTitle}}', n.payload.gameTitle);
      default: return 'Unknown notification';
    }
  };

  if (loading) return <ActivityIndicator style={styles.loader} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.notifCard, item.isRead && styles.readCard]}
            onPress={() => {
              if (!item.isRead) markRead(item.id);
              if (item.payload.gameId) navigation.navigate('Explore', { screen: 'GameDetail', params: { id: item.payload.gameId } });
            }}
          >
            <View style={styles.notifContent}>
              <Text style={[styles.notifText, item.isRead && styles.readText]}>{getMessage(item)}</Text>
              <Text style={styles.timeText}>{new Date(item.createdAt).toLocaleString('ko-KR')}</Text>
            </View>
            {!item.isRead && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t.games.no_notifications}</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loader: { flex: 1, justifyContent: 'center' },
  notifCard: { backgroundColor: '#fff', padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee', flexDirection: 'row', alignItems: 'center' },
  readCard: { backgroundColor: '#fafafa' },
  notifContent: { flex: 1 },
  notifText: { fontSize: 16, color: '#333', lineHeight: 22, fontWeight: '600' },
  readText: { color: '#999', fontWeight: '400' },
  timeText: { fontSize: 12, color: '#aaa', marginTop: 8 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#007AFF', marginLeft: 10 },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#999' }
});

