const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = (phase, { defaultConfig }) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  return {
    ...defaultConfig,
    reactStrictMode: true,

    serverRuntimeConfig: {
      programmerEmail: 'justin@jjwilly.com',
    },

    publicRuntimeConfig: {},

    async headers() {
      if (!isDev) {
        return [
          {
            source: '/(.*)',
            headers: [
              {
                key: 'Content-Security-Policy',
                value: Object.entries({
                  // If a directive is missing, the rule will fall back to default-src
                  'default-src': [
                    "'self'",
                  ],
                  // Valid sources for loading javascript
                  'script-src': [
                    "'self'",
                  ],
                  // Valid sources for loading stylesheets
                  'style-src': [
                    "'self'",
                    "'unsafe-inline'",
                    // Needed for loading google fonts in scss
                    'https://fonts.googleapis.com',
                  ],
                  // Valid sources for loading fonts
                  'font-src': [
                    "'self'",
                    // Google font loading
                    'https://fonts.gstatic.com',
                  ],
                  // Valid sources for URLs loaded in scripts
                  'connect-src': [
                    "'self'",
                    // Needed for local livereload server
                    'ws:',
                    'wss:',
                    // Vercel analytics
                    'vitals.vercel-insights.com',
                  ],
                  // Valid sources for images
                  'img-src': [
                    "'self'",
                    // Allow data URIs
                    'data:',
                    // Allow blobs
                    'blob:',
                  ],
                  // Valid sources for object tags
                  'object-src': [
                    "'none'",
                  ],
                  // Valid sources for the <base> tag in the header
                  'base-uri': [
                    "'self'",
                  ],
                  // Valid sources for iframes
                  'frame-src': [
                    "'none'",
                  ],
                  // Valid parents for iframes
                  'frame-ancestors': [
                    "'none'",
                  ],
                  // Upgrade http requests to https
                  'upgrade-insecure-requests': !isDev,
                })
                  .reduce((arr, [key, value]) => {
                    const parsedValue = Array.isArray(value) ? value.join(' ') : value;
                    if (value) arr.push(`${key}${typeof parsedValue === 'string' ? ` ${parsedValue}` : ''}`);
                    return arr;
                  }, [])
                  .join('; '),
              },
              {
                key: 'X-DNS-Prefetch-Control',
                value: 'on'
              },
              {
                key: 'X-XSS-Protection',
                value: '1; mode=block'
              },
              {
                key: 'X-Frame-Options',
                value: 'SAMEORIGIN'
              },
              {
                key: 'X-Content-Type-Options',
                value: 'nosniff'
              },
              {
                key: 'Referrer-Policy',
                value: 'origin-when-cross-origin'
              },
            ]
          }
        ];
      }
      return [];
    },
  }
}
