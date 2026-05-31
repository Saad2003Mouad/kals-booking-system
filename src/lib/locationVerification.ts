import { calcDistance, haversineDistanceMiles, geocodeAddress } from "./maps";

export interface VerifiedLocation {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number | null;
  longitude: number | null;
  formattedAddress: string;
  placeId: string;
  locationVerificationMethod: string;
  locationVerifiedAt: string | null;
}

export async function verifyAndCalculateRoute(
  locationMode: string = "SINGLE_LOCATION",
  primaryLocation: any,
  bookingStops: any[] = []
): Promise<{ distanceMiles: number; primaryLoc: VerifiedLocation; verifiedStops: VerifiedLocation[] } | { error: string; message: string }> {
  
  if (!primaryLocation) {
    return { 
      error: "LOCATION_NOT_VERIFIED", 
      message: "Please verify the event location before continuing." 
    };
  }

  // 1. Resolve primary location coordinates
  let pLat = primaryLocation.latitude;
  let pLng = primaryLocation.longitude;
  let primaryLoc = { ...primaryLocation };

  if (pLat === undefined || pLng === undefined || pLat === null || pLng === null) {
    if (primaryLocation.street && primaryLocation.city) {
      const fullAddress = `${primaryLocation.street}, ${primaryLocation.city}, ${primaryLocation.state || "MA"} ${primaryLocation.zipCode || ""}`;
      const geo = await geocodeAddress(fullAddress);
      if (geo) {
        pLat = geo.lat;
        pLng = geo.lng;
        primaryLoc = {
          ...primaryLoc,
          latitude: geo.lat,
          longitude: geo.lng,
          formattedAddress: geo.displayName,
          locationVerificationMethod: "MANUAL_GEOCODED",
          locationVerifiedAt: new Date().toISOString()
        };
      }
    }
  }

  if (pLat === undefined || pLng === undefined || pLat === null || pLng === null) {
    return { 
      error: "LOCATION_NOT_VERIFIED", 
      message: "Please verify the event location before continuing." 
    };
  }

  // 2. Resolve coordinates for all stops
  const verifiedStops: VerifiedLocation[] = [];
  if (locationMode !== "SINGLE_LOCATION" && bookingStops && bookingStops.length > 0) {
    for (let stop of bookingStops) {
      let sLat = stop.latitude;
      let sLng = stop.longitude;
      let stopCopy = { ...stop };

      if (sLat === undefined || sLng === undefined || sLat === null || sLng === null) {
        if (stop.street && stop.city) {
          const fullAddress = `${stop.street}, ${stop.city}, ${stop.state || "MA"} ${stop.zipCode || ""}`;
          const geo = await geocodeAddress(fullAddress);
          if (geo) {
            sLat = geo.lat;
            sLng = geo.lng;
            stopCopy = {
              ...stopCopy,
              latitude: geo.lat,
              longitude: geo.lng,
              formattedAddress: geo.displayName,
              locationVerificationMethod: "MANUAL_GEOCODED",
              locationVerifiedAt: new Date().toISOString()
            };
          }
        }
      }

      if (sLat === undefined || sLng === undefined || sLat === null || sLng === null) {
        return { 
          error: "LOCATION_NOT_VERIFIED", 
          message: `Please verify Stop address: ${stop.street || "Unknown"} before continuing.` 
        };
      }
      verifiedStops.push(stopCopy);
    }
  }

  // 3. Compute mileage
  let totalDist = 0;
  const freeMiles = 10;
  const ratePerMile = 2.25;

  if (locationMode === "SINGLE_LOCATION") {
    totalDist = calcDistance(pLat, pLng, freeMiles, ratePerMile).drivingMiles;
  } else if (locationMode === "SEQUENTIAL_STOPS" || locationMode === "NEEDS_REVIEW") {
    totalDist = calcDistance(pLat, pLng, freeMiles, ratePerMile).drivingMiles;
    let lastLat = pLat;
    let lastLng = pLng;
    for (const stop of verifiedStops) {
      if (stop.latitude !== null && stop.longitude !== null) {
        const straight = haversineDistanceMiles(lastLat, lastLng, stop.latitude, stop.longitude);
        const driving = Math.round(straight * 1.35 * 10) / 10;
        totalDist += driving;
        lastLat = stop.latitude;
        lastLng = stop.longitude;
      }
    }
  } else if (locationMode === "SIMULTANEOUS_MULTI_VEHICLE") {
    totalDist = calcDistance(pLat, pLng, freeMiles, ratePerMile).drivingMiles;
    for (const stop of verifiedStops) {
      if (stop.latitude !== null && stop.longitude !== null) {
        totalDist += calcDistance(stop.latitude, stop.longitude, freeMiles, ratePerMile).drivingMiles;
      }
    }
  }

  return {
    distanceMiles: totalDist,
    primaryLoc,
    verifiedStops
  };
}
