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
const CARD_WIDTH = (width - 52) / 2;

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
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      {/* Image container */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: vehicle.image_url }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Gradient overlay at bottom */}
        <View style={styles.imageOverlay} />

        {/* Popular badge */}
        {vehicle.is_popular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>★ Top</Text>
          </View>
        )}

        {/* Favorite button */}
        <TouchableOpacity
          style={styles.heartBtn}
          onPress={onFavorite}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={[styles.heart, isFavorite && styles.heartActive]}>
            {isFavorite ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>

        {/* Category chip on image */}
        <View style={[styles.catChipOnImage, { backgroundColor: catColor }]}>
          <Text style={styles.catChipText}>{catLabel}</Text>
        </View>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{vehicle.name}</Text>

        <View style={styles.specs}>
          <Text style={styles.spec}>
            {vehicle.transmission === 'Automatique' ? '⚙️ Auto' : '⚙️ Manuel'}
          </Text>
          <View style={styles.dot} />
          <Text style={styles.spec}>👥 {vehicle.seats}p</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(price)}</Text>
          <Text style={styles.perDay}>/j</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#1a2744',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 5,
  },
  imageContainer: {
    width: '100%',
    height: 128,
    backgroundColor: '#E5E7EB',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  popularBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#F5C518',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  popularText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1a2744',
    letterSpacing: 0.3,
  },
  heartBtn: {
    position: 'absolute',
    top: 6,
    right: 7,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 14,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  heart: {
    fontSize: 16,
    color: '#D1D5DB',
  },
  heartActive: {
    color: '#EF4444',
  },
  catChipOnImage: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  catChipText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  info: {
    padding: 11,
  },
  name: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1a2744',
    marginBottom: 5,
    letterSpacing: -0.2,
  },
  specs: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  spec: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1a2744',
    letterSpacing: -0.3,
  },
  perDay: {
    fontSize: 10,
    color: '#9CA3AF',
    marginLeft: 2,
    fontWeight: '600',
  },
});
