import React, { useRef, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Platform,
  BackHandler,
} from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';

const WEBSITE_URL = 'https://www.prestigecars.ma/';

const COLORS = {
  primary: '#F5B300',
  dark: '#1C2951',
  white: '#FFFFFF',
  error: '#FF3B30',
  gray: '#F2F2F7',
};

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>PRESTIGE</Text>
        <Text style={styles.logoCars}>CARS</Text>
      </View>
      <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 32 }} />
    </View>
  );
}

function ErrorScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <View style={styles.errorContainer}>
      <Ionicons name="wifi-outline" size={64} color={COLORS.primary} />
      <Text style={styles.errorTitle}>Connexion impossible</Text>
      <Text style={styles.errorMessage}>
        Vérifiez votre connexion internet et réessayez.
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.8}>
        <Text style={styles.retryText}>Réessayer</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function HomeScreen() {
  const webViewRef = useRef<WebView>(null);
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);

  // Android back button handling
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return;
      const onBackPress = () => {
        if (canGoBack && webViewRef.current) {
          webViewRef.current.goBack();
          return true;
        }
        return false;
      };
      const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => sub.remove();
    }, [canGoBack])
  );

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    setCanGoBack(navState.canGoBack);
  };

  const handleRetry = () => {
    setError(false);
    setLoading(true);
    webViewRef.current?.reload();
  };

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'web' ? 67 : 0 }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Platform.OS === 'web' ? 0 : insets.top }]}>
        <View style={styles.headerContent}>
          {canGoBack && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => webViewRef.current?.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={22} color={COLORS.white} />
            </TouchableOpacity>
          )}
          <View style={styles.logoRow}>
            <Text style={styles.headerLogoText}>PRESTIGE</Text>
            <Text style={styles.headerLogoCars}>CARS</Text>
          </View>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => webViewRef.current?.reload()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="refresh-outline" size={22} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* WebView */}
      {error ? (
        <ErrorScreen onRetry={handleRetry} />
      ) : (
        <WebView
          ref={webViewRef}
          source={{ uri: WEBSITE_URL }}
          style={styles.webview}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            if (nativeEvent.statusCode >= 500) {
              setError(true);
            }
          }}
          onNavigationStateChange={handleNavigationStateChange}
          allowsBackForwardNavigationGestures={true}
          pullToRefreshEnabled={true}
          startInLoadingState={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          setSupportMultipleWindows={false}
          userAgent="Mozilla/5.0 (Linux; Android 14; Mobile) PrestigeCarsMobileApp/1.0"
        />
      )}

      {/* Loading Overlay */}
      {loading && !error && (
        <View style={styles.loadingOverlay}>
          <LoadingScreen />
        </View>
      )}

      {/* Bottom safe area */}
      <View style={{ height: Platform.OS === 'web' ? 34 : insets.bottom, backgroundColor: COLORS.dark }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  header: {
    backgroundColor: COLORS.dark,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 52,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flex: 1,
    justifyContent: 'center',
  },
  headerLogoText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
  },
  headerLogoCars: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webview: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.dark,
    zIndex: 10,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.dark,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  logoText: {
    color: COLORS.white,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 4,
  },
  logoCars: {
    color: COLORS.primary,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 4,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.dark,
    paddingHorizontal: 40,
    gap: 16,
  },
  errorTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorMessage: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    marginTop: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 12,
  },
  retryText: {
    color: COLORS.dark,
    fontSize: 16,
    fontWeight: '700',
  },
});
