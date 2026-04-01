/** @type {import('tailwindcss').Config} */
// Force reload of configuration to pick up new colors
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
        // Theme Colors (Light)
        'light-bg': '#F8FAFC',
        'light-card': '#FFFFFF',
        'light-text': '#0F172A',
        'light-border': '#E2E8F0',
        // Theme Colors (Dark)
        'dark-bg': '#0F172A',
        'dark-card': '#111827',
        'dark-text': '#F9FAFB',
        'dark-secondary': '#9CA3AF',
        'dark-border': '#1E293B',
        // Status Colors (Glow)
        'status-pending': '#F97316',
        'status-progress': '#3B82F6',
        'status-resolved': '#22C55E',
      },
      boxShadow: {
        'glow-pending': '0 0 15px rgba(249, 115, 22, 0.15)',
        'glow-progress': '0 0 15px rgba(59, 130, 246, 0.15)',
        'glow-resolved': '0 0 15px rgba(34, 197, 94, 0.15)',
        'glow-pending-hover': '0 0 25px rgba(249, 115, 22, 0.25)',
        'glow-progress-hover': '0 0 25px rgba(59, 130, 246, 0.25)',
        'glow-resolved-hover': '0 0 25px rgba(34, 197, 94, 0.25)',
        'premium': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      transitionDuration: {
        'default': '300ms',
      },
    },
  },
  plugins: [],
}
