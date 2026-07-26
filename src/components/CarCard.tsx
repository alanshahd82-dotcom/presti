import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Vehicle } from '../types';
import { formatPrice, getCategoryLabel, getCategoryColor } from '../utils/format';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface Props {
  vehicle: Vehicle;
  onPress: () => void;
  onFavorite: () => void;
  isFavorite: boolean;
}

export default function CarCard({ vehicle, onPress, onFavorite, isFavorite }: Props) {
  const catColor = getCategoryColor(vehicle.category_id);
  const catLabel = getCategoryLabel(vehicle.category_id);
  const price = vehicle.price_long || vehicle.base_price_daily;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: vehicle.image_url }}
          style={styles.image}
          resizeMode="cover"
        />
        {vehicle.is_popular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>★ Populaire</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.heartBtn}
          onPress={onFavorite}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={[styles.heart, isFavorite && styles.heartActive]}>
            {isFavorite ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={[styles.categoryChip, { backgroundColor: catColor + '18' }]}>
          <Text style={[styles.categoryText, { color: catColor }]}>{catLabel}</Text>
        </View>
        <Text style={styles.name} numberOfLines={1}>{vehicle.name}</Text>
        <View style={styles.specs}>
          <Text style={styles.spec}>{vehicle.transmission === 'Automatique' ? 'Auto' : 'Manuel'}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.spec}>{vehicle.fuel_type}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.spec}>{vehicle.seats} places</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(price)}</Text>
          <Text style={styles.perDay}>/jour</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#F3F4F6',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  popularBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#F5C518',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  popularText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#1a2744',
  },
  heartBtn: {
    position: 'absolute',
    top: 6,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heart: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  heartActive: {
    color: '#EF4444',
  },
  info: {
    padding: 10,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a2744',
    marginBottom: 4,
  },
  specs: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  spec: {
    fontSize: 10,
    color: '#6B7280',
  },
  dot: {
    fontSize: 10,
    color: '#D1D5DB',
    marginHorizontal: 3,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1a2744',
  },
  perDay: {
    fontSize: 10,
    color: '#6B7280',
    marginLeft: 2,
  },
});
