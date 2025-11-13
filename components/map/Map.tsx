// Map.tsx
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as Location from "expo-location";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Image, Platform, Text, TouchableOpacity, View } from "react-native";
import MapView, {
  Callout,
  Marker,
  PROVIDER_DEFAULT
} from "react-native-maps";

import { tripToFeatureCollection } from "@/lib/map";
import { useTripStore } from "@/store/tripStore";

import { icons } from "@/constants";
import { useMapStore } from "@/store/mapStore";
import { usePathname, useRouter } from "expo-router";
import { CustomImage } from "../common/customImage";

type Props = {
  onFullMapPress?: (fc?: any) => void; // optional custom handler
};

const Map: React.FC<Props> = ({ onFullMapPress }) => {
  const selectedTrip = useTripStore((state) => state.selectedTrip);
  const itenaryData = selectedTrip;
  const router = useRouter();

  const [hasPermissions, setHasPermission] = useState(false);
  const [region, setRegion] = useState<any | null>(null);
  const mapRef = useRef<MapView | null>(null);
  const pathname = usePathname();

   const regionCoords = useMapStore((state) => state.regionCoords);
   

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setHasPermission(false);
        return;
      }

      setHasPermission(true);

      // const location = await Location.getCurrentPositionAsync({});

      
      const startRegion = {
        ...regionCoords
      };
      // mapRef?.current.animateToRegion(startRegion, 3000); 

      setRegion(startRegion);
    })();
  }, [regionCoords]);

  const markerIconConfig: Record<
    string,
    { icon: any; color?: string; size?: number }
  > = {
    activity: { icon: "map-marker", color: "#718ffcff", size: 32 },
    hotel: { icon:  icons.hotel },
    airport: { icon: icons.plane },
    cafe: { icon:  icons.cutlery },

    default: { icon:  <Image source={icons.point} className={`w-10 h-10 text-black `} /> },
  };

  const fc = useMemo(() => tripToFeatureCollection(itenaryData), [itenaryData]);
  
  
  const handleFullMapPress = () => {
    if (typeof onFullMapPress === "function") {
      onFullMapPress(fc);
    } else {
      if(pathname!=="/map-view"){
      router.push("/(root)/(trip)/map-view");
      }
    }
  };

  // if (!region) {
  //   return (
  //     <View className="h-72 w-full items-center justify-center">
  //       <Text>Loading map…</Text>
  //     </View>
  //   );
  // }


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

          const title =
            feature.properties?.name ??
            feature.properties?.tripTitle ??
            "Place";
          const day = feature.properties?.day;
          const desc = feature.properties?.description ?? "";
          const image =
            feature.properties?.image ?? feature.properties?.raw?.image ?? null;

          return (
            <Marker
              key={index}
              coordinate={{ latitude: lat, longitude: lng }}
              tracksViewChanges={false}
            >
              <View className="items-center">
               

                {type === "activity" && (
                  <View
                    className="mt-1 px-2 py-1 rounded-md"
                    style={{ backgroundColor: icon.color }}
                  >
                    <Text className="text-white text-[11px] font-extrabold">
                      Day {day}
                    </Text>
                  </View>
                )}
                 <Image source={icon.icon} className={`w-10 h-10 text-black `} />

                <Callout tooltip={Platform.OS !== "android"}>
                  <View className="w-56 p-2 rounded-lg bg-white shadow-lg">
                    <View className="flex-row justify-between items-center mb-2">
                      <Text
                        className="text-base font-bold flex-1 mr-2"
                        numberOfLines={1}
                      >
                        {title}
                      </Text>
                      {type === "activity" && day !== undefined && (
                        <Text className="text-sm text-gray-500">Day {day}</Text>
                      )}
                    </View>

                    {image ? (
                      <CustomImage
                        className="w-full h-24 rounded-md mb-2"
                        image={image}
                        name={title}
                      />
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
