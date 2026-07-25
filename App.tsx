import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';

const SITE_URL = 'https://www.prestigecars.ma/';

const PRIMARY = '#1a2744';   // dark navy — PrestigeCars brand colour
const GOLD    = '#f5c518';   // gold accent

export default function App(): React.JSX.Element {
  const webRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);

  /* Android hardware back → WebView back */
  React.useEffect(() => {
    if (Platform.OS !== 'android') return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack) {
        webRef.current?.goBack();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [canGoBack]);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY} />

      {/* Top bar */}
      <View style={styles.bar}>
        {canGoBack && (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => webRef.current?.goBack()}
            activeOpacity={0.7}
          >
            <View style={styles.backArrow} />
          </TouchableOpacity>
        )}
      </View>

      {/* WebView */}
      <WebView
        ref={webRef}
        source={{ uri: SITE_URL }}
        style={styles.web}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        allowsBackForwardNavigationGestures          // iOS swipe back
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={s => setCanGoBack(s.canGoBack)}
        renderLoading={() => (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={GOLD} />
          </View>
        )}
      />

      {/* Global loading overlay on first load */}
      {loading && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <View style={styles.splash}>
            <ActivityIndicator size="large" color={GOLD} />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PRIMARY,
  },
  bar: {
    height: 44,
    backgroundColor: PRIMARY,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    width: 12,
    height: 12,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#ffffff',
    transform: [{ rotate: '45deg' }],
    marginLeft: 6,
  },
  web: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PRIMARY,
  },
  splash: {
    flex: 1,
    backgroundColor: PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
