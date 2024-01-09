/** @type {import('next').NextConfig} */
module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        perf_hooks: false,
      };
    }

    return config;
  },
  transpilePackages: ["@jamphlet/ui"],
  // env: {
  //   KINDE_SITE_URL:
  //     process.env.KINDE_SITE_URL ?? `https://${process.env.VERCEL_URL}`,
  //   KINDE_POST_LOGOUT_REDIRECT_URL:
  //     process.env.KINDE_POST_LOGOUT_REDIRECT_URL ??
  //     `https://${process.env.VERCEL_URL}/login`,
  //   KINDE_POST_LOGIN_REDIRECT_URL:
  //     process.env.KINDE_POST_LOGIN_REDIRECT_URL ??
  //     `https://${process.env.VERCEL_URL}`,
  // },
};
