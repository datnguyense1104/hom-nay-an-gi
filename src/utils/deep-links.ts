import { detectCitySlug } from "../hooks/use-geolocation";

// Build Shopee Food search URL for a dish keyword
export function buildShopeeFoodUrl(keyword: string, citySlug?: string | null): string {
  const encoded = encodeURIComponent(keyword);
  return citySlug
    ? `https://shopeefood.vn/${citySlug}/search?keyword=${encoded}`
    : `https://shopeefood.vn/search?keyword=${encoded}`;
}

// Build Google Maps search URL, optionally centered on user coordinates
export function buildGoogleMapsUrl(dishName: string, lat?: number | null, lng?: number | null): string {
  const query = encodeURIComponent(`${dishName} gần đây`);
  return lat != null && lng != null
    ? `https://www.google.com/maps/search/${query}/@${lat},${lng},14z`
    : `https://www.google.com/maps/search/${query}`;
}

// Resolve best city slug: geolocation → saved preference → null
export function resolveCitySlug(
  geoLat: number | null,
  geoLng: number | null,
  savedCity: string
): string | null {
  if (geoLat != null && geoLng != null) {
    const detected = detectCitySlug(geoLat, geoLng);
    if (detected) return detected;
  }
  return savedCity || null;
}
