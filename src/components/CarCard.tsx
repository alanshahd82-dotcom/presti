import React, { useRef, useEffect, useState, memo } from 'react';
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

// Placeholder color shown while image downloads
const PLACEHOLDER_BG = '#1e2d4a';

interface Props {
  vehicle: Vehicle;
  onPress: () => void;
  onFavorite: () => void;
  isFavorite: boolean;
  index?: number;
}

function CarCard({ vehicle, onPress, onFavorite, isFavorite, index = 0 }: Props) {
  const { colors } = useTheme();
  const catColor = getCategoryColor(vehicle.category_id);
  const catLabel = getCategoryLabel(vehicle.category_id);
  const price = vehicle.price_long || vehicle.base_price_daily;

  // Card entrance animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  // Image-specific fade — starts at 0, goes to 1 on load
  const imgOpacity = useRef(new Animated.Value(0)).current;
  const heartScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      delay: Math.min(index * 40, 200),
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, index]);

  const handleImageLoad = () => {
    Animated.timing(imgOpacity, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const handleFavorite = () => {
    Animated.sequence([
      Animated.spring(heartScale, { toValue: 1.35, useNativeDriver: true, tension: 200, friction: 5 }),
      Animated.spring(heartScale, { toValue: 1, useNativeDriver: true, tension: 200, friction: 5 }),
    ]).start();
    onFavorite();
  };

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}
        onPress={onPress}
        activeOpacity={0.88}>

        {/* Image container */}
        <View style={styles.imageContainer}>
          {/* Placeholder shown until image loads */}
          <View style={[StyleSheet.absoluteFill, styles.placeholder]} />

          {/* Actual image — fades in on load */}
          <Animated.Image
            source={{ uri: vehicle.image_url }}
            style={[styles.image, { opacity: imgOpacity }]}
            resizeMode="cover"
            onLoad={handleImageLoad}
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
              <GearIcon size={10} color={colors.textMuted} />
              <Text style={[styles.spec, { color: colors.textMuted }]}>
                {' '}{vehicle.transmission}
              </Text>
            </View>
            <View style={styles.specDot} />
            <View style={styles.specItem}>
              <UsersIcon size={10} color={colors.textMuted} />
              <Text style={[styles.spec, { color: colors.textMuted }]}>
                {' '}{vehicle.seats}
              </Text>
            </View>
          </View>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: colors.primary }]}>
              {formatPrice(price)}
            </Text>
            <Text style={[styles.perDay, { color: colors.textMuted }]}>/j</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default memo(CarCard);

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 18,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  imageContainer: {
    width: '100%',
    height: 130,
    position: 'relative',
  },
  placeholder: {
    backgroundColor: PLACEHOLDER_BG,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.08)',
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
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  heartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  heartBtnInner: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 10,
    padding: 6,
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
    fontSize: 9,
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
