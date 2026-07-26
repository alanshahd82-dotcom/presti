import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface Props {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: Props) {
  // Animation values
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(40)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const taglineY = useRef(new Animated.Value(30)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const barWidth = useRef(new Animated.Value(0)).current;
  const dotsOpacity = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;
  const glowScale = useRef(new Animated.Value(0.8)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');

    Animated.sequence([
      // 1. Glow + Logo appear
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 60,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.35,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(glowScale, {
          toValue: 1.4,
          tension: 30,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      // 2. Brand name slides up
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(titleY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      // 3. Gold bar expands
      Animated.timing(barWidth, {
        toValue: 120,
        duration: 350,
        useNativeDriver: false,
      }),
      // 4. Tagline appears
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(taglineY, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
      ]),
      // 5. Dots appear
      Animated.timing(dotsOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // 6. Hold
      Animated.delay(900),
      // 7. Fade out entire screen
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onFinish();
    });
  }, []);

  return (
    <Animated.View style={[styles.root, { opacity: screenOpacity }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Background gradient layers */}
      <View style={styles.bgTop} />
      <View style={styles.bgBottom} />

      {/* Decorative circles */}
      <View style={[styles.circle, styles.circleTopRight]} />
      <View style={[styles.circle, styles.circleBottomLeft]} />

      {/* Glow behind logo */}
      <Animated.View
        style={[
          styles.glow,
          {
            opacity: glowOpacity,
            transform: [{ scale: glowScale }],
          },
        ]}
      />

      {/* Center content */}
      <View style={styles.center}>
        {/* Logo mark */}
        <Animated.View
          style={[
            styles.logoWrap,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}>
          <View style={styles.logoOuter}>
            <Image
              source={require('../../assets/icon.jpg')}
              style={styles.logoImage}
              resizeMode="cover"
            />
          </View>
        </Animated.View>

        {/* Brand name */}
        <Animated.View
          style={{
            opacity: titleOpacity,
            transform: [{ translateY: titleY }],
          }}>
          <Text style={styles.brandTop}>PRESTI</Text>
          <Text style={styles.brandBottom}>CARS</Text>
        </Animated.View>

        {/* Gold separator bar */}
        <Animated.View style={[styles.bar, { width: barWidth }]} />

        {/* Tagline */}
        <Animated.Text
          style={[
            styles.tagline,
            {
              opacity: taglineOpacity,
              transform: [{ translateY: taglineY }],
            },
          ]}>
          Location Premium • Rabat, Maroc
        </Animated.Text>
      </View>

      {/* Bottom badges */}
      <Animated.View style={[styles.bottom, { opacity: dotsOpacity }]}>
        {['⭐ 4.8/5', '🛡️ Assurance', '⚡ 5 min'].map((item, i) => (
          <View key={i} style={styles.badge}>
            <Text style={styles.badgeText}>{item}</Text>
          </View>
        ))}
      </Animated.View>

      {/* Loading dots */}
      <Animated.View style={[styles.loadingRow, { opacity: dotsOpacity }]}>
        {[0, 1, 2].map(i => (
          <LoadingDot key={i} delay={i * 200} />
        ))}
      </Animated.View>
    </Animated.View>
  );
}

function LoadingDot({ delay }: { delay: number }) {
  const anim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.3, duration: 400, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View style={[styles.dot, { opacity: anim }]} />
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0d1a33',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  bgTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.55,
    backgroundColor: '#1a2744',
    borderBottomLeftRadius: width,
    borderBottomRightRadius: width,
  },
  bgBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.2,
    backgroundColor: '#0d1a33',
  },
  circle: {
    position: 'absolute',
    borderRadius: 300,
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 24, 0.1)',
  },
  circleTopRight: {
    width: 300,
    height: 300,
    top: -80,
    right: -80,
  },
  circleBottomLeft: {
    width: 220,
    height: 220,
    bottom: 60,
    left: -60,
  },
  glow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#F5C518',
    top: height * 0.5 - 190,
  },
  center: {
    alignItems: 'center',
    marginTop: -40,
  },
  logoWrap: {
    marginBottom: 28,
  },
  logoOuter: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: '#F5C518',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F5C518',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  logoImage: {
    width: 100,
    height: 100,
    borderRadius: 24,
  },
  brandTop: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 10,
    textAlign: 'center',
    lineHeight: 42,
  },
  brandBottom: {
    color: '#F5C518',
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 10,
    textAlign: 'center',
    lineHeight: 42,
  },
  bar: {
    height: 3,
    backgroundColor: '#F5C518',
    borderRadius: 2,
    marginVertical: 18,
  },
  tagline: {
    color: '#94A3B8',
    fontSize: 13,
    letterSpacing: 1.5,
    textAlign: 'center',
    fontWeight: '500',
  },
  bottom: {
    position: 'absolute',
    bottom: 100,
    flexDirection: 'row',
    gap: 12,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  badgeText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingRow: {
    position: 'absolute',
    bottom: 60,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#F5C518',
  },
});
