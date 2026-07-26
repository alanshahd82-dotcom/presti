import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Image,
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
  { key: 'all', label: 'Toutes', categoryId: null },
  { key: 'economy', label: 'Économique', categoryId: 5 },
  { key: 'suv', label: 'SUV', categoryId: 7 },
  { key: 'luxury', label: 'Luxe', categoryId: 6 },
];

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();

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

  useEffect(() => { load(); }, [load]);

  const popular = vehicles.filter(v => v.is_popular).slice(0, 6);
  const recent = vehicles.slice(0, 8);

  const openWhatsApp = () => {
    Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=Bonjour%2C%20je%20souhaite%20louer%20une%20voiture`);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor="#F5C518" />}
      showsVerticalScrollIndicator={false}>

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTag}>📍 Rabat, Maroc</Text>
          <Text style={styles.heroTitle}>Location de voiture{'\n'}de confiance</Text>
          <Text style={styles.heroSub}>Réservation instantanée via WhatsApp.{'\n'}Tarifs clairs, service premium.</Text>
          <TouchableOpacity style={styles.whatsappBtn} onPress={openWhatsApp}>
            <Text style={styles.whatsappBtnText}>💬  Réserver sur WhatsApp</Text>
          </TouchableOpacity>
        </View>

        {/* Trust badges */}
        <View style={styles.badges}>
          {[
            { icon: '⭐', label: '4.8/5 Google' },
            { icon: '🛡️', label: 'Assurance incluse' },
            { icon: '⚡', label: 'Réponse 5 min' },
          ].map(b => (
            <View key={b.label} style={styles.badge}>
              <Text style={styles.badgeIcon}>{b.icon}</Text>
              <Text style={styles.badgeText}>{b.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nos catégories</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.filter(c => c.categoryId !== null).map(cat => {
            const color = CATEGORY_MAP[cat.categoryId!]?.color ?? '#6B7280';
            const icons: Record<string, string> = { economy: '🚗', suv: '🚙', luxury: '💎' };
            return (
              <TouchableOpacity
                key={cat.key}
                style={[styles.categoryCard, { borderColor: color + '30', backgroundColor: color + '10' }]}
                onPress={() => navigation.navigate('HomeTabs', { screen: 'Listings', params: { categoryId: cat.categoryId! } } as any)}>
                <Text style={styles.categoryIcon}>{icons[cat.key]}</Text>
                <Text style={[styles.categoryLabel, { color }]}>{cat.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Popular cars */}
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#1a2744" />
        </View>
      ) : (
        <>
          {popular.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>⭐ Véhicules populaires</Text>
                <TouchableOpacity onPress={() => navigation.navigate('HomeTabs', { screen: 'Listings' } as any)}>
                  <Text style={styles.seeAll}>Voir tout</Text>
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

          {/* Price estimator teaser */}
          <TouchableOpacity style={styles.estimatorBanner} onPress={openWhatsApp}>
            <View>
              <Text style={styles.estimatorTitle}>Estimez votre budget</Text>
              <Text style={styles.estimatorSub}>Obtenir un tarif en 5 minutes →</Text>
            </View>
            <Text style={styles.estimatorPrice}>Dès{'\n'}{formatPrice(230)}/j</Text>
          </TouchableOpacity>

          {/* All vehicles */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🚗 Toute la flotte</Text>
              <TouchableOpacity onPress={() => navigation.navigate('HomeTabs', { screen: 'Listings' } as any)}>
                <Text style={styles.seeAll}>Voir tout ({vehicles.length})</Text>
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
      <View style={[styles.section, { backgroundColor: '#F9FAFB', borderRadius: 16, marginHorizontal: 16, padding: 16 }]}>
        <Text style={styles.sectionTitle}>📋 Conditions</Text>
        {[
          '✅ Âge minimum : 25 ans',
          '✅ Permis valide depuis 2 ans',
          '✅ CIN ou passeport',
          '✅ Assurance complète incluse',
          '✅ Livraison gratuite – Rabat',
        ].map(c => (
          <Text key={c} style={styles.condItem}>{c}</Text>
        ))}
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  hero: {
    backgroundColor: '#1a2744',
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroContent: { marginBottom: 20 },
  heroTag: { color: '#F5C518', fontSize: 12, fontWeight: '600', marginBottom: 8 },
  heroTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    marginBottom: 10,
  },
  heroSub: { color: '#94A3B8', fontSize: 14, lineHeight: 20, marginBottom: 20 },
  whatsappBtn: {
    backgroundColor: '#25D366',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  whatsappBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  badges: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 16,
  },
  badge: { alignItems: 'center', flex: 1 },
  badgeIcon: { fontSize: 20, marginBottom: 4 },
  badgeText: { color: '#CBD5E1', fontSize: 10, textAlign: 'center' },
  section: { marginTop: 24, paddingHorizontal: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#1a2744', marginBottom: 14 },
  seeAll: { fontSize: 13, color: '#F5C518', fontWeight: '600' },
  categoryGrid: { flexDirection: 'row', gap: 10 },
  categoryCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingVertical: 16,
    alignItems: 'center',
  },
  categoryIcon: { fontSize: 26, marginBottom: 6 },
  categoryLabel: { fontSize: 12, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between' },
  loader: { height: 200, alignItems: 'center', justifyContent: 'center' },
  estimatorBanner: {
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: '#1a2744',
    borderRadius: 18,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  estimatorTitle: { color: '#fff', fontSize: 16, fontWeight: '800', marginBottom: 4 },
  estimatorSub: { color: '#F5C518', fontSize: 13 },
  estimatorPrice: { color: '#F5C518', fontSize: 18, fontWeight: '800', textAlign: 'right' },
  condItem: { color: '#374151', fontSize: 13, marginBottom: 6, lineHeight: 20 },
});
