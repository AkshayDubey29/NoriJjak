import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  Animated,
  Dimensions,
  TouchableOpacity,
  Platform
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { TRANSLATIONS } from '@norijjak/shared';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme } from '../constants/Theme';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Chip } from '../components/common/Chip';
import { Card } from '../components/common/Card';
import { LoadingOverlay } from '../components/common/LoadingOverlay';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const ONBOARDING_STATE_KEY = '@onboarding_state';

export default function OnboardingScreen() {
  const { user, setUser } = useAuth();
  const currentLocale = (user?.locale || 'ko-KR') as keyof typeof TRANSLATIONS;
  const t = TRANSLATIONS[currentLocale];

  const STEPS = [
    t.onboarding.step_nickname,
    t.onboarding.step_sports,
    t.onboarding.step_levels,
    t.onboarding.step_area,
    t.onboarding.step_review
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [homeArea, setHomeArea] = useState('');
  const [selectedSports, setSelectedSports] = useState<{id: string, name: string}[]>([]);
  const [sportLevels, setSportLevels] = useState<Record<string, string>>({});
  const [availableSports, setAvailableSports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progress = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fetch('http://10.0.2.2:4000/sports')
      .then(res => res.json())
      .then(data => {
        setAvailableSports(data.sports || []);
        loadSavedState();
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const animateProgress = (step: number) => {
    Animated.spring(progress, {
      toValue: (step + 1) / STEPS.length,
      useNativeDriver: false,
      ...Theme.timing.spring,
    }).start();
  };

  const loadSavedState = async () => {
    try {
      const saved = await AsyncStorage.getItem(ONBOARDING_STATE_KEY);
      if (saved) {
        const state = JSON.parse(saved);
        if (state.currentStep !== undefined) {
          setCurrentStep(state.currentStep);
          progress.setValue((state.currentStep + 1) / STEPS.length);
        }
        if (state.displayName) setDisplayName(state.displayName);
        if (state.homeArea) setHomeArea(state.homeArea);
        if (state.selectedSports) setSelectedSports(state.selectedSports);
        if (state.sportLevels) setSportLevels(state.sportLevels);
      } else {
        animateProgress(0);
      }
    } catch (e) {
      console.error('Failed to load onboarding state', e);
      animateProgress(0);
    }
  };

  const saveState = useCallback(async (step: number) => {
    try {
      await AsyncStorage.setItem(ONBOARDING_STATE_KEY, JSON.stringify({
        currentStep: step,
        displayName,
        homeArea,
        selectedSports,
        sportLevels
      }));
    } catch (e) {
      console.error('Failed to save onboarding state', e);
    }
  }, [displayName, homeArea, selectedSports, sportLevels]);

  const changeStep = (next: number) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: Theme.timing.fast,
      useNativeDriver: true,
    }).start(() => {
      setCurrentStep(next);
      saveState(next);
      animateProgress(next);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: Theme.timing.fast,
        useNativeDriver: true,
      }).start();
    });
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      changeStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      changeStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('@token');
      
      // 1. Update Profile
      await fetch('http://10.0.2.2:4000/user/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ displayName }),
      });

      // 2. Update Preferences
      const res = await fetch('http://10.0.2.2:4000/user/preferences', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          homeArea, 
          sports: selectedSports.map(s => ({ 
            sportId: s.id, 
            level: sportLevels[s.id] || 'BEGINNER' 
          })) 
        }),
      });

      if (!res.ok) throw new Error(t.onboarding.error_saving);

      // 3. Complete onboarding
      const completeRes = await fetch('http://10.0.2.2:4000/user/onboarding/complete', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (completeRes.ok) {
        await AsyncStorage.removeItem(ONBOARDING_STATE_KEY);
        await setUser({ ...user!, onboardingStep: 'DONE', displayName });
      } else {
        throw new Error(t.onboarding.error_completing);
      }
    } catch (err: unknown) {
      Alert.alert(t.safety.report_title, err instanceof Error ? err.message : t.onboarding.error_saving);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderProgress = () => (
    <View style={styles.progressContainer}>
      <View style={styles.stepsInfo}>
        <Text style={styles.stepText}>{t.onboarding.step_nickname} {currentStep + 1} / {STEPS.length}</Text>
        <Text style={styles.stepName}>{STEPS[currentStep]}</Text>
      </View>
      <View style={styles.progressBarBg}>
        <Animated.View 
          style={[
            styles.progressBarFill, 
            { width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%']
              }) 
            }
          ]} 
        />
      </View>
    </View>
  );

  const renderWelcome = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <View style={[styles.iconBox, { backgroundColor: Theme.colors.indigo[50] }]}>
          <Text style={styles.emoji}>👋</Text>
        </View>
        <Text style={styles.stepTitle}>{t.onboarding.nickname_title}</Text>
        <Text style={styles.stepDescription}>
          {t.onboarding.nickname_desc}
        </Text>
      </View>
      <Card elevation="none" padding="lg" style={styles.card}>
        <Input
          label={t.onboarding.step_nickname}
          placeholder={t.onboarding.nickname_placeholder}
          value={displayName}
          onChangeText={setDisplayName}
          icon="person-outline"
          maxLength={10}
        />
      </Card>
    </View>
  );

  const renderSports = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <View style={[styles.iconBox, { backgroundColor: Theme.colors.amber[50] }]}>
          <Text style={styles.emoji}>⚽</Text>
        </View>
        <Text style={styles.stepTitle}>{t.onboarding.sports_title}</Text>
        <Text style={styles.stepDescription}>
          {t.onboarding.sports_desc}
        </Text>
      </View>
      <View style={styles.chipGrid}>
        {availableSports.map(sport => (
          <Chip
            key={sport.id}
            label={sport.name_ko}
            selected={selectedSports.some(s => s.id === sport.id)}
            onPress={() => {
              setSelectedSports(prev => 
                prev.some(s => s.id === sport.id)
                  ? prev.filter(s => s.id !== sport.id)
                  : [...prev, { id: sport.id, name: sport.name_ko }]
              );
            }}
            style={styles.sportChip}
          />
        ))}
      </View>
    </View>
  );

  const renderLevels = () => (
    <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
      <View style={styles.stepContent}>
        <View style={styles.stepHeader}>
          <View style={[styles.iconBox, { backgroundColor: Theme.colors.emerald[50] }]}>
            <Text style={styles.emoji}>🏆</Text>
          </View>
          <Text style={styles.stepTitle}>{t.onboarding.levels_title}</Text>
          <Text style={styles.stepDescription}>
            {t.onboarding.levels_desc}
          </Text>
        </View>
        {selectedSports.map(sport => (
          <Card key={sport.id} padding="md" style={styles.levelCard} elevation="none">
            <Text style={styles.levelCardTitle}>{sport.name}</Text>
            <View style={styles.levelOptions}>
              {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map(level => {
                const isSelected = sportLevels[sport.id] === level;
                return (
                  <TouchableOpacity
                    key={level}
                    onPress={() => setSportLevels(prev => ({ ...prev, [sport.id]: level }))}
                    style={[
                      styles.levelOption,
                      isSelected && styles.levelOptionSelected
                    ]}
                  >
                    <Text style={[
                      styles.levelOptionText,
                      isSelected && styles.levelOptionTextSelected
                    ]}>
                      {level === 'BEGINNER' ? t.onboarding.beginner : level === 'INTERMEDIATE' ? t.onboarding.intermediate : t.onboarding.advanced}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>
        ))}
        {selectedSports.length === 0 && (
          <EmptyState 
            title={t.onboarding.no_sports_selected} 
            description={t.onboarding.no_sports_desc}
            icon="alert-circle-outline"
          />
        )}
      </View>
    </ScrollView>
  );

  const renderArea = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <View style={[styles.iconBox, { backgroundColor: Theme.colors.rose[50] }]}>
          <Text style={styles.emoji}>📍</Text>
        </View>
        <Text style={styles.stepTitle}>{t.onboarding.area_title}</Text>
        <Text style={styles.stepDescription}>
          {t.onboarding.area_desc}
        </Text>
      </View>
      <Card padding="lg" elevation="none" style={styles.card}>
        <Input
          label={t.onboarding.step_area}
          placeholder={t.onboarding.area_placeholder}
          value={homeArea}
          onChangeText={setHomeArea}
          icon="location-outline"
        />
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={16} color={Theme.colors.mutedForeground} />
          <Text style={styles.infoText}>{t.onboarding.area_info}</Text>
        </View>
      </Card>
    </View>
  );

  const renderReview = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <View style={[styles.iconBox, { backgroundColor: Theme.colors.indigo[600] }]}>
          <Text style={[styles.emoji, { color: '#fff' }]}>🎉</Text>
        </View>
        <Text style={styles.stepTitle}>{t.onboarding.review_title}</Text>
        <Text style={styles.stepDescription}>
          {t.onboarding.review_desc}
        </Text>
      </View>
      <Card padding="lg" elevation="none" style={styles.card}>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>{t.onboarding.step_nickname}</Text>
          <Text style={styles.reviewValue}>{displayName}</Text>
        </View>
        <View style={styles.reviewDivider} />
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>{t.onboarding.step_area}</Text>
          <Text style={styles.reviewValue}>{homeArea || '미설정'}</Text>
        </View>
        <View style={styles.reviewDivider} />
        <Text style={styles.reviewLabel}>{t.onboarding.step_sports}</Text>
        <View style={styles.reviewSports}>
          {selectedSports.map(s => (
            <Badge 
              key={s.id} 
              label={`${s.name} · ${sportLevels[s.id] === 'ADVANCED' ? t.onboarding.advanced : sportLevels[s.id] === 'INTERMEDIATE' ? t.onboarding.intermediate : t.onboarding.beginner}`} 
              variant="primary"
              style={styles.reviewBadge}
            />
          ))}
        </View>
      </Card>
    </View>
  );

  const renderContent = () => {
    switch (currentStep) {
      case 0: return renderWelcome();
      case 1: return renderSports();
      case 2: return renderLevels();
      case 3: return renderArea();
      case 4: return renderReview();
      default: return null;
    }
  };

  const isNextDisabled = () => {
    if (currentStep === 0) return !displayName.trim();
    if (currentStep === 1) return selectedSports.length === 0;
    if (currentStep === 2) return selectedSports.length === 0 || selectedSports.some(s => !sportLevels[s.id]);
    if (currentStep === 3) return !homeArea.trim();
    return false;
  };

  if (loading) return <LoadingOverlay message={t.onboarding.loading_sports} />;

  return (
    <ScreenContainer backgroundColor={Theme.colors.background}>
      {renderProgress()}
      
      <Animated.View style={[styles.flex, { opacity: fadeAnim }]}>
        {renderContent()}
      </Animated.View>

      <View style={styles.navigation}>
        {currentStep > 0 ? (
          <Button
            title={t.onboarding.prev_step}
            onPress={prevStep}
            variant="ghost"
            style={styles.navButtonSmall}
          />
        ) : <View style={styles.navButtonSmall} />}
        <Button
          title={currentStep === STEPS.length - 1 ? t.onboarding.start_app : t.onboarding.next_step}
          onPress={nextStep}
          disabled={isNextDisabled()}
          loading={isSubmitting}
          style={styles.navButtonMain}
          size="lg"
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  progressContainer: {
    paddingVertical: Theme.spacing.lg,
  },
  stepsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: Theme.spacing.sm,
  },
  stepText: {
    ...Theme.typography.caption,
    color: Theme.colors.mutedForeground,
    fontWeight: '700',
  },
  stepName: {
    ...Theme.typography.bodySmallBold,
    color: Theme.colors.secondary,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: Theme.colors.slate[200],
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Theme.colors.primary,
  },
  stepContent: {
    flex: 1,
  },
  stepHeader: {
    marginBottom: Theme.spacing.xl,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: Theme.radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.md,
  },
  emoji: {
    fontSize: 28,
  },
  stepTitle: {
    ...Theme.typography.h2,
    color: Theme.colors.secondary,
    marginBottom: Theme.spacing.xs,
  },
  stepDescription: {
    ...Theme.typography.bodyMedium,
    color: Theme.colors.mutedForeground,
    lineHeight: 22,
  },
  card: {
    backgroundColor: Theme.colors.surface,
    borderWidth: 1.5,
    borderColor: Theme.colors.slate[100],
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
  },
  sportChip: {
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.lg,
  },
  levelCard: {
    marginBottom: Theme.spacing.md,
    backgroundColor: Theme.colors.surface,
    borderWidth: 1.5,
    borderColor: Theme.colors.slate[100],
  },
  levelCardTitle: {
    ...Theme.typography.bodyBold,
    color: Theme.colors.secondary,
    marginBottom: Theme.spacing.md,
  },
  levelOptions: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
  },
  levelOption: {
    flex: 1,
    height: 48,
    borderRadius: Theme.radius.lg,
    backgroundColor: Theme.colors.slate[50],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  levelOptionSelected: {
    backgroundColor: Theme.colors.indigo[50],
    borderColor: Theme.colors.primary,
  },
  levelOptionText: {
    ...Theme.typography.bodySmallMedium,
    color: Theme.colors.slate[600],
  },
  levelOptionTextSelected: {
    color: Theme.colors.primary,
    fontWeight: '700',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Theme.spacing.md,
    gap: Theme.spacing.xs,
  },
  infoText: {
    ...Theme.typography.caption,
    color: Theme.colors.mutedForeground,
  },
  reviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewLabel: {
    ...Theme.typography.bodySmallMedium,
    color: Theme.colors.mutedForeground,
  },
  reviewValue: {
    ...Theme.typography.bodyBold,
    color: Theme.colors.secondary,
  },
  reviewDivider: {
    height: 1,
    backgroundColor: Theme.colors.slate[100],
    marginVertical: Theme.spacing.md,
  },
  reviewSports: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Theme.spacing.sm,
    gap: Theme.spacing.xs,
  },
  reviewBadge: {
    paddingVertical: 4,
    paddingHorizontal: Theme.spacing.sm,
  },
  navigation: {
    flexDirection: 'row',
    paddingVertical: Theme.spacing.xl,
    gap: Theme.spacing.md,
    alignItems: 'center',
  },
  navButtonSmall: {
    width: 80,
  },
  navButtonMain: {
    flex: 1,
  },
});
