import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput, Share } from 'react-native';
import { TRANSLATIONS } from '@norijjak/shared';
import { useRoute } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GameChat from '../../components/GameChat';
import RatingForm from '../../components/RatingForm';

export default function GameDetailScreen() {
  const route = useRoute<any>();
  const { id } = route.params;
  const { user } = useAuth();
  const t = TRANSLATIONS['ko-KR'];

  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inviteToken, setInviteToken] = useState('');
  const [inputToken, setInputToken] = useState('');

  const fetchGame = async () => {
    fetch(`http://localhost:4000/games/${id}`)
      .then(res => res.json())
      .then(data => {
        setGame(data.game);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchGame();
  }, [id]);

  const handleJoin = async () => {
    try {
      const token = await AsyncStorage.getItem('@token');
      const res = await fetch(`http://localhost:4000/games/${id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ inviteToken: inputToken })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      Alert.alert('Success', data.message);
      fetchGame();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const handleAction = async (participantId: string, action: 'approve' | 'deny') => {
    try {
      const token = await AsyncStorage.getItem('@token');
      const res = await fetch(`http://localhost:4000/games/${id}/participants/${participantId}/${action}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      Alert.alert('Success', data.message);
      fetchGame();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const generateInvite = async () => {
    try {
      const token = await AsyncStorage.getItem('@token');
      const res = await fetch(`http://localhost:4000/games/${id}/invites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ maxUses: 5 })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setInviteToken(data.invite.token);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const onShare = async () => {
    const shareUrl = `https://norijjak.app/games/${id}`;
    const message = `[${game.sport.name_ko}] ${game.title}\n시간: ${new Date(game.startTime).toLocaleString('ko-KR')}\n장소: ${game.homeArea}\n\n같이 경기해요! ${shareUrl}`;
    try {
      await Share.share({ message });
    } catch (error) {
      console.error(error);
    }
  };

  const onShareInvite = async (token: string) => {
    const message = `[놀이짝] 비공개 경기 초대 코드입니다: ${token}\n\n앱에서 코드를 입력하고 참가하세요!`;
    try {
      await Share.share({ message });
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <ActivityIndicator style={styles.loader} />;
  if (!game) return <View style={styles.container}><Text>Game not found</Text></View>;

  const isHost = user?.id === game.hostId;
  const userParticipant = game.participants.find((p: any) => p.userId === user?.id);
  const isApproved = userParticipant?.status === 'APPROVED';
  const isRequested = userParticipant?.status === 'REQUESTED';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.sportTag}>{game.sport.name_ko}</Text>
          {game.visibility === 'PRIVATE' && <Text style={styles.privateTag}>비공개</Text>}
        </View>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{game.title}</Text>
          <TouchableOpacity onPress={onShare}>
            <Text style={styles.shareIconText}>공유</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t.games.time_label}</Text>
          <Text style={styles.detailValue}>{new Date(game.startTime).toLocaleString('ko-KR')}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t.games.place_label}</Text>
          <Text style={styles.detailValue}>{game.homeArea}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t.games.host_label}</Text>
          <Text style={styles.detailValue}>{game.host.displayName || 'Anonymous'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t.games.capacity_label}</Text>
          <Text style={styles.detailValue}>
            {game.participants.filter((p: any) => p.status === 'APPROVED').length} / {game.capacity}
          </Text>
        </View>
      </View>

      {isHost && (
        <View style={styles.hostSection}>
          <Text style={styles.sectionTitle}>Host Management</Text>
          <View style={styles.participantsList}>
            {game.participants.map((p: any) => (
              <View key={p.id} style={styles.participantItem}>
                <View>
                  <Text style={styles.participantName}>{p.user.displayName || 'Anonymous'}</Text>
                  <Text style={styles.participantStatus}>{p.status}</Text>
                </View>
                {p.status === 'REQUESTED' && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity onPress={() => handleAction(p.id, 'approve')} style={styles.miniButton}>
                      <Text style={styles.miniButtonText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleAction(p.id, 'deny')} style={[styles.miniButton, styles.denyButton]}>
                      <Text style={styles.miniButtonText}>Deny</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>

          <View style={styles.inviteContainer}>
            <Text style={styles.inviteLabel}>{t.games.invite_title}</Text>
            {inviteToken ? (
              <TouchableOpacity onPress={() => onShareInvite(inviteToken)}>
                <Text style={styles.inviteCode}>{inviteToken}</Text>
                <Text style={styles.shareHint}>탭하여 초대 코드 공유</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={generateInvite} style={styles.generateButton}>
                <Text style={styles.generateButtonText}>{t.games.generate_invite}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      <View style={styles.descriptionContainer}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.descriptionText}>{game.description || 'No description provided.'}</Text>
      </View>

      <View style={{ padding: 20 }}>
        <GameChat gameId={game.id} />
      </View>

      {game.status === 'COMPLETED' && isApproved && (
        <View style={{ padding: 20 }}>
          <Text style={styles.sectionTitle}>Rate Participants</Text>
          {game.participants
            .filter(p => p.userId !== user?.id && p.status === 'APPROVED')
            .map(p => (
              <RatingForm 
                key={p.userId} 
                gameId={game.id} 
                targetUserId={p.userId} 
                targetName={p.user.displayName || 'Anonymous'} 
              />
            ))}
          {game.hostId !== user?.id && (
            <RatingForm 
              gameId={game.id} 
              targetUserId={game.hostId} 
              targetName={`${game.host.displayName} (Host)`} 
            />
          )}
        </View>
      )}

      <View style={styles.actionContainer}>
        {isHost ? (
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => Alert.alert('Coming soon')}>
            <Text style={styles.buttonText}>{t.games.cancel_button}</Text>
          </TouchableOpacity>
        ) : isApproved ? (
          <TouchableOpacity style={[styles.button, styles.leaveButton]} onPress={() => Alert.alert('Coming soon')}>
            <Text style={styles.buttonText}>{t.games.leave_button}</Text>
          </TouchableOpacity>
        ) : isRequested ? (
          <View style={styles.pendingContainer}>
            <Text style={styles.pendingText}>{t.games.request_pending}</Text>
          </View>
        ) : (
          <View>
            {game.visibility === 'PRIVATE' && (
              <TextInput 
                style={styles.inviteInput}
                placeholder="초대 코드를 입력하세요"
                value={inputToken}
                onChangeText={setInputToken}
                autoCapitalize="characters"
              />
            )}
            <TouchableOpacity style={styles.button} onPress={handleJoin}>
              <Text style={styles.buttonText}>{t.games.join_button}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loader: { flex: 1, justifyContent: 'center' },
  header: { backgroundColor: '#007AFF', padding: 30, paddingTop: 60 },
  headerTop: { flexDirection: 'row', alignItems: 'center' },
  sportTag: { color: 'rgba(255,255,255,0.7)', fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase' },
  privateTag: { backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 10, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 8 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 5 },
  title: { color: '#fff', fontSize: 28, fontWeight: 'bold', flex: 1 },
  shareIconText: { color: '#fff', fontSize: 14, fontWeight: 'bold', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  details: { padding: 20, flexDirection: 'row', flexWrap: 'wrap' },
  detailRow: { width: '50%', marginBottom: 20 },
  detailLabel: { fontSize: 12, color: '#999', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 },
  detailValue: { fontSize: 16, color: '#333', fontWeight: '600' },
  hostSection: { padding: 20, borderTopWidth: 1, borderTopColor: '#f0f0f0', backgroundColor: '#fafafa' },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#999', textTransform: 'uppercase', marginBottom: 15 },
  participantsList: { marginBottom: 20 },
  participantItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 8 },
  participantName: { fontSize: 16, fontWeight: '500' },
  participantStatus: { fontSize: 12, color: '#999' },
  actionButtons: { flexDirection: 'row' },
  miniButton: { backgroundColor: '#007AFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, marginLeft: 8 },
  denyButton: { backgroundColor: '#FF3B30' },
  miniButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  inviteContainer: { marginTop: 10 },
  inviteLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  inviteCode: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', letterSpacing: 4, color: '#007AFF' },
  shareHint: { fontSize: 10, color: '#999', textAlign: 'center', marginTop: 4 },
  generateButton: { borderWeight: 1, borderColor: '#007AFF', borderWidth: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  generateButtonText: { color: '#007AFF', fontWeight: 'bold' },
  descriptionContainer: { padding: 20, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  descriptionText: { fontSize: 16, color: '#666', lineHeight: 24 },
  actionContainer: { padding: 20, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  button: { backgroundColor: '#007AFF', padding: 18, borderRadius: 12, alignItems: 'center' },
  cancelButton: { backgroundColor: '#FF3B30' },
  leaveButton: { backgroundColor: '#8E8E93' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  pendingContainer: { backgroundColor: '#FFF9E6', padding: 18, borderRadius: 12, alignItems: 'center' },
  pendingText: { color: '#D4A017', fontWeight: 'bold' },
  inviteInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 15, marginBottom: 15, textAlign: 'center', fontSize: 18, fontWeight: 'bold', letterSpacing: 2 }
});

