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
import { useTheme } from '../context/ThemeContext';
import { SearchIcon, FilterIcon } from '../components/Icons';

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
  const { colors } = useTheme();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [sortKey, setSortKey] = useState('popular');
  const [showSort, setShowSort] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    if (route.params?.categoryId != null) {
      setActiveCategory(route.params.categoryId);
    }
  }, [route.params?.categoryId]);

  const load = useCallback(async () => {
    try {
      const data = await fetchVehicles();
      setVehicles(data);
    } catch (_) {}
    finally {
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
    if (index % 2 === 1) return null;
    const right = filtered[index + 1];
    return (
      <View style={styles.row}>
        <CarCard
          vehicle={item}
          index={index}
          onPress={() => navigation.navigate('CarDetail', { vehicle: item })}
          onFavorite={() => toggleFavorite(item)}
          isFavorite={isFavorite(item.id)}
        />
        {right ? (
          <CarCard
            vehicle={right}
            index={index + 1}
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
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>

      {/* Search bar */}
      <View style={[styles.searchWrap, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={[styles.searchBox, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
          <SearchIcon size={16} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Rechercher une voiture..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity
          style={[styles.sortBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
          onPress={() => setShowSort(v => !v)}
          activeOpacity={0.8}>
          <FilterIcon size={18} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Sort dropdown */}
      {showSort && (
        <View style={[styles.sortDropdown, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          {SORT_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt.key}
              style={[styles.sortOption, sortKey === opt.key && { backgroundColor: colors.primary + '14' }]}
              onPress={() => { setSortKey(opt.key); setShowSort(false); }}>
              <Text style={[styles.sortOptionText, { color: colors.textSub }, sortKey === opt.key && { color: colors.primary, fontWeight: '700' }]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Filter chips */}
      <View style={[styles.filtersRow, { borderBottomColor: colors.border }]}>
        {FILTERS.map(f => {
          const active = activeCategory === f.categoryId;
          return (
            <TouchableOpacity
              key={f.key}
              style={[
                styles.chip,
                { backgroundColor: colors.card, borderColor: colors.border },
                active && { backgroundColor: colors.primary, borderColor: colors.primary },
              ]}
              onPress={() => setActiveCategory(f.categoryId)}>
              <Text style={[styles.chipText, { color: colors.textSub }, active && { color: '#F5C518' }]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Count */}
      <Text style={[styles.count, { color: colors.textMuted }]}>
        {filtered.length} véhicule{filtered.length !== 1 ? 's' : ''}
      </Text>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#F5C518" />
          <Text style={[styles.loaderText, { color: colors.textSub }]}>Chargement...</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={[styles.emptyText, { color: colors.text }]}>Aucun résultat</Text>
          <TouchableOpacity onPress={() => { setSearch(''); setActiveCategory(null); }}>
            <Text style={styles.emptyReset}>Réinitialiser les filtres</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={v => v.id.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); load(); }}
              tintColor="#F5C518"
              colors={['#F5C518']}
            />
          }
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          initialNumToRender={6}
          maxToRenderPerBatch={4}
          windowSize={5}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },

  // Search
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    padding: 0,
  },
  sortBtn: {
    borderRadius: 12,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },

  // Sort dropdown
  sortDropdown: {
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
    marginBottom: 4,
  },
  sortOption: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
  sortOptionText: { fontSize: 13, fontWeight: '500' },

  // Filters
  filtersRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  chip: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  chipText: { fontSize: 12, fontWeight: '600' },

  // List
  count: {
    fontSize: 12,
    marginLeft: 16,
    marginBottom: 6,
    marginTop: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  row: { flexDirection: 'row', gap: 16, justifyContent: 'space-between' },
  placeholder: { flex: 1 },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loaderText: { fontSize: 14 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  emptyIcon: { fontSize: 48 },
  emptyText: { fontSize: 16, fontWeight: '600' },
  emptyReset: { fontSize: 14, color: '#F5C518', fontWeight: '700', marginTop: 4 },
});
