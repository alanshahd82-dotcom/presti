import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Dimensions,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { useFavorites } from '../hooks/useFavorites';
import {
  formatPrice,
  getCategoryLabel,
  getCategoryColor,
  WHATSAPP_NUMBER,
  PHONE_MOBILE,
} from '../utils/format';

const { width } = Dimensions.get('window');
type RouteType = RouteProp<RootStackParamList, 'CarDetail'>;

export default function CarDetailScreen() {
  const route = useRoute<RouteType>();
  const navigation = useNavigation();
  const { vehicle } = route.params;
  const { toggleFavorite, isFavorite } = useFavorites();
  const fav = isFavorite(vehicle.id);
  const catColor = getCategoryColor(vehicle.category_id);
  const catLabel = getCategoryLabel(vehicle.category_id);

  const specs = [
    { icon: '⚙️', label: 'Transmission', value: vehicle.transmission },
    { icon: '⛽', label: 'Carburant', value: vehicle.fuel_type },
    { icon: '👥', label: 'Places', value: `${vehicle.seats} personnes` },
    { icon: '🚪', label: 'Portes', value: `${vehicle.doors} portes` },
    { icon: '🧳', label: 'Bagages', value: `${vehicle.luggage} valise${vehicle.luggage > 1 ? 's' : ''}` },
    { icon: '✅', label: 'Disponible', value: vehicle.is_available ? 'Oui' : 'Non' },
  ];

  const pricingRows = [
    { label: '3–7 jours/jour', price: vehicle.base_price_daily },
    { label: '8–14 jours/jour', price: vehicle.price_medium || vehicle.base_price_daily },
    { label: '+15 jours/jour', price: vehicle.price_long || vehicle.price_medium || vehicle.base_price_daily },
  ];

  const bookOnWhatsApp = () => {
    const msg = encodeURIComponent(
      `Bonjour, je suis intéressé par la ${vehicle.name}. Pouvez-vous me confirmer la disponibilité et le tarif ? Merci.`,
    );
    Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`);
  };

  const callAgency = () => {
    Linking.openURL(`tel:${PHONE_MOBILE.replace(/\s|-/g, '')}`);
  };

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image */}
        <View style={styles.imageWrapper}>
          <Image source={{ uri: vehicle.image_url }} style={styles.image} resizeMode="cover" />
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.favBtn} onPress={() => toggleFavorite(vehicle)}>
            <Text style={[styles.favIcon, fav && styles.favActive]}>{fav ? '♥' : '♡'}</Text>
          </TouchableOpacity>
          {vehicle.is_popular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>★ Populaire</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          {/* Name & category */}
          <View style={styles.nameRow}>
            <View style={{ flex: 1 }}>
              <View style={[styles.catChip, { backgroundColor: catColor + '18' }]}>
                <Text style={[styles.catChipText, { color: catColor }]}>{catLabel}</Text>
              </View>
              <Text style={styles.name}>{vehicle.name}</Text>
              <Text style={styles.brand}>{vehicle.brand} · {vehicle.model}</Text>
            </View>
          </View>

          {/* Pricing */}
          <View style={styles.pricingCard}>
            <Text style={styles.pricingTitle}>💰 Tarifs</Text>
            {pricingRows.map(r => (
              <View key={r.label} style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>{r.label}</Text>
                <Text style={styles.pricingValue}>{formatPrice(r.price)}</Text>
              </View>
            ))}
            <View style={styles.pricingNote}>
              <Text style={styles.pricingNoteText}>
                * Assurance complète incluse · Carburant non inclus
              </Text>
            </View>
          </View>

          {/* Specs */}
          <View style={styles.specsSection}>
            <Text style={styles.sectionTitle}>🔧 Caractéristiques</Text>
            <View style={styles.specsGrid}>
              {specs.map(s => (
                <View key={s.label} style={styles.specCard}>
                  <Text style={styles.specIcon}>{s.icon}</Text>
                  <Text style={styles.specLabel}>{s.label}</Text>
                  <Text style={styles.specValue}>{s.value}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Included */}
          <View style={styles.includedSection}>
            <Text style={styles.sectionTitle}>✅ Inclus dans le tarif</Text>
            {[
              'Assurance tous risques',
              'Assistance 24h/24 · 7j/7',
              'Livraison gratuite à Rabat',
              'Documents de location',
            ].map(item => (
              <View key={item} style={styles.includedRow}>
                <Text style={styles.includedDot}>●</Text>
                <Text style={styles.includedText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.cta}>
        <View>
          <Text style={styles.ctaPrice}>{formatPrice(vehicle.price_long || vehicle.base_price_daily)}</Text>
          <Text style={styles.ctaPerDay}>par jour (15+ jours)</Text>
        </View>
        <View style={styles.ctaBtns}>
          <TouchableOpacity style={styles.callBtn} onPress={callAgency}>
            <Text style={styles.callBtnText}>📞</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.whatsappBtn} onPress={bookOnWhatsApp}>
            <Text style={styles.whatsappBtnText}>💬  Réserver</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F3F4F6' },
  imageWrapper: { width, height: 280, position: 'relative', backgroundColor: '#E5E7EB' },
  image: { width: '100%', height: '100%' },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: { color: '#fff', fontSize: 20, fontWeight: '700' },
  favBtn: {
    position: 'absolute',
    top: 50,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favIcon: { fontSize: 22, color: '#9CA3AF' },
  favActive: { color: '#EF4444' },
  popularBadge: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    backgroundColor: '#F5C518',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  popularText: { fontSize: 11, fontWeight: '700', color: '#1a2744' },
  content: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 100 },
  nameRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 },
  catChip: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  catChipText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  name: { fontSize: 24, fontWeight: '800', color: '#1a2744', marginBottom: 4 },
  brand: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  pricingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  pricingTitle: { fontSize: 15, fontWeight: '700', color: '#1a2744', marginBottom: 12 },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  pricingLabel: { fontSize: 13, color: '#6B7280' },
  pricingValue: { fontSize: 15, fontWeight: '800', color: '#1a2744' },
  pricingNote: { marginTop: 10 },
  pricingNoteText: { fontSize: 11, color: '#9CA3AF', fontStyle: 'italic' },
  specsSection: { marginBottom: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1a2744', marginBottom: 12 },
  specsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  specCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    width: (width - 52) / 3,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  specIcon: { fontSize: 20, marginBottom: 4 },
  specLabel: { fontSize: 9, color: '#9CA3AF', textAlign: 'center', marginBottom: 2 },
  specValue: { fontSize: 11, fontWeight: '700', color: '#1a2744', textAlign: 'center' },
  includedSection: {
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  includedRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  includedDot: { color: '#22C55E', fontSize: 8, marginRight: 8 },
  includedText: { fontSize: 13, color: '#15803D', flex: 1 },
  cta: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },
  ctaPrice: { fontSize: 22, fontWeight: '800', color: '#1a2744' },
  ctaPerDay: { fontSize: 11, color: '#6B7280' },
  ctaBtns: { flexDirection: 'row', gap: 10 },
  callBtn: {
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  callBtnText: { fontSize: 20 },
  whatsappBtn: {
    backgroundColor: '#25D366',
    borderRadius: 14,
    paddingHorizontal: 24,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whatsappBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
