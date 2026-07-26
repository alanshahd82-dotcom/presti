import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { Vehicle } from '../types';
import { formatPrice, getCategoryLabel, getCategoryColor } from '../utils/format';
import { useTheme } from '../context/ThemeContext';
import { HeartIcon, StarIcon, GearIcon, UsersIcon } from './Icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 52) / 2;

interface Props {
  vehicle: Vehicle;
  onPress: () => void;
  onFavorite: () => void;
  isFavorite: boolean;
  index?: number;
}

export default function CarCard({ vehicle, onPress, onFavorite, isFavorite, index = 0 }: Props) {
  const { colors } = useTheme();
  const catColor = getCategoryColor(vehicle.category_id);
  const catLabel = getCategoryLabel(vehicle.category_id);
  const price = vehicle.price_long || vehicle.base_price_daily;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const scaleAnim = useRef(new Animated.Value(0.96)).current;
  const heartScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 380,
        delay: index * 60,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 380,
        delay: index * 60,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: index * 60,
        useNativeDriver: true,
        tension: 80,
        friction: 8,
      }),
    ]).start();
  }, []);

  const handleFavorite = () => {
    Animated.sequence([
      Animated.spring(heartScale, { toValue: 1.35, useNativeDriver: true, tension: 200, friction: 5 }),
      Animated.spring(heartScale, { toValue: 1, useNativeDriver: true, tension: 200, friction: 5 }),
    ]).start();
    onFavorite();
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
      }}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}
        onPress={onPress}
        activeOpacity={0.88}>

        {/* Image container */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: vehicle.image_url }}
            style={styles.image}
            resizeMode="cover"
          />

          {/* Gradient overlay */}
          <View style={styles.imageOverlay} />

          {/* Top row badges */}
          {vehicle.is_popular && (
            <View style={styles.popularBadge}>
              <StarIcon size={9} color="#1a2744" filled />
              <Text style={styles.popularText}> Top</Text>
            </View>
          )}

          {/* Favorite button */}
          <Animated.View style={[styles.heartBtn, { transform: [{ scale: heartScale }] }]}>
            <TouchableOpacity
              onPress={handleFavorite}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={styles.heartBtnInner}>
              <HeartIcon
                size={15}
                color={isFavorite ? '#EF4444' : '#9CA3AF'}
                filled={isFavorite}
                strokeWidth={2}
              />
            </TouchableOpacity>
          </Animated.View>

          {/* Category chip */}
          <View style={[styles.catChip, { backgroundColor: catColor + 'EE' }]}>
            <Text style={styles.catText}>{catLabel}</Text>
          </View>
        </View>

        {/* Info */}
        <View style={[styles.info, { backgroundColor: colors.card }]}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {vehicle.name}
          </Text>

          {/* Specs row */}
          <View style={styles.specs}>
            <View style={styles.specItem}>
              <GearIcon size={11} color={colors.textMuted} strokeWidth={2} />
              <Text style={[styles.spec, { color: colors.textMuted }]}>
                {vehicle.transmission === 'Automatique' ? 'Auto' : 'Manuel'}
              </Text>
            </View>
            <View style={styles.specDot} />
            <View style={styles.specItem}>
              <UsersIcon size={11} color={colors.textMuted} strokeWidth={2} />
              <Text style={[styles.spec, { color: colors.textMuted }]}>{vehicle.seats}p</Text>
            </View>
          </View>

          {/* Price row */}
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: colors.text }]}>{formatPrice(price)}</Text>
            <Text style={[styles.perDay, { color: colors.textMuted }]}>/j</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 14,
    elevation: 6,
  },
  imageContainer: {
    width: '100%',
    height: 130,
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
    height: 48,
    backgroundColor: 'rgba(0,0,0,0.22)',
  },
  popularBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#F5C518',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  popularText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1a2744',
    letterSpacing: 0.3,
  },
  heartBtn: {
    position: 'absolute',
    top: 7,
    right: 7,
  },
  heartBtnInner: {
    backgroundColor: 'rgba(255,255,255,0.95)',
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
  catChip: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  catText: {
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
    marginBottom: 5,
    letterSpacing: -0.2,
  },
  specs: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  spec: {
    fontSize: 10,
    fontWeight: '500',
  },
  specDot: {
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
    letterSpacing: -0.3,
  },
  perDay: {
    fontSize: 10,
    marginLeft: 2,
    fontWeight: '600',
  },
});
