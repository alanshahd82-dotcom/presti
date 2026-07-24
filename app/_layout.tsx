import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// NOTE: Do NOT call SplashScreen.preventAutoHideAsync() here.
// expo-router already calls it internally. Calling it again creates a
// reference count of 2, so a single hideAsync() only brings it to 1
// (never 0), and the splash screen never disappears.

export default function RootLayout() {
  useEffect(() => {
    async function prepare() {
      try {
        await SystemUI.setBackgroundColorAsync('#1C2951');
      } catch (e) {
        // ignore
      } finally {
        await SplashScreen.hideAsync().catch(() => {});
      }
    }
    prepare();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#1C2951" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    </SafeAreaProvider>
  );
}
