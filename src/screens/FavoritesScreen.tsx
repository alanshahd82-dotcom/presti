import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useFavorites } from '../hooks/useFavorites';
import CarCard from '../components/CarCard';
import { useTheme } from '../context/ThemeContext';
import { HeartIcon, CarIcon } from '../components/Icons';

type Nav = NativeStackNavigationProp<RootStackParamList, 'HomeTabs'>;

export default function FavoritesScreen() {
  const navigation = useNavigation<Nav>();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { colors } = useTheme();

  if (favorites.length === 0) {
    return (
      <View style={[styles.empty, { backgroundColor: colors.bg }]}>
        <View style={[styles.emptyIconBox, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <HeartIcon size={44} color={colors.border} strokeWidth={1.5} />
        </View>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>Aucun favori</Text>
        <Text style={[styles.emptySub, { color: colors.textSub }]}>
          Appuyez sur le cœur d'une voiture pour la sauvegarder ici.
        </Text>
        <TouchableOpacity
          style={[styles.browseBtn, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('HomeTabs', { screen: 'Listings' } as any)}
          activeOpacity={0.85}>
          <CarIcon size={18} color="#F5C518" strokeWidth={2} />
          <Text style={styles.browseBtnText}>Parcourir la flotte</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const pairs: (typeof favorites)[] = [];
  for (let i = 0; i < favorites.length; i += 2) {
    pairs.push(favorites.slice(i, i + 2));
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.count, { color: colors.textMuted }]}>
        {favorites.length} voiture{favorites.length > 1 ? 's' : ''} sauvegardée
        {favorites.length > 1 ? 's' : ''}
      </Text>
      <FlatList
        data={pairs}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item: pair }) => (
          <View style={styles.row}>
            {pair.map((vehicle, idx) => (
              <CarCard
                key={vehicle.id}
                vehicle={vehicle}
                index={idx}
                onPress={() => navigation.navigate('CarDetail', { vehicle })}
                onFavorite={() => toggleFavorite(vehicle)}
                isFavorite={isFavorite(vehicle.id)}
              />
            ))}
            {pair.length === 1 && <View style={styles.placeholder} />}
          </View>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  count: {
    fontSize: 12,
    margin: 16,
    marginBottom: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  row: { flexDirection: 'row', gap: 16, justifyContent: 'space-between' },
  placeholder: { flex: 1 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 14,
  },
  emptyIconBox: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyTitle: { fontSize: 22, fontWeight: '800' },
  emptySub: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  browseBtn: {
    borderRadius: 16,
    paddingHorizontal: 28,
    paddingVertical: 15,
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  browseBtnText: { color: '#F5C518', fontWeight: '800', fontSize: 15 },
});
