import { Vehicle, VipCar } from '../types';

const SUPABASE_URL = 'https://fbpjlgubovxporadbzvu.supabase.co';
const ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZicGpsZ3Vib3Z4cG9yYWRienZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNTYyMDUsImV4cCI6MjA4NDkzMjIwNX0.V5dHU9fTv9RCmgmYGXPno_7MxMjm0YSZQeL1ADuKtk0';

const headers = {
  apikey: ANON_KEY,
  Authorization: `Bearer ${ANON_KEY}`,
  'Content-Type': 'application/json',
};

// ─── In-memory cache (1 minute TTL) ────────────────────────────────────────
const CACHE_TTL = 60_000;
let vehicleCache: { data: Vehicle[]; ts: number } | null = null;
let vipCache: { data: VipCar[]; ts: number } | null = null;

export async function fetchVehicles(): Promise<Vehicle[]> {
  if (vehicleCache && Date.now() - vehicleCache.ts < CACHE_TTL) {
    return vehicleCache.data;
  }
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/vehicles?select=*&is_available=eq.true&order=is_popular.desc,id`,
    { headers },
  );
  if (!res.ok) throw new Error('Failed to fetch vehicles');
  const data: Vehicle[] = await res.json();
  vehicleCache = { data, ts: Date.now() };
  return data;
}

export async function fetchVipCars(): Promise<VipCar[]> {
  if (vipCache && Date.now() - vipCache.ts < CACHE_TTL) {
    return vipCache.data;
  }
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/vip_cars?select=*&is_active=eq.true&order=sort_order`,
    { headers },
  );
  if (!res.ok) throw new Error('Failed to fetch VIP cars');
  const data: VipCar[] = await res.json();
  vipCache = { data, ts: Date.now() };
  return data;
}
