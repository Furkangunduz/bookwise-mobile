import { Themes } from '@epubjs-react-native/core';

export interface ThemeStyles {
  body?: {
    background?: string;
    color?: string;
    fontSize?: string;
    fontFamily?: string;
    margin?: string;
    padding?: string;
  };
  '::selection'?: {
    background?: string;
    color?: string;
  };
  a?: {
    color?: string;
    cursor?: 'pointer' | 'default' | 'text';
    'pointer-events'?: 'auto' | 'none';
    textDecoration?: string;
  };
  p?: {
    color?: string;
    lineHeight?: string;
    margin?: string;
    fontSize?: string;
    fontFamily?: string;
  };
  h1?: {
    color?: string;
    fontSize?: string;
    margin?: string;
    fontFamily?: string;
    fontWeight?: string;
  };
  h2?: Omit<ThemeStyles['h1'], never>;
  h3?: Omit<ThemeStyles['h1'], never>;
  h4?: Omit<ThemeStyles['h1'], never>;
  li?: {
    color?: string;
    margin?: string;
    listStyle?: string;
  };
  span?: {
    color?: string;
    fontSize?: string;
    fontFamily?: string;
  };
  img?: {
    maxWidth?: string;
    height?: string;
    objectFit?: 'contain' | 'cover' | 'fill';
  };
}

export const createCustomTheme = (overrides: ThemeStyles = {}) => {
  return {
    ...Themes.DARK,
    ...overrides,
  };
};

// Example usage with autocomplete
export const customThemes = {
  dark: createCustomTheme({
    body: {
      background: '#1C1C1E',
      color: '#ffffff',
      fontSize: '16px',
      fontFamily: '-apple-system, system-ui',
    },
    '::selection': {
      background: 'rgba(100, 100, 100, 0.3)',
    },
    p: {
      color: '#ffffff',
      lineHeight: '1.6',
      margin: '1em 0',
    },
  }),
  black: createCustomTheme({
    body: {
      background: '#000000',
      color: '#ffffff',
    },
    p: {
      color: '#ffffff',
      lineHeight: '1.8',
    }
  }),
};

// Type for available theme names
export type ThemeName = keyof typeof customThemes; 