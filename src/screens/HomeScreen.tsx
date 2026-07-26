import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Dimensions,
  Animated,
  Linking,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { fetchVehicles } from '../api/supabase';
import { Vehicle, RootStackParamList } from '../types';
import { useFavorites } from '../hooks/useFavorites';
import CarCard from '../components/CarCard';
import { SkeletonGrid } from '../components/SkeletonCard';
import { useTheme } from '../context/ThemeContext';
import {
  CarIcon,
  MapPinIcon,
  ShieldIcon,
  ZapIcon,
  StarIcon,
  WhatsAppIcon,
  SunIcon,
  MoonIcon,
  ChevronRightIcon,
} from '../components/Icons';
import { WHATSAPP_NUMBER, formatPrice } from '../utils/format';

const { width } = Dimensions.get('window');
type Nav = NativeStackNavigationProp<RootStackParamList, 'HomeTabs'>;

const CATEGORIES = [
  { key: 'economy', label: 'Économique', categoryId: 5, desc: 'Dès 230 MAD/j', color: '#22C55E' },
  { key: 'suv',     label: 'SUV',        categoryId: 7, desc: 'Dès 350 MAD/j', color: '#3B82F6' },
  { key: 'luxury',  label: 'Luxe',       categoryId: 6, desc: 'Dès 600 MAD/j', color: '#8B5CF6' },
];

