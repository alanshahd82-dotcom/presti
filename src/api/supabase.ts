import { Vehicle, VipCar } from '../types';

const SUPABASE_URL = 'https://fbpjlgubovxporadbzvu.supabase.co';
const ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZicGpsZ3Vib3Z4cG9yYWRienZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNTYyMDUsImV4cCI6MjA4NDkzMjIwNX0.V5dHU9fTv9RCmgmYGXPno_7MxMjm0YSZQeL1ADuKtk0';

const headers = {
  apikey: ANON_KEY,
  Authorization: `Bearer ${ANON_KEY}`,
  'Content-Type': 'application/json',
};

export async function fetchVehicles(): Promise<Vehicle[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/vehicles?select=*&is_available=eq.true&order=is_popular.desc,id`,
    { headers },
  );
  if (!res.ok) throw new Error('Failed to fetch vehicles');
  return res.json();
}

export async function fetchVipCars(): Promise<VipCar[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/vip_cars?select=*&is_active=eq.true&order=sort_order`,
    { headers },
  );
  if (!res.ok) throw new Error('Failed to fetch VIP cars');
  return res.json();
}
