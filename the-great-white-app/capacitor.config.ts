import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'nz.co.sustainableoceansociety.greatwhiteapp',
  appName: 'The Great White App',
  webDir: 'dist',
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      style: "DEFAULT",
      backgroundColor: "#FFFFFFFF",
    },
  },
};

export default config;
