export default {
  poweredByHeader: false,
  devIndicators: false,
  images: { unoptimized: true },
  async rewrites() {
    return [
      ...['shop', 'practices', 'about', 'contact', 'admin', 'policies'].map(page => ({
        source: `/${page}`,
        destination: `/?_jssPage=${page}`,
      })),
      { source: '/api/:endpoint+', destination: '/api' },
    ];
  },
  async redirects() {
    return [{ source: '/product/:legacyPath*', destination: '/shop', permanent: false }, ...['checkout', 'order'].map(page => ({
      source: `/${page}/:legacyPath*`,
      destination: '/contact',
      permanent: false,
    }))];
  },
};
