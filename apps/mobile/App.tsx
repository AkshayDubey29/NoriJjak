import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TRANSLATIONS, Locale } from '@norijjak/shared';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Button, Share, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import GamesListScreen from './src/screens/games/GamesListScreen';
import GameDetailScreen from './src/screens/games/GameDetailScreen';
import NotificationsScreen from './src/screens/notifications/NotificationsScreen';
import VenuesListScreen from './src/screens/venues/VenuesListScreen';
import VenueDetailScreen from './src/screens/venues/VenueDetailScreen';
import ClubsListScreen from './src/screens/clubs/ClubsListScreen';
import ClubDetailScreen from './src/screens/clubs/ClubDetailScreen';
import * as Linking from 'expo-linking';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const prefix = Linking.createURL('/');

const linking = {
  prefixes: [prefix, 'norijjak://'],
  config: {
    screens: {
      Explore: {
        screens: {
          GameDetail: 'games/:id',
        },
      },
      VenuesStack: {
        screens: {
          VenueDetail: 'venues/:id',
        }
      },
      ClubsStack: {
        screens: {
          ClubDetail: 'clubs/:id',
        }
      },
      Notifications: 'notifications',
      Onboarding: 'onboarding',
      Login: 'login',
    },
  },
};

function ExploreStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="GamesList" component={GamesListScreen} options={{ title: 'Find Games' }} />
      <Stack.Screen name="GameDetail" component={GameDetailScreen} options={{ title: 'Game Detail' }} />
    </Stack.Navigator>
  );
}

function VenuesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="VenuesList" component={VenuesListScreen} options={{ title: 'Find Venues' }} />
      <Stack.Screen name="VenueDetail" component={VenueDetailScreen} options={{ title: 'Venue Detail' }} />
    </Stack.Navigator>
  );
}

function ClubsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ClubsList" component={ClubsListScreen} options={{ title: 'Find Clubs' }} />
      <Stack.Screen name="ClubDetail" component={ClubDetailScreen} options={{ title: 'Club Detail' }} />
    </Stack.Navigator>
  );
}
const LOCALE_KEY = '@norijjak_locale';

function HomeScreen({ locale }: { locale: Locale }) {
  const t = TRANSLATIONS[locale];
  const onShare = async () => {
    try {
      await Share.share({ message: `Join me on ${t.app_name}!` });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.landing.find_games}</Text>
      <TouchableOpacity style={styles.shareButton} onPress={onShare}>
        <Text style={styles.shareText}>{t.labels.share}</Text>
      </TouchableOpacity>
    </View>
  );
}

function ExploreScreen({ locale }: { locale: Locale }) {
  const t = TRANSLATIONS[locale];
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.landing.book_venues}</Text>
    </View>
  );
}

function ProfileScreen({ locale, setLocale }: { locale: Locale, setLocale: (l: Locale) => void }) {
  const t = TRANSLATIONS[locale];
  const { logout, user } = useAuth();
  
  const toggleLocale = async () => {
    const newLocale = locale === 'ko-KR' ? 'en-US' : 'ko-KR';
    setLocale(newLocale);
    await AsyncStorage.setItem(LOCALE_KEY, newLocale);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.nav.profile}</Text>
      <Text style={styles.email}>{user?.email}</Text>
      <View style={styles.settingItem}>
        <Text>{t.labels.language}: {locale === 'ko-KR' ? '한국어' : 'English'}</Text>
        <Button title="Toggle" onPress={toggleLocale} />
      </View>
      <View style={styles.logoutContainer}>
        <Button title="Logout" color="red" onPress={logout} />
      </View>
    </View>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  const [locale, setLocale] = React.useState<Locale>('ko-KR');

  React.useEffect(() => {
    const loadLocale = async () => {
      const savedLocale = await AsyncStorage.getItem(LOCALE_KEY);
      if (savedLocale) setLocale(savedLocale as Locale);
    };
    loadLocale();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const t = TRANSLATIONS[locale];

  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <StatusBar style="auto" />
      {user ? (
        user.onboardingStep === 'DONE' ? (
          <Tab.Navigator>
            <Tab.Screen name="Home" options={{ tabBarLabel: t.nav.home }}>
              {() => <HomeScreen locale={locale} />}
            </Tab.Screen>
            <Tab.Screen name="Explore" component={ExploreStack} options={{ tabBarLabel: t.nav.explore, headerShown: false }} />
            <Tab.Screen name="VenuesStack" component={VenuesStack} options={{ tabBarLabel: t.venues.list_title, headerShown: false }} />
            <Tab.Screen name="ClubsStack" component={ClubsStack} options={{ tabBarLabel: t.clubs.list_title, headerShown: false }} />
            <Tab.Screen name="Notifications" component={NotificationsScreen} options={{ tabBarLabel: t.games.notifications_title }} />
            <Tab.Screen name="Profile" options={{ tabBarLabel: t.nav.profile }}>
              {() => <ProfileScreen locale={locale} setLocale={setLocale} />}
            </Tab.Screen>
          </Tab.Navigator>
        ) : (
          <Stack.Navigator>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        )
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  email: { fontSize: 16, color: '#666', marginBottom: 20 },
  shareButton: { backgroundColor: '#007AFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  shareText: { color: '#fff', fontWeight: 'bold' },
  settingItem: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 20 },
  logoutContainer: { marginTop: 40, width: '100%' }
});
