/**
 * Maps Service Layer — Phase 1: OpenStreetMap / Nominatim
 * Upgrade path: swap implementation to Google Maps API
 */

export const BASE_LOCATION = { lat: 42.411991, lng: -71.014689, label: "Boston Revere — 84 Fernwood Ave" };
const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";

const SUPPORTED_REGIONS = [
  "Abington", "Allston", "Andover", "Arlington", "Avon", "Barnstable", "Bedford", "Belmont", "Billerica", "Boston", "Braintree", "Brewster", "Bridgewater", "Brighton", "Brookline", "Burlington", "Cambridge", "Cape Cod", "Carver", "Charlestown", "Chatham", "Chelmsford", "Clinton", "Cohasset", "Concord", "Danvers", "Dedham", "Dennis", "Dorchester", "Dover", "Dracut", "Duxbury", "East Boston", "Erving", "Essex", "Everett", "Falmouth", "Foxborough", "Framingham", "Franklin", "Freetown", "Georgetown", "Gloucester", "Greater Boston area", "Groton", "Halifax", "Hamilton", "Hancock", "Hanover", "Hanson", "Harwich", "Haverhill", "Hingham", "Holbrook", "Holliston", "Hopkinton", "Hudson", "Hull", "Ipswich", "Jamaica Plain", "Kingston", "Lancaster", "Lawrence", "Leominster", "Lexington", "Lincoln", "Littleton", "Lowell", "Lynn", "Lynnfield", "Malden", "Manchester-by-the-Sea", "Mansfield", "Marblehead", "Marlborough", "Marshfield", "Mashpee", "Maynard", "Medford", "Melrose", "Merrimac", "Middleborough", "Milford", "Millis", "Milton", "Nahant", "Natick", "Needham", "Newbury", "Newburyport", "Newton", "Norfolk", "North Andover", "North Attleboro", "Northborough", "North Reading", "North Shore", "Norwell", "Norwood", "Peabody", "Pembroke", "Pepperell", "Plymouth", "Quincy", "Randolph", "Raynham", "Reading", "Revere", "Rockland", "Rockport", "Rowley", "Salem", "Salisbury", "Sandwich", "Saugus", "Scituate", "Sharon", "Sherborn", "Shirley", "Shrewsbury", "Somerville", "Southborough", "South Boston", "South End", "South Shore", "Stoneham", "Stoughton", "Sudbury", "Swampscott", "Taunton", "Tewksbury", "Topsfield", "Wakefield", "Waltham", "Watertown", "Wayland", "Wellesley", "Westfield", "Westford", "Weston", "West Roxbury", "Westwood", "Weymouth", "Wilmington", "Woburn", "Yarmouth"
];

export function isServiceableRegion(city: string): boolean {
  if (!city) return false;
  const normalized = city.toLowerCase().trim();
  return SUPPORTED_REGIONS.some(r => normalized.includes(r.toLowerCase()) || r.toLowerCase().includes(normalized));
}

export interface GeoResult {
  lat: number;
  lng: number;
  displayName: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface DistanceResult {
  straightMiles: number;
  drivingMiles: number;   // estimated: straight × 1.35
  billableMiles: number;  // max(0, drivingMiles - FREE_MILES)
  travelFee: number;
}

/** Geocode an address string → coordinates */
export async function geocodeAddress(address: string): Promise<GeoResult | null> {
  try {
    const params = new URLSearchParams({
      q: address + ", Massachusetts, USA",
      format: "json",
      addressdetails: "1",
      limit: "1",
      countrycodes: "us",
    });
    const res = await fetch(`${NOMINATIM_BASE}/search?${params}`, {
      headers: { "User-Agent": "BostonLegendIceCreamTruck/1.0" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.length) return null;
    const item = data[0];
    const addr = item.address ?? {};
    return {
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      displayName: item.display_name,
      city: addr.city ?? addr.town ?? addr.village ?? addr.suburb ?? "",
      state: addr.state ?? "",
      zip: addr.postcode ?? "",
      country: addr.country_code ?? "",
    };
  } catch { return null; }
}

/** Search suggestions for address autocomplete */
export async function searchAddresses(query: string): Promise<{ label: string; value: string; lat: number; lng: number; zip: string; city: string }[]> {
  if (query.length < 3) return [];
  try {
    const params = new URLSearchParams({
      q: query + ", Massachusetts, USA",
      format: "json",
      addressdetails: "1",
      limit: "5",
      countrycodes: "us",
    });
    const res = await fetch(`${NOMINATIM_BASE}/search?${params}`, {
      headers: { "User-Agent": "BostonLegendIceCreamTruck/1.0" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data as any[]).map(item => ({
      label: item.display_name,
      value: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      zip: item.address?.postcode ?? "",
      city: item.address?.city ?? item.address?.town ?? item.address?.suburb ?? "",
    })).filter(i => i.lat && i.lng);
  } catch { return []; }
}

/** Haversine distance in miles */
export function haversineDistanceMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

/** Calculate travel distance and fee from base to destination */
export function calcDistance(destLat: number, destLng: number, freeMiles = 10, ratePerMile = 2.25): DistanceResult {
  const straight = haversineDistanceMiles(BASE_LOCATION.lat, BASE_LOCATION.lng, destLat, destLng);
  const driving  = Math.round(straight * 135) / 100; // ×1.35 driving factor
  const billable = Math.max(0, driving - freeMiles);
  return {
    straightMiles: Math.round(straight * 10) / 10,
    drivingMiles:  Math.round(driving  * 10) / 10,
    billableMiles: Math.round(billable * 10) / 10,
    travelFee:     Math.round(billable * ratePerMile * 100) / 100,
  };
}

/** Reverse geocode coordinates → address */
export async function reverseGeocode(lat: number, lng: number): Promise<GeoResult | null> {
  try {
    const params = new URLSearchParams({ lat: String(lat), lon: String(lng), format: "json", addressdetails: "1" });
    const res = await fetch(`${NOMINATIM_BASE}/reverse?${params}`, {
      headers: { "User-Agent": "BostonLegendIceCreamTruck/1.0" },
    });
    if (!res.ok) return null;
    const item = await res.json();
    const addr = item.address ?? {};
    return {
      lat, lng,
      displayName: item.display_name,
      city: addr.city ?? addr.town ?? addr.village ?? addr.suburb ?? "",
      state: addr.state ?? "",
      zip: addr.postcode ?? "",
      country: addr.country_code ?? "",
    };
  } catch { return null; }
}
