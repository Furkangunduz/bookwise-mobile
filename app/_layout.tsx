import { Inter_400Regular, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import '~/global.css';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { NAV_THEME } from '~/lib/constants';
import { isOnboardingCompleted } from '~/lib/onboarding';
import { useColorScheme } from '~/lib/useColorScheme';

const LIGHT_THEME = { ...DefaultTheme, colors: NAV_THEME.light };
const DARK_THEME = { ...DarkTheme, colors: NAV_THEME.dark };

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [fontsLoaded] = useFonts({
    InterRegular: Inter_400Regular,
    InterBold: Inter_700Bold,
  });

  const router = useRouter();

  const onAppReady = useCallback(async () => {
    if (isColorSchemeLoaded && fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [isColorSchemeLoaded, fontsLoaded]);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const theme = await AsyncStorage.getItem('theme');
        const colorTheme = theme === 'dark' ? 'dark' : theme === 'light' ? 'light' : 'dark';
        const completed = await isOnboardingCompleted();

        setIsOnboardingComplete(completed);
        setColorScheme(colorTheme);
        setAndroidNavigationBar(colorTheme);
        setIsColorSchemeLoaded(true);
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initializeApp();
  }, [setColorScheme]);

  useEffect(() => {
    if (isColorSchemeLoaded && fontsLoaded) {
      if (isOnboardingComplete) {
        router.replace('/book-list');
      } else {
        router.replace('/');
      }
    }
  }, [isColorSchemeLoaded, fontsLoaded, isOnboardingComplete, router]);

  useEffect(() => {
    onAppReady();
  }, [onAppReady]);

  if (!isColorSchemeLoaded || !fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName='book-list'
      >
        <Stack.Screen name='index' />
        <Stack.Screen name='book-list' />
        <Stack.Screen name='(onboarding)' />
      </Stack>
      <PortalHost />
    </ThemeProvider>
  );
}
