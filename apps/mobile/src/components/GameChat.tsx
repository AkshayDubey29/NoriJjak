import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { TRANSLATIONS } from '@norijjak/shared';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GameChat({ gameId }: { gameId: string }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = TRANSLATIONS['ko-KR'];
  const flatListRef = useRef<FlatList>(null);

  const fetchMessages = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const res = await fetch(`http://10.0.2.2:4000/games/${gameId}/chat`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Not eligible');
      const data = await res.json();
      setMessages(data.messages);
      setLoading(false);
    } catch (err) {
      setError(t.chat.not_eligible);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [gameId]);

  const handleSend = async () => {
    if (!input.trim()) return;
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const res = await fetch(`http://10.0.2.2:4000/games/${gameId}/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ body: input })
      });
      if (res.ok) {
        setInput('');
        fetchMessages();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBlock = (senderId: string) => {
    Alert.alert(t.safety.report_title, t.safety.block_confirm, [
      { text: 'Cancel', style: 'cancel' },
      { text: t.chat.block_user, style: 'destructive', onPress: async () => {
        const token = await AsyncStorage.getItem('accessToken');
        await fetch(`http://10.0.2.2:4000/safety/block/${senderId}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchMessages();
      }}
    ]);
  };

  if (loading) return <ActivityIndicator style={styles.loader} />;
  if (error) return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{error}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
      style={styles.container}
    >
      <FlatList 
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.msgContainer, item.senderId === user?.id ? styles.myMsg : styles.otherMsg]}>
            <View style={styles.msgHeader}>
              <Text style={styles.senderName}>{item.sender.displayName || 'Anonymous'}</Text>
              {item.senderId !== user?.id && (
                <TouchableOpacity onPress={() => handleBlock(item.senderId)}>
                  <Text style={styles.blockText}>{t.chat.block_user}</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={[styles.bubble, item.senderId === user?.id ? styles.myBubble : styles.otherBubble]}>
              <Text style={[styles.msgBody, item.senderId === user?.id ? styles.myText : styles.otherText]}>
                {item.body}
              </Text>
            </View>
            <Text style={styles.time}>
              {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        )}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        ListEmptyComponent={<Text style={styles.empty}>{t.chat.no_messages}</Text>}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.composer}>
        <TextInput 
          style={styles.input}
          placeholder={t.chat.placeholder}
          value={input}
          onChangeText={setInput}
          multiline
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendText}>{t.chat.send}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { height: 400, backgroundColor: '#f9f9f9', borderRadius: 15, overflow: 'hidden', borderWidth: 1, borderColor: '#eee' },
  loader: { padding: 20 },
  errorContainer: { padding: 20, backgroundColor: '#FFF5F5', borderRadius: 10 },
  errorText: { color: '#C53030', textAlign: 'center', fontSize: 14 },
  listContent: { padding: 15 },
  msgContainer: { marginBottom: 15, maxWidth: '85%' },
  myMsg: { alignSelf: 'flex-end' },
  otherMsg: { alignSelf: 'flex-start' },
  msgHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  senderName: { fontSize: 10, fontWeight: 'bold', color: '#999' },
  blockText: { fontSize: 10, color: '#DDD', marginLeft: 8 },
  bubble: { padding: 12, borderRadius: 18 },
  myBubble: { backgroundColor: '#007AFF', borderTopRightRadius: 2 },
  otherBubble: { backgroundColor: '#E9E9EB', borderTopLeftRadius: 2 },
  msgBody: { fontSize: 14 },
  myText: { color: '#FFF' },
  otherText: { color: '#000' },
  time: { fontSize: 9, color: '#CCC', marginTop: 4, textAlign: 'right' },
  empty: { textAlign: 'center', color: '#CCC', marginTop: 20 },
  composer: { flexDirection: 'row', padding: 10, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#EEE', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#F0F0F0', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8, maxHeight: 100 },
  sendBtn: { marginLeft: 10, paddingHorizontal: 15 },
  sendText: { color: '#007AFF', fontWeight: 'bold' }
});

