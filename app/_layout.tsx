import { Inter_400Regular, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '~/global.css';
import { useColorScheme } from '~/hooks/useColorScheme';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { NAV_THEME } from '~/lib/constants';

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
    onAppReady();
  }, [onAppReady]);

  if (!isColorSchemeLoaded || !fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName='library'
        >
          <Stack.Screen name='index' />
          <Stack.Screen name='library' />
          <Stack.Screen name='(onboarding)' />
        </Stack>
        <PortalHost />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
