import { useCallback, useState } from 'react';
import { createCustomTheme, customThemes, ThemeName, ThemeStyles } from '../utils/themes';

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('dark');

  const updateTheme = useCallback((name: ThemeName, customStyles?: ThemeStyles) => {
    setCurrentTheme(name);
    
    if (customStyles) {
      return createCustomTheme({
        ...customThemes[name],
        ...customStyles,
      });
    }
    return customThemes[name];
  }, []);

  return {
    currentTheme,
    updateTheme,
    themes: customThemes,
  };
}; 