import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 52) / 2;

function SkeletonBox({
  w,
  h,
  radius = 8,
  shimmer,
}: {
  w: number | string;
  h: number;
  radius?: number;
  shimmer: Animated.Value;
}) {
  const { colors } = useTheme();
  const bgColor = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.skeletonBase, colors.skeletonShimmer],
  });
  return (
    <Animated.View
      style={[
        { width: w as number, height: h, borderRadius: radius, backgroundColor: bgColor },
      ]}
    />
  );
}

export function SkeletonCarCard() {
  const shimmer = useRef(new Animated.Value(0)).current;
  const { colors } = useTheme();

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 800, useNativeDriver: false }),
        Animated.timing(shimmer, { toValue: 0, duration: 800, useNativeDriver: false }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [shimmer]);

  return (
    <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
      <SkeletonBox w="100%" h={128} radius={0} shimmer={shimmer} />
      <View style={styles.info}>
        <SkeletonBox w="80%" h={14} radius={6} shimmer={shimmer} />
        <View style={{ height: 6 }} />
        <SkeletonBox w="60%" h={10} radius={6} shimmer={shimmer} />
        <View style={{ height: 8 }} />
        <SkeletonBox w="50%" h={16} radius={6} shimmer={shimmer} />
      </View>
    </View>
  );
}

export function SkeletonGrid() {
  return (
    <View style={styles.grid}>
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCarCard key={i} />
      ))}
    </View>
  );
}

export function SkeletonHeroSection() {
  const shimmer = useRef(new Animated.Value(0)).current;
  const { colors } = useTheme();

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 800, useNativeDriver: false }),
        Animated.timing(shimmer, { toValue: 0, duration: 800, useNativeDriver: false }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [shimmer]);

  const bgColor = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.skeletonBase, colors.skeletonShimmer],
  });

  return (
    <Animated.View
      style={[styles.heroSkeleton, { backgroundColor: bgColor }]}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 18,
    marginBottom: 16,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 5,
  },
  info: {
    padding: 11,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  heroSkeleton: {
    height: 280,
    marginHorizontal: 16,
    borderRadius: 24,
    marginBottom: 16,
  },
});
