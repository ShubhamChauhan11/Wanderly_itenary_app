// Map.tsx
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as Location from "expo-location";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import MapView, { Callout, LatLng, Marker, PROVIDER_DEFAULT } from "react-native-maps";

import { calculateRegion, tripToFeatureCollection } from "@/lib/map";
import { useTripStore } from "@/store/tripStore";

import { useRouter } from "expo-router";
import { CustomImage } from "../common/customImage";


type Props = {
  onFullMapPress?: (fc?: any) => void; // optional custom handler
};

const Map: React.FC<Props> = ({ onFullMapPress }) => {
  const trips = useTripStore((state) => state.trips);
  const itenaryData = trips[trips.length - 1];
  const router = useRouter();

  const [hasPermissions, setHasPermission] = useState(false);
  const [region, setRegion] = useState<any | null>(null);
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setHasPermission(false);
        return;
      }

      setHasPermission(true);

      // get current location but we won't use it for region in this example
      const location = await Location.getCurrentPositionAsync({});
      // Reverse geocode is optional; you already had it
      // const address = await Location.reverseGeocodeAsync({
      //   latitude: location.coords?.latitude!,
      //   longitude: location.coords?.longitude!,
      // });

      // Use calculateRegion as you already used (small delta for closer zoom)
      const startRegion = calculateRegion({
        userLatitude: itenaryData.coordinates.lat,
        userLongitude: itenaryData.coordinates.lng,
        destinationLatitude: itenaryData.coordinates.lat,
        destinationLongitude: itenaryData.coordinates.lng,
      });

      // If calculateRegion returns tiny deltas (due to zeros), tighten them for zoom
      const regionWithZoom = {
        ...startRegion,
        latitudeDelta: startRegion.latitudeDelta || 0.01,
        longitudeDelta: startRegion.longitudeDelta || 0.01,
      };

      setRegion(regionWithZoom);
    })();
  }, [itenaryData]);

  const markerIconConfig: Record<string, { icon: string; color: string; size: number }> = {
    activity: { icon: "map-marker", color: "#FF8A00", size: 32 },
    hotel: { icon: "hotel", color: "#1E90FF", size: 32 },
    airport: { icon: "airplane", color: "#00A86B", size: 32 },
    default: { icon: "hotel", color: "#555", size: 32 },
  };

  const fc = useMemo(() => tripToFeatureCollection(itenaryData), [itenaryData]);

  // helper to build LatLng[] from features for fitToCoordinates
  const featureLatLngs = useMemo(() => {
    return fc.features
      .map((f: any) => {
        const coords = f.geometry?.coordinates;
        if (!coords || coords.length < 2) return null;
        return { latitude: coords[1], longitude: coords[0] } as LatLng;
      })
      .filter(Boolean) as LatLng[];
  }, [fc]);

  // default handler for full-map button: fit to all coordinates
  const defaultFullMapHandler = () => {
    if (!mapRef.current || featureLatLngs.length === 0) return;

    try {
      mapRef.current.fitToCoordinates(featureLatLngs, {
        edgePadding: { top: 80, right: 80, bottom: 160, left: 80 },
        animated: true,
      });
    } catch (err) {
      // fallback: animate to center of first feature
      const first = featureLatLngs[0];
      if (first) {
        mapRef.current.animateToRegion(
          {
            latitude: first.latitude,
            longitude: first.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          500
        );
      }
    }
  };

  // pressed the floating full-map button
  const handleFullMapPress = () => {
    if (typeof onFullMapPress === "function") {
      onFullMapPress(fc);
    } else {
     router.push("/(root)/(trip)/map-view")
    }
  };

  if (!region) {
    return <View className="h-72 w-full items-center justify-center"><Text>Loading map…</Text></View>;
  }

  return (
    <View className="flex-1 h-[300px]">
      <MapView
        ref={(r) => (mapRef.current = r)}
        provider={PROVIDER_DEFAULT}
        style={{ width: "100%", height: "100%", borderRadius: 16 }}
        className="w-full h-full rounded-2xl"
        mapType="mutedStandard"
        showsPointsOfInterest={false}
        region={region}
        showsUserLocation={true}
        userInterfaceStyle="light"
      >
        {fc.features.map((feature: any, index: number) => {
          if (!feature?.geometry) return null;

          const [lng, lat] = feature.geometry.coordinates;
          const type = feature.properties.featureType;
          const icon = markerIconConfig[type] ?? markerIconConfig.default;

          const title = feature.properties?.name ?? feature.properties?.tripTitle ?? "Place";
          const day = feature.properties?.day;
          const desc = feature.properties?.description ?? "";
          const image = feature.properties?.image ?? feature.properties?.raw?.image ?? null;

          return (
            <Marker key={index} coordinate={{ latitude: lat, longitude: lng }} tracksViewChanges={false}>
              <View className="items-center">
                <MaterialCommunityIcons name={icon.icon} size={icon.size} color={icon.color} />

                {type === "activity" && (
                  <View className="mt-1 px-2 py-1 rounded-md" style={{ backgroundColor: icon.color }}>
                    <Text className="text-white text-[11px] font-extrabold">Day {day}</Text>
                  </View>
                )}

                <Callout tooltip={Platform.OS !== "android"}>
                  <View className="w-56 p-2 rounded-lg bg-white shadow-lg">
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="text-base font-bold flex-1 mr-2" numberOfLines={1}>
                        {title}
                      </Text>
                      {type === "activity" && day !== undefined && (
                        <Text className="text-sm text-gray-500">Day {day}</Text>
                      )}
                    </View>

                    {image ? (
                      <CustomImage className="w-full h-24 rounded-md mb-2" image={image} name={title} />
                    ) : null}

                    {desc ? (
                      <Text className="text-sm text-gray-700" numberOfLines={3}>
                        {desc}
                      </Text>
                    ) : null}
                  </View>
                </Callout>
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* Floating Full Map Button */}
      <TouchableOpacity
        onPress={handleFullMapPress}
        activeOpacity={0.8}
        className="absolute right-4 bottom-4 bg-white rounded-full p-3 shadow-lg"
        style={{ elevation: 6 }}
      >
        <MaterialCommunityIcons name="map-search" size={22} color="#111827" />
      </TouchableOpacity>
    </View>
  );
};

export default Map;
