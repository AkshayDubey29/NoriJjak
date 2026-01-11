import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

// Mock types since we don't have expo deps installed yet to keep dev non-blocking
interface PushNotificationState {
  expoPushToken: string | undefined;
  notification: any | undefined;
}

export const usePushNotifications = (): PushNotificationState => {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [notification, setNotification] = useState<any | undefined>();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // Mock listener
    // const subscription = Notifications.addNotificationReceivedListener(...)
    
    return () => {
      // cleanup
    };
  }, []);

  return {
    expoPushToken,
    notification,
  };
};

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    // Notifications.setNotificationChannelAsync('default', ...);
  }

  // const { status: existingStatus } = await Notifications.getPermissionsAsync();
  // let finalStatus = existingStatus;
  
  // if (existingStatus !== 'granted') {
  //   const { status } = await Notifications.requestPermissionsAsync();
  //   finalStatus = status;
  // }
  
  // if (finalStatus !== 'granted') {
  //   alert('Failed to get push token for push notification!');
  //   return;
  // }
  
  // token = (await Notifications.getExpoPushTokenAsync()).data;
  
  // MOCK TOKEN GENERATION
  console.log('[Mock] Generating Expo Push Token...');
  token = `ExponentPushToken[mock-token-${Date.now()}]`;

  return token;
}
