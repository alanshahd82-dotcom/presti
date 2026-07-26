export interface Vehicle {
  id: number;
  category_id: number;
  name: string;
  brand: string;
  model: string;
  transmission: string;
  fuel_type: string;
  seats: number;
  doors: number;
  luggage: number;
  image_url: string;
  gallery_images: string[] | null;
  is_available: boolean;
  base_price_daily: number;
  price_medium: number;
  price_long: number;
  is_popular: boolean;
  slug: string | null;
}

export interface VipCar {
  id: string;
  name: string;
  category: string;
  passengers: number;
  features: string[];
  main_image: string;
  price_high_season: number;
  price_low_season: number;
  is_active: boolean;
}

export interface Category {
  key: string;
  label: string;
  categoryId: number | null;
}

export type RootStackParamList = {
  HomeTabs: undefined;
  CarDetail: { vehicle: Vehicle };
};

export type HomeTabParamList = {
  Home: undefined;
  Listings: { categoryId?: number } | undefined;
  Favorites: undefined;
  Contact: undefined;
};
