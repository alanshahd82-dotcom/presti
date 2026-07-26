import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Animated,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { fetchVehicles } from '../api/supabase';
import { Vehicle, RootStackParamList } from '../types';
import { useFavorites } from '../hooks/useFavorites';
import CarCard from '../components/CarCard';
import { CATEGORY_MAP, WHATSAPP_NUMBER, formatPrice } from '../utils/format';

const { width } = Dimensions.get('window');
type Nav = NativeStackNavigationProp<RootStackParamList, 'HomeTabs'>;

const CATEGORIES = [
  { key: 'economy', label: 'Économique', categoryId: 5, icon: '🚗', desc: 'Dès 230 MAD/j' },
  { key: 'suv',     label: 'SUV',        categoryId: 7, icon: '🚙', desc: 'Dès 350 MAD/j' },
  { key: 'luxury',  label: 'Luxe',       categoryId: 6, icon: '💎', desc: 'Dès 600 MAD/j' },
];

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();

  // Entrance animations
  const heroAnim   = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  const load = useCallback(async () => {
    try {
      const data = await fetchVehicles();
      setVehicles(data);
    } catch (_) {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
    Animated.stagger(150, [
      Animated.timing(heroAnim,    { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(contentAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [load]);

  const popular = vehicles.filter(v => v.is_popular).slice(0, 6);
  const recent  = vehicles.slice(0, 8);

  const openWhatsApp = () => {
    Linking.openURL(
      `https://wa.me/${WHATSAPP_NUMBER}?text=Bonjour%2C%20je%20souhaite%20louer%20une%20voiture`,
    );
  };

  return (
    <ScrollView
      style={styles.container}
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
      <Animated.View style={[styles.hero, { opacity: heroAnim, transform: [{ translateY: heroAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] }]}>
        {/* Decorative elements */}
        <View style={styles.heroDeco1} />
        <View style={styles.heroDeco2} />

        <View style={styles.heroContent}>
          <View style={styles.heroPill}>
            <View style={styles.heroPillDot} />
            <Text style={styles.heroPillText}>📍 Rabat, Maroc</Text>
          </View>

          <Text style={styles.heroTitle}>Location de{'\n'}voiture premium</Text>
          <Text style={styles.heroSub}>
            Réservation instantanée · Tarifs clairs{'\n'}Service haut de gamme depuis 2018
          </Text>

          <TouchableOpacity style={styles.whatsappBtn} onPress={openWhatsApp} activeOpacity={0.85}>
            <Text style={styles.whatsappBtnText}>💬  Réserver sur WhatsApp</Text>
          </TouchableOpacity>
        </View>

        {/* Trust badges */}
        <View style={styles.badges}>
          {[
            { icon: '⭐', value: '4.8/5', label: 'Google' },
            { icon: '🛡️', value: 'Assurance', label: 'Incluse' },
            { icon: '⚡', value: '5 min', label: 'Réponse' },
          ].map(b => (
            <View key={b.value} style={styles.badge}>
              <Text style={styles.badgeIcon}>{b.icon}</Text>
              <Text style={styles.badgeValue}>{b.value}</Text>
              <Text style={styles.badgeLabel}>{b.label}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* ── Content ── */}
      <Animated.View style={{ opacity: contentAnim }}>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nos catégories</Text>
          </View>
          <View style={styles.categoryRow}>
            {CATEGORIES.map(cat => {
              const color = CATEGORY_MAP[cat.categoryId]?.color ?? '#6B7280';
              return (
                <TouchableOpacity
                  key={cat.key}
                  style={[styles.categoryCard, { borderColor: color + '40' }]}
                  onPress={() =>
                    navigation.navigate('HomeTabs', {
                      screen: 'Listings',
                      params: { categoryId: cat.categoryId },
                    } as any)
                  }
                  activeOpacity={0.8}>
                  <View style={[styles.categoryIconBox, { backgroundColor: color + '15' }]}>
                    <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  </View>
                  <Text style={[styles.categoryLabel, { color }]}>{cat.label}</Text>
                  <Text style={styles.categoryDesc}>{cat.desc}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Loading state */}
        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#1a2744" />
            <Text style={styles.loaderText}>Chargement de la flotte...</Text>
          </View>
        ) : (
          <>
            {/* Popular cars */}
            {popular.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>⭐ Véhicules populaires</Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('HomeTabs', { screen: 'Listings' } as any)}>
                    <Text style={styles.seeAll}>Voir tout →</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.grid}>
                  {popular.map(v => (
                    <CarCard
                      key={v.id}
                      vehicle={v}
                      onPress={() => navigation.navigate('CarDetail', { vehicle: v })}
                      onFavorite={() => toggleFavorite(v)}
                      isFavorite={isFavorite(v.id)}
                    />
                  ))}
                </View>
              </View>
            )}

            {/* Budget estimator banner */}
            <TouchableOpacity style={styles.estimatorBanner} onPress={openWhatsApp} activeOpacity={0.88}>
              <View style={styles.estimatorLeft}>
                <Text style={styles.estimatorTitle}>Estimez votre budget</Text>
                <Text style={styles.estimatorSub}>Obtenir un tarif personnalisé →</Text>
              </View>
              <View style={styles.estimatorRight}>
                <Text style={styles.estimatorDes}>Dès</Text>
                <Text style={styles.estimatorPrice}>{formatPrice(230)}</Text>
                <Text style={styles.estimatorUnit}>par jour</Text>
              </View>
            </TouchableOpacity>

            {/* All vehicles */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🚗 Toute la flotte</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('HomeTabs', { screen: 'Listings' } as any)}>
                  <Text style={styles.seeAll}>Voir tout ({vehicles.length}) →</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.grid}>
                {recent.map(v => (
                  <CarCard
                    key={v.id}
                    vehicle={v}
                    onPress={() => navigation.navigate('CarDetail', { vehicle: v })}
                    onFavorite={() => toggleFavorite(v)}
                    isFavorite={isFavorite(v.id)}
                  />
                ))}
              </View>
            </View>
          </>
        )}

        {/* Conditions */}
        <View style={styles.condSection}>
          <Text style={styles.sectionTitle}>📋 Conditions de location</Text>
          <View style={styles.condGrid}>
            {[
              { icon: '🎂', text: 'Âge minimum 25 ans' },
              { icon: '🪪', text: 'Permis valide 2 ans+' },
              { icon: '📄', text: 'CIN ou passeport' },
              { icon: '🛡️', text: 'Assurance incluse' },
              { icon: '🚚', text: 'Livraison gratuite – Rabat' },
              { icon: '💳', text: 'Caution requise' },
            ].map(c => (
              <View key={c.text} style={styles.condItem}>
                <Text style={styles.condIcon}>{c.icon}</Text>
                <Text style={styles.condText}>{c.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 24 }} />
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },

  // Hero
  hero: {
    backgroundColor: '#1a2744',
    paddingTop: 20,
    paddingBottom: 0,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  heroDeco1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(245,197,24,0.06)',
    top: -60,
    right: -40,
  },
  heroDeco2: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(245,197,24,0.04)',
    bottom: 40,
    left: -30,
  },
  heroContent: { marginBottom: 24, zIndex: 1 },
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
  heroPillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F5C518',
    marginRight: 6,
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
  badge: { flex: 1, alignItems: 'center' },
  badgeIcon: { fontSize: 18, marginBottom: 3 },
  badgeValue: { color: '#FFFFFF', fontSize: 12, fontWeight: '700', marginBottom: 1 },
  badgeLabel: { color: '#64748B', fontSize: 10, fontWeight: '500' },

  // Sections
  section: { marginTop: 24, paddingHorizontal: 16 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#1a2744' },
  seeAll: { fontSize: 13, color: '#F5C518', fontWeight: '700' },

  // Categories
  categoryRow: { flexDirection: 'row', gap: 10 },
  categoryCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1.5,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#1a2744',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  categoryIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryIcon: { fontSize: 22 },
  categoryLabel: { fontSize: 12, fontWeight: '800', marginBottom: 2 },
  categoryDesc: { fontSize: 10, color: '#9CA3AF', fontWeight: '500' },

  // Grid
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between' },
  loader: { height: 180, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loaderText: { color: '#6B7280', fontSize: 13 },

  // Estimator
  estimatorBanner: {
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: '#1a2744',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#1a2744',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  estimatorLeft: { flex: 1 },
  estimatorTitle: { color: '#fff', fontSize: 16, fontWeight: '800', marginBottom: 5 },
  estimatorSub: { color: '#F5C518', fontSize: 13, fontWeight: '600' },
  estimatorRight: { alignItems: 'flex-end', marginLeft: 16 },
  estimatorDes: { color: '#94A3B8', fontSize: 11, fontWeight: '500' },
  estimatorPrice: { color: '#F5C518', fontSize: 20, fontWeight: '900' },
  estimatorUnit: { color: '#94A3B8', fontSize: 10, fontWeight: '500' },

  // Conditions
  condSection: {
    marginTop: 24,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  condGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  condItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    gap: 8,
  },
  condIcon: { fontSize: 16 },
  condText: { fontSize: 12, color: '#374151', fontWeight: '600', flex: 1 },
});
