import { useState, useCallback } from "react";

export interface GeolocationState {
  lat: number | null;
  lng: number | null;
  citySlug: string | null;
  loading: boolean;
  error: string | null;
}

// Bounding boxes for 5 supported Shopee Food cities
const CITY_BOUNDS: { slug: string; latMin: number; latMax: number; lngMin: number; lngMax: number }[] = [
  { slug: "ho-chi-minh", latMin: 10.5,  latMax: 11.2, lngMin: 106.4, lngMax: 107.1 },
  { slug: "ha-noi",      latMin: 20.7,  latMax: 21.4, lngMin: 105.6, lngMax: 106.1 },
  { slug: "da-nang",     latMin: 15.9,  latMax: 16.2, lngMin: 107.9, lngMax: 108.4 },
  { slug: "can-tho",     latMin: 9.8,   latMax: 10.3, lngMin: 105.5, lngMax: 106.0 },
  { slug: "hai-phong",   latMin: 20.7,  latMax: 21.0, lngMin: 106.5, lngMax: 107.0 },
];

export function detectCitySlug(lat: number, lng: number): string | null {
  const match = CITY_BOUNDS.find(
    c => lat >= c.latMin && lat <= c.latMax && lng >= c.lngMin && lng <= c.lngMax
  );
  return match?.slug ?? null;
}

const INITIAL: GeolocationState = { lat: null, lng: null, citySlug: null, loading: false, error: null };

export function useGeolocation() {
  const [location, setLocation] = useState<GeolocationState>(INITIAL);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({ ...prev, error: "Trình duyệt không hỗ trợ định vị" }));
      return;
    }
    setLocation(prev => ({ ...prev, loading: true, error: null }));
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setLocation({ lat, lng, citySlug: detectCitySlug(lat, lng), loading: false, error: null });
      },
      () => {
        setLocation(prev => ({ ...prev, loading: false, error: "Không lấy được vị trí" }));
      },
      { timeout: 8000 }
    );
  }, []);

  return { location, requestLocation };
}
