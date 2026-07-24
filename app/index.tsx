import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';

// react-native-webview does not support web platform — use conditional import
let WebView: any = null;
if (Platform.OS !== 'web') {
  const rnWebView = require('react-native-webview');
  WebView = rnWebView.WebView;
}

const WEBSITE_URL = 'https://www.prestigecars.ma/';

// Standard Chrome Android UA — ensures the website renders the full mobile experience
const ANDROID_USER_AGENT =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36';

// If the WebView hasn't fired onLoadEnd within this many ms, treat it as an error.
const LOAD_TIMEOUT_MS = 20_000;

const COLORS = {
  primary: '#F5B300',
  dark: '#1C2951',
  white: '#FFFFFF',
  gray: '#F2F2F7',
} as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>PRESTIGE</Text>
        <Text style={styles.logoCars}>CARS</Text>
      </View>
      <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 32 }} />
      <Text style={styles.loadingHint}>Chargement en cours…</Text>
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

// Web fallback: show a message since WebView is not supported on web
function WebFallback() {
  return (
    <View style={styles.loadingContainer}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>PRESTIGE</Text>
        <Text style={styles.logoCars}>CARS</Text>
      </View>
      <Text style={[styles.errorMessage, { marginTop: 24 }]}>
        Ouvrez l&apos;application sur votre téléphone
      </Text>
    </View>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

interface HeaderProps {
  canGoBack: boolean;
  onGoBack: () => void;
  onRefresh: () => void;
  paddingTop: number;
}

function Header({ canGoBack, onGoBack, onRefresh, paddingTop }: HeaderProps) {
  return (
    <View style={[styles.header, { paddingTop }]}>
      <View style={styles.headerContent}>
        <TouchableOpacity
          style={[styles.iconButton, !canGoBack && styles.invisible]}
          onPress={onGoBack}
          disabled={!canGoBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.white} />
        </TouchableOpacity>

        <View style={styles.logoRow}>
          <Text style={styles.headerLogoText}>PRESTIGE</Text>
          <Text style={styles.headerLogoCars}>CARS</Text>
        </View>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={onRefresh}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="refresh-outline" size={22} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const webViewRef = useRef<any>(null);
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isWeb = Platform.OS === 'web';

  // ── Loading timeout ──────────────────────────────────────────────────────
  // If the WebView hasn't finished loading after LOAD_TIMEOUT_MS, show the
  // error screen so the user is never stuck staring at a spinner forever.
  const startLoadingTimer = useCallback(() => {
    if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
    loadingTimerRef.current = setTimeout(() => {
      setLoading(false);
      setError(true);
    }, LOAD_TIMEOUT_MS);
  }, []);

  const clearLoadingTimer = useCallback(() => {
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }
  }, []);

  // Start the timer on mount (initial load)
  useEffect(() => {
    if (!isWeb) startLoadingTimer();
    return () => clearLoadingTimer();
  }, [isWeb, startLoadingTimer, clearLoadingTimer]);

  // ── Android hardware back ────────────────────────────────────────────────
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return undefined;

      const onBackPress = (): boolean => {
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

  const handleGoBack = () => webViewRef.current?.goBack();

  const handleRefresh = () => {
    setError(false);
    setLoading(true);
    startLoadingTimer();
    webViewRef.current?.reload();
  };

  const headerPaddingTop = Platform.OS === 'web' ? 0 : insets.top;
  const containerPaddingTop = Platform.OS === 'web' ? 67 : 0;
  const bottomHeight = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { paddingTop: containerPaddingTop }]}>
      <Header
        canGoBack={canGoBack}
        onGoBack={handleGoBack}
        onRefresh={handleRefresh}
        paddingTop={headerPaddingTop}
      />

      {/* Content */}
      {isWeb ? (
        <WebFallback />
      ) : error ? (
        <ErrorScreen onRetry={handleRefresh} />
      ) : (
        <WebView
          ref={webViewRef}
          source={{ uri: WEBSITE_URL }}
          style={styles.webview}
          onLoadStart={() => {
            setLoading(true);
            startLoadingTimer();
          }}
          onLoadEnd={() => {
            clearLoadingTimer();
            setLoading(false);
          }}
          onError={() => {
            clearLoadingTimer();
            setLoading(false);
            setError(true);
          }}
          onHttpError={(syntheticEvent: { nativeEvent: { statusCode: number } }) => {
            if (syntheticEvent.nativeEvent.statusCode >= 500) {
              clearLoadingTimer();
              setError(true);
            }
          }}
          onNavigationStateChange={(navState: { canGoBack: boolean }) => {
            setCanGoBack(navState.canGoBack);
          }}
          userAgent={ANDROID_USER_AGENT}
          allowsBackForwardNavigationGestures
          pullToRefreshEnabled
          startInLoadingState={false}
          javaScriptEnabled
          domStorageEnabled
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          setSupportMultipleWindows={false}
          mixedContentMode="compatibility"
          cacheEnabled
          cacheMode="LOAD_CACHE_ELSE_NETWORK"
        />
      )}

      {/* Loading overlay — shown on top while WebView is loading */}
      {loading && !error && !isWeb && (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <LoadingScreen />
        </View>
      )}

      {/* Bottom safe-area spacer */}
      <View style={{ height: bottomHeight, backgroundColor: COLORS.dark }} />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },

  // Header
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
    fontWeight: '800' as const,
    letterSpacing: 2,
  },
  headerLogoCars: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '800' as const,
    letterSpacing: 2,
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  invisible: {
    opacity: 0,
  },

  // WebView
  webview: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  // Loading overlay
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
    fontWeight: '900' as const,
    letterSpacing: 4,
  },
  logoCars: {
    color: COLORS.primary,
    fontSize: 36,
    fontWeight: '900' as const,
    letterSpacing: 4,
  },
  loadingHint: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    marginTop: 16,
    letterSpacing: 1,
  },

  // Error screen
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
    fontWeight: '700' as const,
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
    fontWeight: '700' as const,
  },
});
