import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ccpd.alpha',
  appName: 'ccpd-qa-app',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    hostname: 'localhost',
    cleartext: true
  },
  android: {
    loggingBehavior: 'debug'
  },
};

export default config;
