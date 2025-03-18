import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'nz.co.sustainableoceansociety.greatwhiteapp',
  appName: 'The Great White App',
  webDir: 'dist',
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      style: "DEFAULT",
      backgroundColor: "#101855",
    },
    SplashScreen: {
      launchAutoHide: true,
      launchFadeOutDuration: 1000,
      backgroundColor: "#101855",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: true,
    },
    EdgeToEdge: {
      backgroundColor: "#101855",
    }
  },
};

export default config;
