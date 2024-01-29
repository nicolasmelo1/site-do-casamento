import { execSync } from 'child_process';

/** @type {import('next').NextConfig} */
const nextConfig = {};

process.on('SIGINT', async () => {
  if (process.env.NODE_ENV === 'development')
    execSync('docker compose stop', { stdio: 'inherit' });

  process.exit(0);
})

export default nextConfig;
