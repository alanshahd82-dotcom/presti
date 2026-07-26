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

type Nav = NativeStackNavigationProp<RootStackParamList, 'HomeTabs'>;

export default function FavoritesScreen() {
  const navigation = useNavigation<Nav>();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  if (favorites.length === 0) {
    return (
      <View style={styles.empty}>
        <View style={styles.emptyIconBox}>
          <Text style={styles.emptyIcon}>♡</Text>
        </View>
        <Text style={styles.emptyTitle}>Aucun favori</Text>
        <Text style={styles.emptySub}>
          Appuyez sur le cœur d'une voiture pour la sauvegarder ici.
        </Text>
        <TouchableOpacity
          style={styles.browseBtn}
          onPress={() =>
            navigation.navigate('HomeTabs', { screen: 'Listings' } as any)
          }
          activeOpacity={0.85}>
          <Text style={styles.browseBtnText}>Parcourir la flotte →</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const pairs: (typeof favorites)[] = [];
  for (let i = 0; i < favorites.length; i += 2) {
    pairs.push(favorites.slice(i, i + 2));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.count}>
        {favorites.length} voiture{favorites.length > 1 ? 's' : ''} sauvegardée
        {favorites.length > 1 ? 's' : ''}
      </Text>
      <FlatList
        data={pairs}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item: pair }) => (
          <View style={styles.row}>
            {pair.map(vehicle => (
              <CarCard
                key={vehicle.id}
                vehicle={vehicle}
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
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  count: {
    fontSize: 12,
    color: '#9CA3AF',
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
    backgroundColor: '#F0F2F5',
    gap: 14,
  },
  emptyIconBox: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#1a2744',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyIcon: { fontSize: 44, color: '#CBD5E1' },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#1a2744' },
  emptySub: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  browseBtn: {
    backgroundColor: '#1a2744',
    borderRadius: 16,
    paddingHorizontal: 28,
    paddingVertical: 15,
    marginTop: 6,
    shadowColor: '#1a2744',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  browseBtnText: { color: '#F5C518', fontWeight: '800', fontSize: 15 },
});
