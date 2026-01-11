import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { TRANSLATIONS } from '@norijjak/shared';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Theme } from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const t = TRANSLATIONS['ko-KR'];
  const navigation = useNavigation<any>();

  const fetchNotifications = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    const token = await AsyncStorage.getItem('@token');
    fetch('http://10.0.2.2:4000/notifications', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setNotifications(data.notifications || []);
        setLoading(false);
        setRefreshing(false);
      })
      .catch(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications(false);
  };

  const markRead = async (id: string) => {
    const token = await AsyncStorage.getItem('@token');
    await fetch(`http://10.0.2.2:4000/notifications/${id}/read`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const getNotifMeta = (type: string) => {
    switch (type) {
      case 'GAME_REQUEST': return { icon: 'person-add', color: Theme.colors.amber[500], bg: Theme.colors.amber[50] };
      case 'GAME_APPROVED': return { icon: 'checkmark-circle', color: Theme.colors.emerald[500], bg: Theme.colors.emerald[50] };
      case 'GAME_DENIED': return { icon: 'close-circle', color: Theme.colors.rose[500], bg: Theme.colors.rose[50] };
      case 'GAME_CANCELLED': return { icon: 'trash-outline', color: Theme.colors.slate[500], bg: Theme.colors.slate[100] };
      case 'WAITLIST_PROMOTED': return { icon: 'flash', color: Theme.colors.indigo[500], bg: Theme.colors.indigo[50] };
      default: return { icon: 'notifications', color: Theme.colors.primary, bg: Theme.colors.blue[50] };
    }
  };

  const getMessage = (n: any) => {
    switch (n.type) {
      case 'GAME_REQUEST': return t.games.notification_game_request.replace('{{userName}}', n.payload.userName).replace('{{gameTitle}}', n.payload.gameTitle);
      case 'GAME_APPROVED': return t.games.notification_game_approved.replace('{{gameTitle}}', n.payload.gameTitle);
      case 'GAME_DENIED': return t.games.notification_game_denied.replace('{{gameTitle}}', n.payload.gameTitle);
      case 'GAME_CANCELLED': return t.games.notification_game_cancelled.replace('{{gameTitle}}', n.payload.gameTitle);
      case 'WAITLIST_PROMOTED': return t.games.notification_waitlist_promoted.replace('{{gameTitle}}', n.payload.gameTitle);
      default: return '새로운 알림이 도착했습니다.';
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const meta = getNotifMeta(item.type);
    return (
      <TouchableOpacity 
        style={[styles.notifCard, !item.isRead && styles.unreadCard]}
        activeOpacity={0.7}
        onPress={() => {
          if (!item.isRead) markRead(item.id);
          if (item.payload.gameId) navigation.navigate('Explore', { screen: 'GameDetail', params: { id: item.payload.gameId } });
        }}
      >
        <View style={[styles.iconBox, { backgroundColor: meta.bg }]}>
          <Ionicons name={meta.icon as any} size={22} color={meta.color} />
        </View>
        <View style={styles.notifContent}>
          <Text style={[styles.notifText, !item.isRead && styles.boldText]}>{getMessage(item)}</Text>
          <Text style={styles.timeText}>{new Date(item.createdAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
        </View>
        {!item.isRead && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  if (loading && notifications.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator color={Theme.colors.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Theme.colors.primary} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={64} color={Theme.colors.slate[200]} />
            <Text style={styles.emptyTitle}>알림이 없습니다</Text>
            <Text style={styles.emptySubtitle}>새로운 소식이 도착하면 알려드릴게요.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  listContent: { paddingVertical: Theme.spacing.sm },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notifCard: { 
    flexDirection: 'row', 
    padding: Theme.spacing.lg, 
    borderBottomWidth: 1, 
    borderBottomColor: Theme.colors.slate[50],
    alignItems: 'center'
  },
  unreadCard: { backgroundColor: Theme.colors.blue[50] + '20' },
  iconBox: { 
    width: 48, 
    height: 48, 
    borderRadius: 14, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginRight: 16
  },
  notifContent: { flex: 1 },
  notifText: { fontSize: 15, color: Theme.colors.slate[700], lineHeight: 22, fontWeight: '500' },
  boldText: { fontWeight: '800', color: Theme.colors.slate[900] },
  timeText: { fontSize: 12, color: Theme.colors.slate[400], marginTop: 6, fontWeight: '600' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Theme.colors.primary, marginLeft: 10 },
  emptyContainer: { padding: 60, alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyTitle: { fontSize: 18, fontWeight: '900', color: Theme.colors.slate[900], marginTop: 20 },
  emptySubtitle: { fontSize: 14, color: Theme.colors.slate[500], textAlign: 'center', marginTop: 8 }
});

