import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList, HomeTabParamList } from '../types';
import HomeScreen from '../screens/HomeScreen';
import ListingsScreen from '../screens/ListingsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ContactScreen from '../screens/ContactScreen';
import CarDetailScreen from '../screens/CarDetailScreen';
import { useTheme } from '../context/ThemeContext';
import { HomeIcon, CarIcon, HeartIcon, PhoneIcon } from '../components/Icons';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<HomeTabParamList>();

function TabIcon({
  name,
  focused,
  colors,
}: {
  name: string;
  focused: boolean;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  const iconColor = focused ? colors.text : colors.textMuted;
  const iconSize = 22;
  const strokeWidth = focused ? 2.2 : 1.8;

  const renderIcon = () => {
    switch (name) {
      case 'Home':
        return <HomeIcon size={iconSize} color={iconColor} strokeWidth={strokeWidth} />;
      case 'Listings':
        return <CarIcon size={iconSize} color={iconColor} strokeWidth={strokeWidth} />;
      case 'Favorites':
        return (
          <HeartIcon
            size={iconSize}
            color={focused ? '#EF4444' : colors.textMuted}
            strokeWidth={strokeWidth}
            filled={focused}
          />
        );
      case 'Contact':
        return <PhoneIcon size={iconSize} color={iconColor} strokeWidth={strokeWidth} />;
      default:
        return null;
    }
  };

  return (
    <View style={tabStyles.iconWrap}>
      {focused && (
        <View style={[tabStyles.activePill, { backgroundColor: '#F5C518' }]} />
      )}
      {renderIcon()}
    </View>
  );
}

function HomeTabs() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  // Shared header style for screens that use react-navigation header
  const HEADER_COMMON = {
    headerStyle: { backgroundColor: '#1a2744' },
    headerTintColor: '#F5C518',
    headerTitleStyle: { fontWeight: '800' as const, fontSize: 18, letterSpacing: 0.5 },
    headerShadowVisible: false,
  };

  // Tab bar height respects bottom safe area (transparent nav bar on Android)
  const tabBarHeight = 60 + insets.bottom;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: [
          tabStyles.bar,
          {
            backgroundColor: colors.tabBg,
            borderTopColor: colors.tabBorder,
            height: tabBarHeight,
            paddingBottom: insets.bottom || 6,
          },
        ],
      }}>

      {/* Home: has its own full hero — no react-nav header */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon name="Home" focused={focused} colors={colors} />
          ),
        }}
      />

      {/* Listings: uses react-nav header */}
      <Tab.Screen
        name="Listings"
        component={ListingsScreen}
        options={{
          headerShown: true,
          headerTitle: 'Notre Flotte',
          ...HEADER_COMMON,
          tabBarIcon: ({ focused }) => (
            <TabIcon name="Listings" focused={focused} colors={colors} />
          ),
        }}
      />

      {/* Favorites: uses react-nav header */}
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          headerShown: true,
          headerTitle: 'Mes Favoris',
          ...HEADER_COMMON,
          tabBarIcon: ({ focused }) => (
            <TabIcon name="Favorites" focused={focused} colors={colors} />
          ),
        }}
      />

      {/* Contact: has its own full hero — no react-nav header */}
      <Tab.Screen
        name="Contact"
        component={ContactScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon name="Contact" focused={focused} colors={colors} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { colors, isDark } = useTheme();

  const navTheme = isDark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: colors.bg,
          card: '#1a2744',
          text: colors.text,
          border: colors.border,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: colors.bg,
          card: '#1a2744',
          text: colors.text,
          border: colors.border,
        },
      };

  return (
    <NavigationContainer theme={navTheme}>
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
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
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
  },
});
