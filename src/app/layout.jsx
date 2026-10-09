import './globals.css';
import { siteOrigin, isPublicSite } from '@/lib/site.mjs';

export const metadata = {
  metadataBase: new URL(siteOrigin()),
  title: { default: 'Jain Shudh Snacks — शुद्ध स्वाद, शुद्ध जीवन', template: '%s · Jain Shudh Snacks' },
  description: 'Explore namkeen, bakery treats and everyday essentials from Jain Shudh Snacks in Indore. Browse the range and call Mayank to place your order.',
  icons: { icon: '/images/logo.webp' },
  robots: isPublicSite() ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: { type: 'website', siteName: 'Jain Shudh Snacks', locale: 'en_IN', images: [{ url: '/images/hero-food.webp', alt: 'Illustrative JSS snack arrangement' }] },
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
