import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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

function TabIcon({ icon, label, focused }: { icon: string; label: string; focused: boolean }) {
  return (
    <View style={tabStyles.iconWrap}>
      <Text style={[tabStyles.icon, focused && tabStyles.iconActive]}>{icon}</Text>
      <Text style={[tabStyles.label, focused && tabStyles.labelActive]}>{label}</Text>
    </View>
  );
}

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
          headerStyle: { backgroundColor: '#1a2744' },
          headerTintColor: '#F5C518',
          headerTitleStyle: { fontWeight: '800', fontSize: 18 },
          tabBarIcon: ({ focused }) => <TabIcon icon="🏠" label="Accueil" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Listings"
        component={ListingsScreen}
        options={{
          headerShown: true,
          headerTitle: 'Notre Flotte',
          headerStyle: { backgroundColor: '#1a2744' },
          headerTintColor: '#F5C518',
          headerTitleStyle: { fontWeight: '800', fontSize: 18 },
          tabBarIcon: ({ focused }) => <TabIcon icon="🚗" label="Voitures" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          headerShown: true,
          headerTitle: 'Mes Favoris',
          headerStyle: { backgroundColor: '#1a2744' },
          headerTintColor: '#F5C518',
          headerTitleStyle: { fontWeight: '800', fontSize: 18 },
          tabBarIcon: ({ focused }) => <TabIcon icon="♥" label="Favoris" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Contact"
        component={ContactScreen}
        options={{
          headerShown: true,
          headerTitle: 'Contact',
          headerStyle: { backgroundColor: '#1a2744' },
          headerTintColor: '#F5C518',
          headerTitleStyle: { fontWeight: '800', fontSize: 18 },
          tabBarIcon: ({ focused }) => <TabIcon icon="☎" label="Contact" focused={focused} />,
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
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    height: 70,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 12,
  },
  iconWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 6 },
  icon: { fontSize: 22, color: '#9CA3AF' },
  iconActive: { color: '#F5C518' },
  label: { fontSize: 10, color: '#9CA3AF', marginTop: 2, fontWeight: '600' },
  labelActive: { color: '#1a2744', fontWeight: '700' },
});
