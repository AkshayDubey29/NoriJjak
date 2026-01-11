export const Theme = {
  colors: {
    primary: '#4f46e5', // Indigo 600
    primaryForeground: '#ffffff',
    secondary: '#0f172a', // Slate 900
    background: '#f8fafc', // Slate 50
    surface: '#ffffff',
    border: '#e2e8f0', // Slate 200
    muted: '#94a3b8', // Slate 400
    destructive: '#ef4444', // Red 500
    success: '#10b981', // Emerald 500
    
    // Extended Palette
    slate: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    blue: {
      50: '#eff6ff',
      500: '#3b82f6',
      600: '#2563eb',
    },
    indigo: {
      50: '#eef2ff',
      500: '#6366f1',
      600: '#4f46e5',
    },
    emerald: {
      50: '#ecfdf5',
      500: '#10b981',
      600: '#059669',
    },
    amber: {
      50: '#fffbeb',
      500: '#f59e0b',
      600: '#d97706',
    },
    rose: {
      50: '#fff1f2',
      500: '#f43f5e',
      600: '#e11d48',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  radius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    '3xl': 32,
    full: 9999,
  },
  typography: {
    h1: { fontSize: 32, fontWeight: '700' as const, letterSpacing: -0.5 },
    h2: { fontSize: 24, fontWeight: '700' as const, letterSpacing: -0.4 },
    subtitle: { fontSize: 18, fontWeight: '600' as const },
    body: { fontSize: 16, fontWeight: '400' as const },
    caption: { fontSize: 13, fontWeight: '400' as const },
    label: { fontSize: 14, fontWeight: '600' as const },
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
  }
};
