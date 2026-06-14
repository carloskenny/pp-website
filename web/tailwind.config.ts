import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    screens: {
      desktop: '1033px',
    },
    extend: {
      colors: {
        primary: '#F97316',
        'primary-dark': '#C2410C',
        secondary: '#16A34A',
        background: '#111827',
        text: '#F9FAFB',
        muted: '#9CA3AF',
        'admin-bg': '#F5F1E8',
        'admin-surface': '#FFFFFF',
        'admin-sidebar': '#173D2C',
        'admin-sidebar-strong': '#10261D',
        'admin-text': '#1F2937',
        'admin-muted': '#6B7280',
      },
      boxShadow: {
        card: '0 8px 24px rgba(0,0,0,0.25)',
      },
      borderRadius: {
        xl2: '20px',
      },
    },
  },
  plugins: [],
};

export default config;
