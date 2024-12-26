export interface ThemeStyles {
  body?: {
    background?: string;
    color?: string;
    fontSize?: string;
    fontFamily?: string;
    lineHeight?: string;
    margin?: string;
    padding?: string;
  };
  p?: {
    margin?: string;
    padding?: string;
    lineHeight?: string;
    letterSpacing?: string;
    color?: string;
  };
  '::selection'?: {
    background?: string;
    color?: string;
  };
  a?: {
    color?: string;
    textDecoration?: string;
  };
  h1?: {
    color?: string;
    fontSize?: string;
    fontFamily?: string;
    marginBottom?: string;
    lineHeight?: string;
  };
  h2?: Omit<ThemeStyles['h1'], never>;
  h3?: Omit<ThemeStyles['h1'], never>;
  img?: {
    maxWidth?: string;
    height?: string;
    filter?: string;
  };
  blockquote?: {
    borderLeft?: string;
    margin?: string;
    padding?: string;
    background?: string;
    fontStyle?: string;
  };
  code?: {
    background?: string;
    padding?: string;
    borderRadius?: string;
    fontFamily?: string;
    fontSize?: string;
  };
  strong?: {
    color?: string;
    fontWeight?: string;
  };
  em?: {
    color?: string;
  };
  ul?: {
    paddingLeft?: string;
    marginBottom?: string;
  };
  ol?: {
    paddingLeft?: string;
    marginBottom?: string;
  };
  li?: {
    marginBottom?: string;
  };
  table?: {
    width?: string;
    borderCollapse?: string;
    marginBottom?: string;
  };
  th?: {
    borderBottom?: string;
    padding?: string;
    textAlign?: string;
    color?: string;
  };
  td?: {
    borderBottom?: string;
    padding?: string;
  };
}

export const createCustomTheme = (overrides: ThemeStyles = {}) => ({
  body: {
    background: '#121212',
    color: '#E8E8E8',
    fontSize: '18px',
    fontFamily: 'Inter_400Regular',
    lineHeight: '1.8',
    margin: '0 20px',
    padding: '0',
    ...overrides.body,
  },
  p: {
    margin: '0',
    padding: '12px 0',
    lineHeight: '1.8',
    letterSpacing: '0.3px',
    ...overrides.p,
  },
  a: {
    color: '#BB86FC',
    textDecoration: 'none',
    ...overrides.a,
  },
  h1: {
    color: '#E8E8E8',
    fontSize: '28px',
    fontFamily: 'Inter_700Bold',
    marginBottom: '24px',
    lineHeight: '1.4',
    ...overrides.h1,
  },
  h2: {
    color: '#E8E8E8',
    fontSize: '24px',
    fontFamily: 'Inter_700Bold',
    marginBottom: '20px',
    lineHeight: '1.4',
    ...overrides.h2,
  },
  h3: {
    color: '#E8E8E8',
    fontSize: '20px',
    fontFamily: 'Inter_700Bold',
    marginBottom: '16px',
    lineHeight: '1.4',
    ...overrides.h3,
  },
  img: {
    maxWidth: '100%',
    height: 'auto',
    filter: 'brightness(0.9)',
    ...overrides.img,
  },
  blockquote: {
    borderLeft: '3px solid #BB86FC',
    margin: '20px 0',
    padding: '10px 20px',
    background: '#1E1E1E',
    fontStyle: 'italic',
    ...overrides.blockquote,
  },
  code: {
    background: '#1E1E1E',
    padding: '2px 6px',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '16px',
    ...overrides.code,
  },
  strong: {
    color: '#F0F0F0',
    fontWeight: 'bold',
    ...overrides.strong,
  },
  em: {
    color: '#E0E0E0',
    ...overrides.em,
  },
  ul: {
    paddingLeft: '24px',
    marginBottom: '16px',
    ...overrides.ul,
  },
  ol: {
    paddingLeft: '24px',
    marginBottom: '16px',
    ...overrides.ol,
  },
  li: {
    marginBottom: '8px',
    ...overrides.li,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '16px',
    ...overrides.table,
  },
  th: {
    borderBottom: '2px solid #333',
    padding: '12px',
    textAlign: 'left',
    color: '#F0F0F0',
    ...overrides.th,
  },
  td: {
    borderBottom: '1px solid #333',
    padding: '12px',
    ...overrides.td,
  }
});

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