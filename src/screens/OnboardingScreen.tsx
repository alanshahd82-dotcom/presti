import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  FlatList,
  StatusBar,
  ListRenderItemInfo,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CarIcon, ShieldIcon, ZapIcon, ArrowRightIcon, CheckCircleIcon } from '../components/Icons';

const { width, height } = Dimensions.get('window');

export const ONBOARDING_KEY = '@presticars_onboarding_done';

const SLIDES = [
  {
    id: '1',
    Icon: CarIcon,
    iconColor: '#F5C518',
    bg: '#0F172A',
    accent: '#F5C518',
    title: 'Bienvenue chez\nPrestige Cars',
    sub: 'Location de voitures premium à Rabat. Choisissez parmi notre flotte exclusive de véhicules haut de gamme.',
    cta: 'Commencer',
  },
  {
    id: '2',
    Icon: ZapIcon,
    iconColor: '#F5C518',
    bg: '#0d1a33',
    accent: '#F5C518',
    title: 'Réservation\nInstantanée',
    sub: 'Réservez votre véhicule en moins de 5 minutes. Tarifs transparents, sans frais cachés.',
    cta: 'Suivant',
  },
  {
    id: '3',
    Icon: ShieldIcon,
    iconColor: '#22C55E',
    bg: '#0F172A',
    accent: '#22C55E',
    title: 'Assurance &\nSérénité',
    sub: 'Tous nos véhicules sont assurés et entretenus régulièrement. Votre sécurité est notre priorité.',
    cta: "C'est parti !",
  },
];

interface Props {
  onDone: () => void;
}

export default function OnboardingScreen({ onDone }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const finish = useCallback(async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0.92, duration: 400, useNativeDriver: true }),
    ]).start(() => onDone());
  }, [fadeAnim, scaleAnim, onDone]);

  const goNext = useCallback(() => {
    if (activeIndex === SLIDES.length - 1) {
      finish();
      return;
    }
    const next = activeIndex + 1;
    Animated.parallel([
      Animated.sequence([
        Animated.timing(slideAnim, { toValue: -30, duration: 150, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]),
    ]).start();
    flatRef.current?.scrollToIndex({ index: next, animated: true });
    setActiveIndex(next);
  }, [activeIndex, finish, slideAnim]);

  const slide = SLIDES[activeIndex];

  const renderItem = useCallback(({ item }: ListRenderItemInfo<typeof SLIDES[0]>) => {
    const IconCmp = item.Icon;
    return (
      <View style={[styles.slide, { width, backgroundColor: item.bg }]}>
        {/* Decorative circles */}
        <View style={[styles.circleOuter, { borderColor: item.accent + '18' }]} />
        <View style={[styles.circleInner, { borderColor: item.accent + '30' }]} />

        {/* Icon area */}
        <View style={[styles.iconWrap, { backgroundColor: item.accent + '14', borderColor: item.accent + '30' }]}>
          <View style={[styles.iconInner, { backgroundColor: item.accent + '22' }]}>
            <IconCmp size={56} color={item.iconColor} strokeWidth={1.5} />
          </View>
        </View>

        {/* Text */}
        <View style={styles.textWrap}>
          <Text style={[styles.title, { color: '#FFFFFF' }]}>{item.title}</Text>
          <View style={[styles.bar, { backgroundColor: item.accent }]} />
          <Text style={styles.sub}>{item.sub}</Text>
        </View>
      </View>
    );
  }, []);

  return (
    <Animated.View
      style={[styles.root, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      <FlatList
        ref={flatRef}
        data={SLIDES}
        renderItem={renderItem}
        keyExtractor={s => s.id}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
      />

      {/* Bottom controls */}
      <View style={styles.bottom}>
        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((s, i) => (
            <Animated.View
              key={s.id}
              style={[
                styles.dot,
                i === activeIndex && [styles.dotActive, { backgroundColor: slide.accent }],
                i !== activeIndex && styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* Skip + Next */}
        <View style={styles.btnRow}>
          {activeIndex < SLIDES.length - 1 && (
            <TouchableOpacity onPress={finish} style={styles.skipBtn} activeOpacity={0.7}>
              <Text style={styles.skipText}>Passer</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={goNext}
            style={[styles.nextBtn, { backgroundColor: slide.accent }]}
            activeOpacity={0.85}>
            <Text style={[styles.nextText, { color: activeIndex === SLIDES.length - 1 ? '#0F172A' : '#0F172A' }]}>
              {slide.cta}
            </Text>
            {activeIndex < SLIDES.length - 1 ? (
              <ArrowRightIcon size={18} color="#0F172A" strokeWidth={2.5} />
            ) : (
              <CheckCircleIcon size={18} color="#0F172A" strokeWidth={2.5} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 200,
  },

  // Decorative
  circleOuter: {
    position: 'absolute',
    width: 340,
    height: 340,
    borderRadius: 170,
    borderWidth: 1,
    top: height * 0.1,
  },
  circleInner: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 1,
    top: height * 0.1 + 50,
  },

  // Icon
  iconWrap: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 40,
  },
  iconInner: {
    width: 116,
    height: 116,
    borderRadius: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Text
  textWrap: { alignItems: 'center' },
  title: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 40,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  bar: {
    width: 48,
    height: 3,
    borderRadius: 2,
    marginBottom: 16,
  },
  sub: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '400',
  },

  // Bottom
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 48,
    paddingHorizontal: 24,
    backgroundColor: '#0F172A',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 8,
  },
  dot: {
    height: 4,
    borderRadius: 2,
  },
  dotActive: {
    width: 28,
  },
  dotInactive: {
    width: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  skipBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  skipText: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '600',
  },
  nextBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
  },
  nextText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
