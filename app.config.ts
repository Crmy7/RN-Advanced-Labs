import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  expo: {
    name: "RN Advanced Labs",
    slug: "rn-advanced-labs",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    
    // Configuration Deep Linking
    scheme: "rnadvancedlabs",
    
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    
    // Configuration iOS
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.exemple.rnadvancedlabs",
      // Deep linking iOS
      associatedDomains: ["applinks:app.votre-domaine.com"]
    },
    
    // Configuration Android
    android: {
      package: "com.exemple.rnadvancedlabs",
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      // Deep linking Android
      intentFilters: [
        {
          action: "VIEW",
          autoVerify: true,
          data: [
            {
              scheme: "https",
              host: "app.votre-domaine.com"
            }
          ],
          category: ["BROWSABLE", "DEFAULT"]
        }
      ]
    },
    
    // Configuration Web
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
      bundler: "metro"
    },
    
    // Plugins
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000"
          }
        }
      ]
    ],
    
    // Expérimentations
    experiments: {
      typedRoutes: true,
      reactCompiler: true
    },
    
    // Deep Linking avancé
    linking: {
      prefixes: [
        "rnadvancedlabs://",
        "https://app.votre-domaine.com"
      ]
    }
  }
});
