import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { fetchVehicles } from '../api/supabase';
import { Vehicle, RootStackParamList, HomeTabParamList } from '../types';
import { useFavorites } from '../hooks/useFavorites';
import CarCard from '../components/CarCard';

type Nav = NativeStackNavigationProp<RootStackParamList, 'HomeTabs'>;
type RouteType = RouteProp<HomeTabParamList, 'Listings'>;

const FILTERS = [
  { key: 'all', label: 'Toutes', categoryId: null },
  { key: 'economy', label: 'Économique', categoryId: 5 },
  { key: 'suv', label: 'SUV', categoryId: 7 },
  { key: 'luxury', label: 'Luxe', categoryId: 6 },
];

const SORT_OPTIONS = [
  { key: 'popular', label: 'Populaires' },
  { key: 'price_asc', label: 'Prix ↑' },
  { key: 'price_desc', label: 'Prix ↓' },
  { key: 'name', label: 'A–Z' },
];

export default function ListingsScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteType>();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [sortKey, setSortKey] = useState('popular');
  const [showSort, setShowSort] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();

  // Apply route param category
  useEffect(() => {
    if (route.params?.categoryId != null) {
      setActiveCategory(route.params.categoryId);
    }
  }, [route.params?.categoryId]);

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

  const filtered = useMemo(() => {
    let list = [...vehicles];
    if (activeCategory !== null) {
      list = list.filter(v => v.category_id === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(v =>
        v.name.toLowerCase().includes(q) ||
        v.brand.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q),
      );
    }
    switch (sortKey) {
      case 'price_asc':
        list.sort((a, b) => (a.price_long || a.base_price_daily) - (b.price_long || b.base_price_daily));
        break;
      case 'price_desc':
        list.sort((a, b) => (b.price_long || b.base_price_daily) - (a.price_long || a.base_price_daily));
        break;
      case 'name':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        list.sort((a, b) => (b.is_popular ? 1 : 0) - (a.is_popular ? 1 : 0));
    }
    return list;
  }, [vehicles, activeCategory, search, sortKey]);

  const renderItem = useCallback(({ item, index }: { item: Vehicle; index: number }) => {
    if (index % 2 === 1) return null; // rendered by the even item
    const right = filtered[index + 1];
    return (
      <View style={styles.row}>
        <CarCard
          vehicle={item}
          onPress={() => navigation.navigate('CarDetail', { vehicle: item })}
          onFavorite={() => toggleFavorite(item)}
          isFavorite={isFavorite(item.id)}
        />
        {right ? (
          <CarCard
            vehicle={right}
            onPress={() => navigation.navigate('CarDetail', { vehicle: right })}
            onFavorite={() => toggleFavorite(right)}
            isFavorite={isFavorite(right.id)}
          />
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    );
  }, [filtered, navigation, toggleFavorite, isFavorite]);

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher par nom, marque..."
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Category filter */}
      <View style={styles.filtersRow}>
        <View style={styles.categoryChips}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f.key}
              style={[styles.chip, activeCategory === f.categoryId && styles.chipActive]}
              onPress={() => setActiveCategory(f.categoryId)}>
              <Text style={[styles.chipText, activeCategory === f.categoryId && styles.chipTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.sortBtn} onPress={() => setShowSort(s => !s)}>
          <Text style={styles.sortBtnText}>⇅</Text>
        </TouchableOpacity>
      </View>

      {/* Sort dropdown */}
      {showSort && (
        <View style={styles.sortDropdown}>
          {SORT_OPTIONS.map(o => (
            <TouchableOpacity
              key={o.key}
              style={[styles.sortOption, sortKey === o.key && styles.sortOptionActive]}
              onPress={() => { setSortKey(o.key); setShowSort(false); }}>
              <Text style={[styles.sortOptionText, sortKey === o.key && styles.sortOptionTextActive]}>
                {o.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Count */}
      <Text style={styles.count}>{filtered.length} véhicule{filtered.length !== 1 ? 's' : ''}</Text>

      {/* List */}
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#1a2744" />
          <Text style={styles.loaderText}>Chargement de la flotte...</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🚗</Text>
          <Text style={styles.emptyText}>Aucun véhicule trouvé</Text>
          <TouchableOpacity onPress={() => { setSearch(''); setActiveCategory(null); }}>
            <Text style={styles.emptyReset}>Réinitialiser les filtres</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor="#1a2744" />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#1a2744' },
  filtersRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 4 },
  categoryChips: { flexDirection: 'row', flex: 1, gap: 6 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  chipActive: { backgroundColor: '#1a2744', borderColor: '#1a2744' },
  chipText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  chipTextActive: { color: '#F5C518' },
  sortBtn: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    marginLeft: 8,
  },
  sortBtnText: { fontSize: 16, color: '#1a2744' },
  sortDropdown: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
  },
  sortOption: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  sortOptionActive: { backgroundColor: '#1a274410' },
  sortOptionText: { fontSize: 13, color: '#374151', fontWeight: '500' },
  sortOptionTextActive: { color: '#1a2744', fontWeight: '700' },
  count: { fontSize: 12, color: '#9CA3AF', marginLeft: 16, marginBottom: 8, marginTop: 4 },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  row: { flexDirection: 'row', gap: 16, justifyContent: 'space-between' },
  placeholder: { flex: 1 },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loaderText: { color: '#6B7280', fontSize: 14 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emptyIcon: { fontSize: 48 },
  emptyText: { fontSize: 16, color: '#374151', fontWeight: '600' },
  emptyReset: { fontSize: 14, color: '#F5C518', fontWeight: '600', marginTop: 4 },
});
