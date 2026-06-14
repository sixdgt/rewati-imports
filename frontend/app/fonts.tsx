import { Inter, Playfair_Display } from 'next/font/google';

// Configure your primary font
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter', // Useful for Tailwind
});

// Configure a secondary font
export const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});