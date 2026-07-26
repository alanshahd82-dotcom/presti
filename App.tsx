import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen, { ONBOARDING_KEY } from './src/screens/OnboardingScreen';

type AppState = 'splash' | 'onboarding' | 'app';

export default function App(): React.JSX.Element {
  const [state, setState] = useState<AppState>('splash');

  const handleSplashDone = async () => {
    try {
      const done = await AsyncStorage.getItem(ONBOARDING_KEY);
      setState(done === 'true' ? 'app' : 'onboarding');
    } catch {
      setState('app');
    }
  };

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        {state === 'splash' && (
          <SplashScreen onFinish={handleSplashDone} />
        )}
        {state === 'onboarding' && (
          <OnboardingScreen onDone={() => setState('app')} />
        )}
        {state === 'app' && <AppNavigator />}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
