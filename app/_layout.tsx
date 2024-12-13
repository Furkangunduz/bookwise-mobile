import '~/global.css';

import { Inter_400Regular, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform } from 'react-native';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';

const LIGHT_THEME = { ...DefaultTheme, colors: NAV_THEME.light };
const DARK_THEME = { ...DarkTheme, colors: NAV_THEME.dark };

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  const [fontsLoaded] = useFonts({
    InterRegular: Inter_400Regular,
    InterBold: Inter_700Bold,
  });

  React.useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem('theme');
      if (Platform.OS === 'web') {
        document.documentElement.classList.add('bg-background');
      }
      const colorTheme = theme === 'dark' ? 'dark' : theme === 'light' ? 'light' : 'dark';
      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);
      }
      setAndroidNavigationBar(colorTheme);
      setIsColorSchemeLoaded(true);
    })().finally(() => SplashScreen.hideAsync());
  }, []);

  if (!isColorSchemeLoaded || !fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen
          name='index'
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <PortalHost />
    </ThemeProvider>
  );
}
