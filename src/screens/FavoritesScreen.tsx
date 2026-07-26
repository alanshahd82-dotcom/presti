import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useFavorites } from '../hooks/useFavorites';
import CarCard from '../components/CarCard';

type Nav = NativeStackNavigationProp<RootStackParamList, 'HomeTabs'>;
const { width } = Dimensions.get('window');

export default function FavoritesScreen() {
  const navigation = useNavigation<Nav>();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  if (favorites.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>♡</Text>
        <Text style={styles.emptyTitle}>Aucun favori</Text>
        <Text style={styles.emptySub}>
          Appuyez sur le cœur d'une voiture pour la sauvegarder ici.
        </Text>
        <TouchableOpacity
          style={styles.browseBtn}
          onPress={() => navigation.navigate('HomeTabs', { screen: 'Listings' } as any)}>
          <Text style={styles.browseBtnText}>Parcourir la flotte</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const pairs = [];
  for (let i = 0; i < favorites.length; i += 2) {
    pairs.push(favorites.slice(i, i + 2));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.count}>
        {favorites.length} voiture{favorites.length > 1 ? 's' : ''} sauvegardée{favorites.length > 1 ? 's' : ''}
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
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  count: { fontSize: 12, color: '#9CA3AF', margin: 16, marginBottom: 8 },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  row: { flexDirection: 'row', gap: 16, justifyContent: 'space-between' },
  placeholder: { flex: 1 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    backgroundColor: '#F3F4F6',
    gap: 12,
  },
  emptyIcon: { fontSize: 64, color: '#D1D5DB', marginBottom: 8 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#1a2744' },
  emptySub: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 22 },
  browseBtn: {
    backgroundColor: '#1a2744',
    borderRadius: 14,
    paddingHorizontal: 28,
    paddingVertical: 14,
    marginTop: 8,
  },
  browseBtnText: { color: '#F5C518', fontWeight: '700', fontSize: 15 },
});
