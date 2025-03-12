/** @type {import('next').NextConfig} */
const nextConfig = {
  isr: {
    incremental: false, // アプリケーション全体でISRを無効にする
  },
};

export default nextConfig;
