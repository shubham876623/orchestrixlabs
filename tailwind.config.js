/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Paper backgrounds
        paper: {
          base: '#F8F9FA',
          elevated: '#FFFFFF',
          subtle: '#F1F3F5',
        },
        // Navy text
        navy: {
          primary: '#0F172A',
          body: '#1E293B',
          secondary: '#475569',
          muted: '#64748B',
          disabled: '#94A3B8',
        },
        // Cyan accent
        cyan: {
          accent: '#0891B2',
          hover: '#0E7490',
          subtle: '#ECFEFF',
          muted: '#CFFAFE',
        },
        // Borders
        border: {
          DEFAULT: '#E2E8F0',
          subtle: '#F1F5F9',
          strong: '#CBD5E1',
        },
        // Status colors
        status: {
          success: '#059669',
          'success-bg': '#D1FAE5',
          warning: '#D97706',
          'warning-bg': '#FEF3C7',
          error: '#DC2626',
          'error-bg': '#FEE2E2',
          info: '#0891B2',
          'info-bg': '#ECFEFF',
        },
        // Dark section (optional use)
        dark: {
          section: '#0F172A',
          text: '#F8FAFC',
          muted: '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['IBM Plex Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'SF Mono', 'Monaco', 'Courier New', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.25' }],      // 12px
        sm: ['0.875rem', { lineHeight: '1.375' }],    // 14px
        base: ['1rem', { lineHeight: '1.5' }],        // 16px
        lg: ['1.125rem', { lineHeight: '1.625' }],    // 18px
        xl: ['1.25rem', { lineHeight: '1.5' }],       // 20px
        '2xl': ['1.5rem', { lineHeight: '1.375' }],   // 24px
        '3xl': ['1.875rem', { lineHeight: '1.25' }],  // 30px
        '4xl': ['2.25rem', { lineHeight: '1.25' }],   // 36px
        '5xl': ['3rem', { lineHeight: '1.25' }],      // 48px
        '6xl': ['3.75rem', { lineHeight: '1.25' }],   // 60px
      },
      spacing: {
        '0.5': '0.125rem',  // 2px
        '1': '0.25rem',     // 4px
        '2': '0.5rem',      // 8px
        '3': '0.75rem',     // 12px
        '4': '1rem',        // 16px
        '5': '1.25rem',     // 20px
        '6': '1.5rem',      // 24px
        '7': '1.75rem',     // 28px
        '8': '2rem',        // 32px
        '10': '2.5rem',     // 40px
        '12': '3rem',       // 48px
        '14': '3.5rem',     // 56px
        '16': '4rem',       // 64px
        '20': '5rem',       // 80px
        '24': '6rem',       // 96px
        '32': '8rem',       // 128px
        '40': '10rem',      // 160px
        '48': '12rem',      // 192px
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
        full: '9999px',
      },
      boxShadow: {
        xs: '0 1px 1px 0 rgba(15, 23, 42, 0.03)',
        sm: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
        DEFAULT: '0 2px 4px 0 rgba(15, 23, 42, 0.08)',
        md: '0 2px 4px 0 rgba(15, 23, 42, 0.08)',
        lg: '0 4px 8px 0 rgba(15, 23, 42, 0.12)',
        xl: '0 8px 16px 0 rgba(15, 23, 42, 0.16)',
        none: 'none',
      },
      transitionDuration: {
        fast: '150ms',
        DEFAULT: '200ms',
        slow: '300ms',
        slower: '400ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      maxWidth: {
        'content': '1200px',
      },
    },
  },
  plugins: [],
}
