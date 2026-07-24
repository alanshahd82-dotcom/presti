import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Prevent the splash screen from auto-hiding before we're ready.
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  useEffect(() => {
    // CRITICAL: Do NOT await setBackgroundColorAsync.
    // On certain Android OEM skins (Samsung, Xiaomi, Huawei…) this promise
    // can stall indefinitely without resolving or rejecting.
    // The old try/await/finally pattern meant hideAsync() was never reached
    // when that happened — leaving the splash screen frozen forever.
    // Fire-and-forget is the correct pattern here.
    SystemUI.setBackgroundColorAsync('#1C2951').catch(() => {});

    // Hide the splash immediately. Nothing here needs to pre-load.
    SplashScreen.hideAsync().catch(() => {});
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