function CategoryCard({
  cat,
  onPress,
  index,
  colors,
}: {
  cat: typeof CATEGORIES[0];
  onPress: () => void;
  index: number;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      delay: 300 + index * 80,
      useNativeDriver: true,
      tension: 80,
      friction: 8,
    }).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View style={{ flex: 1, opacity: anim, transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.88, 1] }) }] }}>
      <TouchableOpacity
        style={[styles.categoryCard, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow }]}
        onPress={onPress}
        activeOpacity={0.82}>
        <View style={[styles.catIconBox, { backgroundColor: cat.color + '18' }]}>
          <CarIcon size={22} color={cat.color} strokeWidth={1.8} />
        </View>
        <Text style={[styles.catLabel, { color: colors.text }]}>{cat.label}</Text>
        <Text style={[styles.catDesc, { color: colors.textMuted }]}>{cat.desc}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { colors, isDark, toggle } = useTheme();
  const insets = useSafeAreaInsets();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();

  const heroAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const themeToggleScale = useRef(new Animated.Value(1)).current;

  const load = useCallback(async () => {
    try {
      const data = await fetchVehicles();
      setVehicles(data);
    } catch (_) {}
    finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
    Animated.stagger(120, [
      Animated.timing(heroAnim, { toValue: 1, duration: 560, useNativeDriver: true }),
      Animated.timing(contentAnim, { toValue: 1, duration: 480, useNativeDriver: true }),
    ]).start();
  }, [load]);

  const popular = vehicles.filter(v => v.is_popular).slice(0, 6);
  const recent  = vehicles.slice(0, 8);

  const openWhatsApp = () => {
    Linking.openURL(
      `https://wa.me/${WHATSAPP_NUMBER}?text=Bonjour%2C%20je%20souhaite%20louer%20une%20voiture`,
    );
  };

  const handleThemeToggle = () => {
    Animated.sequence([
      Animated.spring(themeToggleScale, { toValue: 0.8, useNativeDriver: true, tension: 200, friction: 5 }),
      Animated.spring(themeToggleScale, { toValue: 1, useNativeDriver: true, tension: 200, friction: 5 }),
    ]).start();
    toggle();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bg }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => { setRefreshing(true); load(); }}
          tintColor="#F5C518"
          colors={['#F5C518']}
        />
      }
      showsVerticalScrollIndicator={false}>


      {/* ── Hero ── */}
      <Animated.View
        style={[
          styles.hero,
          { backgroundColor: colors.heroBg, paddingTop: insets.top },
          {
            opacity: heroAnim,
            transform: [{ translateY: heroAnim.interpolate({ inputRange: [0, 1], outputRange: [-18, 0] }) }],
          },
        ]}>
        {/* Decorative elements */}
        <View style={styles.heroDeco1} />
        <View style={styles.heroDeco2} />

        {/* Theme toggle button */}
        <Animated.View style={[styles.themeToggleWrap, { transform: [{ scale: themeToggleScale }] }]}>
          <TouchableOpacity
            onPress={handleThemeToggle}
            style={styles.themeToggle}
            activeOpacity={0.8}>
            {isDark ? <SunIcon size={18} color="#F5C518" /> : <MoonIcon size={18} color="#94A3B8" />}
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.heroContent}>
          {/* Location pill */}
          <View style={styles.heroPill}>
            <MapPinIcon size={12} color="#F5C518" />
            <Text style={styles.heroPillText}> Rabat, Maroc</Text>
          </View>

          <Text style={styles.heroTitle}>Location de{'\n'}voiture premium</Text>
          <Text style={styles.heroSub}>
            Réservation instantanée · Tarifs clairs{'\n'}Service haut de gamme depuis 2018
          </Text>

          {/* WhatsApp CTA */}
          <TouchableOpacity style={styles.whatsappBtn} onPress={openWhatsApp} activeOpacity={0.85}>
            <WhatsAppIcon size={20} color="#fff" />
            <Text style={styles.whatsappBtnText}>  Réserver via WhatsApp</Text>
          </TouchableOpacity>
        </View>

        {/* Trust badges */}
        <View style={styles.badges}>
          {[
            { Icon: StarIcon, value: '4.8/5', label: 'Avis clients' },
            { Icon: ShieldIcon, value: 'Assuré', label: 'Couverture totale' },
            { Icon: ZapIcon, value: '5 min', label: 'Réponse rapide' },
          ].map((b, i) => (
            <View key={i} style={styles.badge}>
              <b.Icon size={18} color="#F5C518" strokeWidth={1.8} />
              <Text style={styles.badgeValue}>{b.value}</Text>
              <Text style={styles.badgeLabel}>{b.label}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* ── Content ── */}
      <Animated.View
        style={{
          opacity: contentAnim,
          transform: [{ translateY: contentAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
        }}>

        {/* Categories */}
        <View style={[styles.section, styles.sectionPad]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Nos catégories</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('HomeTabs', { screen: 'Listings' } as any)}
              style={styles.seeAllBtn}>
              <Text style={styles.seeAll}>Voir tout</Text>
              <ChevronRightIcon size={14} color="#F5C518" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
          <View style={styles.categoryRow}>
            {CATEGORIES.map((cat, i) => (
              <CategoryCard
                key={cat.key}
                cat={cat}
                index={i}
                colors={colors}
                onPress={() =>
                  navigation.navigate('HomeTabs', {
                    screen: 'Listings',
                    params: { categoryId: cat.categoryId },
                  } as any)
                }
              />
            ))}
          </View>
        </View>

        {/* Popular vehicles */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, styles.sectionPad]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Populaires</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('HomeTabs', { screen: 'Listings' } as any)}
              style={styles.seeAllBtn}>
              <Text style={styles.seeAll}>Voir tout</Text>
              <ChevronRightIcon size={14} color="#F5C518" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <SkeletonGrid />
          ) : (
            <View style={[styles.grid, styles.sectionPad]}>
              {popular.map((v, idx) => (
                <CarCard
                  key={v.id}
                  vehicle={v}
                  index={idx}
                  onPress={() => navigation.navigate('CarDetail', { vehicle: v })}
                  onFavorite={() => toggleFavorite(v)}
                  isFavorite={isFavorite(v.id)}
                />
              ))}
            </View>
          )}
        </View>

        {/* Estimator banner */}
        <View style={styles.sectionPad}>
          <View style={[styles.estimatorBanner, { backgroundColor: colors.primary }]}>
            <View style={styles.estimatorDeco} />
            <View style={styles.estimatorLeft}>
              <Text style={styles.estimatorTitle}>Estimez votre budget</Text>
              <Text style={styles.estimatorSub}>Tarifs transparents, sans surprises</Text>
            </View>
            <View style={styles.estimatorRight}>
              <Text style={styles.estimatorDes}>Dès</Text>
              <Text style={styles.estimatorPrice}>230</Text>
              <Text style={styles.estimatorUnit}>MAD/jour</Text>
            </View>
          </View>
        </View>

        {/* Recent listings */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, styles.sectionPad]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Tous nos véhicules</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('HomeTabs', { screen: 'Listings' } as any)}
              style={styles.seeAllBtn}>
              <Text style={styles.seeAll}>Voir tout</Text>
              <ChevronRightIcon size={14} color="#F5C518" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <SkeletonGrid />
          ) : (
            <View style={[styles.grid, styles.sectionPad]}>
              {recent.map((v, idx) => (
                <CarCard
                  key={v.id}
                  vehicle={v}
                  index={idx}
                  onPress={() => navigation.navigate('CarDetail', { vehicle: v })}
                  onFavorite={() => toggleFavorite(v)}
                  isFavorite={isFavorite(v.id)}
                />
              ))}
            </View>
          )}
        </View>

        {/* Conditions section */}
        <View style={[styles.condSection, styles.sectionPad, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 14 }]}>
            Conditions de location
          </Text>
          {[
            { icon: '🪪', text: 'Permis de conduire valide' },
            { icon: '🎂', text: 'Âge minimum : 21 ans' },
            { icon: '💳', text: 'Carte bancaire ou espèces' },
            { icon: '📋', text: 'CIN ou passeport en cours' },
          ].map((c, i) => (
            <View key={i} style={styles.condItem}>
              <Text style={styles.condIcon}>{c.icon}</Text>
              <Text style={[styles.condText, { color: colors.textSub }]}>{c.text}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Hero
  hero: {
    paddingTop: 16,
    paddingBottom: 0,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  heroDeco1: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(245,197,24,0.05)',
    top: -60,
    right: -60,
  },
  heroDeco2: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(245,197,24,0.04)',
    bottom: 40,
    left: -30,
  },
  themeToggleWrap: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  themeToggle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  heroContent: { marginBottom: 22, zIndex: 1 },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(245,197,24,0.15)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(245,197,24,0.25)',
  },
  heroPillText: { color: '#F5C518', fontSize: 12, fontWeight: '700' },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 36,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  heroSub: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 22,
  },
  whatsappBtn: {
    backgroundColor: '#25D366',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  whatsappBtnText: { color: '#fff', fontWeight: '800', fontSize: 15, letterSpacing: 0.3 },

  // Badges
  badges: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 16,
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  badge: { flex: 1, alignItems: 'center', gap: 3 },
  badgeValue: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  badgeLabel: { color: '#64748B', fontSize: 9, fontWeight: '500', textAlign: 'center' },

  // Sections
  section: { marginTop: 24 },
  sectionPad: { paddingHorizontal: 16 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800' },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAll: { fontSize: 13, color: '#F5C518', fontWeight: '700' },

  // Categories
  categoryRow: { flexDirection: 'row', gap: 10 },
  categoryCard: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1.5,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  catIconBox: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 9,
  },
  catLabel: { fontSize: 12, fontWeight: '800', marginBottom: 2 },
  catDesc: { fontSize: 10, fontWeight: '500', textAlign: 'center' },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },

  // Estimator
  estimatorBanner: {
    marginTop: 8,
    borderRadius: 22,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  estimatorDeco: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(245,197,24,0.06)',
    right: -20,
    top: -30,
  },
  estimatorLeft: { flex: 1 },
  estimatorTitle: { color: '#fff', fontSize: 16, fontWeight: '800', marginBottom: 5 },
  estimatorSub: { color: '#F5C518', fontSize: 13, fontWeight: '600' },
  estimatorRight: { alignItems: 'flex-end', marginLeft: 16 },
  estimatorDes: { color: '#94A3B8', fontSize: 11, fontWeight: '500' },
  estimatorPrice: { color: '#F5C518', fontSize: 22, fontWeight: '900' },
  estimatorUnit: { color: '#94A3B8', fontSize: 10, fontWeight: '500' },

  // Conditions
  condSection: {
    marginTop: 24,
    borderRadius: 22,
    padding: 18,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  condItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 12,
    marginBottom: 4,
  },
  condIcon: { fontSize: 18 },
  condText: { fontSize: 13, fontWeight: '600', flex: 1 },
});
