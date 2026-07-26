import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, HomeTabParamList } from '../types';
import HomeScreen from '../screens/HomeScreen';
import ListingsScreen from '../screens/ListingsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ContactScreen from '../screens/ContactScreen';
import CarDetailScreen from '../screens/CarDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<HomeTabParamList>();

const ICONS: Record<string, { active: string; inactive: string }> = {
  Home:      { active: '🏠', inactive: '🏠' },
  Listings:  { active: '🚗', inactive: '🚗' },
  Favorites: { active: '♥', inactive: '♡' },
  Contact:   { active: '☎', inactive: '☎' },
};

const LABELS: Record<string, string> = {
  Home: 'Accueil',
  Listings: 'Voitures',
  Favorites: 'Favoris',
  Contact: 'Contact',
};

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icon = focused ? ICONS[name].active : ICONS[name].inactive;
  const label = LABELS[name];
  return (
    <View style={tabStyles.iconWrap}>
      {focused && <View style={tabStyles.activePill} />}
      <Text style={[tabStyles.icon, focused && tabStyles.iconActive]}>{icon}</Text>
      <Text style={[tabStyles.label, focused && tabStyles.labelActive]}>{label}</Text>
    </View>
  );
}

const HEADER_COMMON = {
  headerStyle: { backgroundColor: '#1a2744' },
  headerTintColor: '#F5C518',
  headerTitleStyle: { fontWeight: '800' as const, fontSize: 18, letterSpacing: 0.5 },
  headerShadowVisible: false,
};

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: tabStyles.bar,
        tabBarActiveTintColor: '#F5C518',
        tabBarInactiveTintColor: '#9CA3AF',
      }}>

      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: true,
          headerTitle: 'Prestige Cars',
          ...HEADER_COMMON,
          tabBarIcon: ({ focused }) => <TabIcon name="Home" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Listings"
        component={ListingsScreen}
        options={{
          headerShown: true,
          headerTitle: 'Notre Flotte',
          ...HEADER_COMMON,
          tabBarIcon: ({ focused }) => <TabIcon name="Listings" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          headerShown: true,
          headerTitle: 'Mes Favoris',
          ...HEADER_COMMON,
          tabBarIcon: ({ focused }) => <TabIcon name="Favorites" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Contact"
        component={ContactScreen}
        options={{
          headerShown: true,
          headerTitle: 'Contact',
          ...HEADER_COMMON,
          tabBarIcon: ({ focused }) => <TabIcon name="Contact" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeTabs" component={HomeTabs} />
        <Stack.Screen
          name="CarDetail"
          component={CarDetailScreen}
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const tabStyles = StyleSheet.create({
  bar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 0,
    height: Platform.OS === 'ios' ? 80 : 70,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    shadowColor: '#1a2744',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 16,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
    width: 64,
  },
  activePill: {
    position: 'absolute',
    top: -6,
    width: 36,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#F5C518',
  },
  icon: {
    fontSize: 22,
    color: '#9CA3AF',
  },
  iconActive: {
    color: '#1a2744',
  },
  label: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 3,
    fontWeight: '600',
  },
  labelActive: {
    color: '#1a2744',
    fontWeight: '700',
  },
});
