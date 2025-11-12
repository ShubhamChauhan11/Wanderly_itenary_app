export const calculateRegion = ({
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude?: number | null;
  destinationLongitude?: number | null;
}) => {
  if (!userLatitude || !userLongitude) {
    return {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
  }

  if (!destinationLatitude || !destinationLongitude) {
    return {
      latitude: userLatitude,
      longitude: userLongitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
  }

  const minLat = Math.min(userLatitude, destinationLatitude);
  const maxLat = Math.max(userLatitude, destinationLatitude);
  const minLng = Math.min(userLongitude, destinationLongitude);
  const maxLng = Math.max(userLongitude, destinationLongitude);

  const paddingFactor = 100; // 🔥 zoom OUT (higher = more zoom-out)

  const latitudeDelta = Math.abs(maxLat - minLat) * paddingFactor || 0.05;
  const longitudeDelta = Math.abs(maxLng - minLng) * paddingFactor || 0.05;

  return {
    latitude: (userLatitude + destinationLatitude) / 2,
    longitude: (userLongitude + destinationLongitude) / 2,
    latitudeDelta,
    longitudeDelta,
  };
};

// GeoJSON types (minimal)
type GeoJSONPoint = { type: "Point"; coordinates: [number, number] } | null;
type GeoJSONFeature = {
  type: "Feature";
  geometry: GeoJSONPoint;
  properties: Record<string, any>;
};
type GeoJSONFeatureCollection = {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
};

export function tripToFeatureCollection(trip: any): GeoJSONFeatureCollection {
  const features: GeoJSONFeature[] = [];

  // Add activities as point features
  if (Array.isArray(trip.itinerary)) {
    trip.itinerary.forEach((dayBlock: any) => {
      const dayNum = dayBlock.day;
      const activities = Array.isArray(dayBlock.activities)
        ? dayBlock.activities
        : [];

      activities.forEach((act: any, idx: number) => {
        const coords =
          act?.coordinates &&
          act.coordinates.lat != null &&
          act.coordinates.lng != null
            ? ([act.coordinates.lng, act.coordinates.lat] as [number, number])
            : null;

        const geometry: GeoJSONPoint = coords
          ? { type: "Point", coordinates: coords }
          : null;

        const feature: GeoJSONFeature = {
          type: "Feature",
          geometry,
          properties: {
            featureType: "activity",
            tripId: trip.id,
            tripTitle: trip.title,
            day: dayNum,
            activityIndex: idx,
            name: act.name ?? null,
            description: act.description ?? null,
            duration: act.duration ?? null,
            price: act.price ?? null,
            tags: Array.isArray(act.tags) ? act.tags : [],
            image: act.image ?? null,
            nearbyCafesCount: Array.isArray(act.nearbyCafes)
              ? act.nearbyCafes.length
              : 0,
            nearbyHotelsCount: Array.isArray(act.nearbyHotels)
              ? act.nearbyHotels.length
              : 0,
            // keep original raw activity in case you want to access everything
            raw: act,
          },
        };

        features.push(feature);
      });
    });
  }

  // Optionally add nearbyHotels from top-level as separate features
  if (Array.isArray(trip.nearbyHotels)) {
    trip.nearbyHotels.forEach((h: any, idx: number) => {
      const coords =
        h?.coordinates && h.coordinates.lat != null && h.coordinates.lng != null
          ? ([h.coordinates.lng, h.coordinates.lat] as [number, number])
          : null;

      features.push({
        type: "Feature",
        geometry: coords ? { type: "Point", coordinates: coords } : null,
        properties: {
          featureType: "hotel",
          tripId: trip.id,
          name: h.name ?? null,
          rating: h.rating ?? null,
          priceCategory: h.priceCategory ?? null,
          reviews: h.reviews ?? null,
          hotelIndex: idx,
          raw: h,
        },
      });
    });
  }

  if (Array.isArray(trip.nearbyCafes)) {
    trip.nearbyCafes.forEach((h: any, idx: number) => {
      const coords =
        h?.coordinates && h.coordinates.lat != null && h.coordinates.lng != null
          ? ([h.coordinates.lng, h.coordinates.lat] as [number, number])
          : null;

      features.push({
        type: "Feature",
        geometry: coords ? { type: "Point", coordinates: coords } : null,
        properties: {
          featureType: "cafe",
          name: h.name ?? null,
          raw: h,
        },
      });
    });
  }

  // Optionally add nearestAirport as a feature
  if (trip.howToReach?.nearestAirport) {
    const a = trip.howToReach.nearestAirport;
    const coords =
      a?.coordinates && a.coordinates.lat != null && a.coordinates.lng != null
        ? ([a.coordinates.lng, a.coordinates.lat] as [number, number])
        : null;

    features.push({
      type: "Feature",
      geometry: coords ? { type: "Point", coordinates: coords } : null,
      properties: {
        featureType: "airport",
        tripId: trip.id,
        name: a.name ?? null,
        raw: a,
      },
    });
  }

  return {
    type: "FeatureCollection",
    features,
  };
}

export function getActivityFeatures(
  fc: GeoJSONFeatureCollection
): GeoJSONFeature[] {
  return fc.features.filter((f) => f.properties?.featureType === "activity");
}

export function filterActivitiesByDay(
  fc: GeoJSONFeatureCollection,
  day: number
): GeoJSONFeature[] {
  return getActivityFeatures(fc).filter(
    (f) => Number(f.properties?.day) === Number(day)
  );
}
export function computeRegionFromCoords(
  coords: { latitude: number; longitude: number }[],
  paddingFactor = 1.5 // 🔥 less padding = more zoom-in
): {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
} {
  if (!coords.length) {
    return {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
  }

  let minLat = coords[0].latitude;
  let maxLat = coords[0].latitude;
  let minLng = coords[0].longitude;
  let maxLng = coords[0].longitude;

  coords.forEach((c) => {
    minLat = Math.min(minLat, c.latitude);
    maxLat = Math.max(maxLat, c.latitude);
    minLng = Math.min(minLng, c.longitude);
    maxLng = Math.max(maxLng, c.longitude);
  });

  const latCenter = (minLat + maxLat) / 2;
  const lngCenter = (minLng + maxLng) / 2;

  // ✅ smaller deltas give higher zoom
  const latDelta = (maxLat - minLat) * paddingFactor || 0.02;
  const lngDelta = (maxLng - minLng) * paddingFactor || 0.02;

  return {
    latitude: latCenter,
    longitude: lngCenter,
    latitudeDelta: latDelta,
    longitudeDelta: lngDelta,
  };
}
