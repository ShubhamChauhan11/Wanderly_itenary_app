import { fetchImages } from "@/lib/image";
import { useMapStore } from "@/store/mapStore";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Fontisto from "@expo/vector-icons/Fontisto";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";


const FallbackImage = ({ query }: { query: string }) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        // const response = await fetch(
        //   `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        //     query
        //   )}&client_id=WvK7tGaW1TJBwFL3P1kXF-tKdSkCthMzgQvCj6LgCoI`
        // );
        // const data = await response.json();
        // if (data.results.length > 0) {
        //   setUrl(data.results[0].urls.small);
        // }
        let urls= await fetchImages({ query: query, n: 1 });
        console.log("urls", urls)
        if(urls.length){
        setUrl(urls[0])
        }
      } catch (err) {
        console.error("Image fetch failed", err);
      }
    };

    fetchImage();
  }, [query]);
  console.log("url", url)

  return url ? (
    <Image
      source={{ uri: url }}
      className="w-24 h-24 rounded-md bg-gray-100"
      resizeMode="cover"
    />
  ) : (
    <View className="w-24 h-24 rounded-md bg-gray-200 items-center justify-center">
      <Text className="text-gray-600 text-xs">No Image</Text>
    </View>
  );
};
interface ItemInterface {
  name: string;
  image: string;
  description: string;
  duration: string;
  price: string | number;
  tags: string[];
}

const ItenaryItem = ({
  name,
  image,
  description,
  duration,
  price,
  ...props
}: ItemInterface) => {
   
  const [imageError, setImageError] = useState(false);
  const setRegionCoords= useMapStore((state)=>state.setRegionCoords)

  const shouldShowFallback = !image || imageError;
  const router=useRouter()
  function showMap(){
     setRegionCoords({
                latitude: props?.coordinates.lat,
                longitude: props?.coordinates.lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              });
    router.push("/(root)/(trip)/map-view")

  }

  return (
    <View className="flex flex-col gap-3 bg-white rounded-lg border border-gray-200 p-3">
      {/* Image and content row */}
      <View className="flex-row gap-4 items-start">
        {shouldShowFallback ? (
  <FallbackImage query={name} />
) : (
  <Image
    source={{ uri: image }}
    className="w-24 h-24 rounded-md bg-gray-100"
    onError={() => setImageError(true)}
  />
)}

        <View className="flex-1 flex-col gap-1">
          <Text className="font-bold text-[16px] text-black">{name}</Text>
          <Text className="text-gray-600 text-[13px]" numberOfLines={3}>
            {description}
          </Text>

          {/* Duration and Price Row */}
          <View className="flex-row !justify-between mt-2 gap-2 ">
            <View className="flex-row items-start gap-1">
              <Fontisto name="clock" size={13} color="#6B7280" />
              <Text className="text-gray-500 text-[13px]">{duration}</Text>
            </View>
            <View className="flex-row items-start gap-1 flex-1 ">
              <FontAwesome name="money" size={13} color="#6B7280" />
              <Text className="text-gray-500 text-[13px]">{price}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Button */}
      <TouchableOpacity className="w-full flex-row items-center justify-center gap-2 py-2 rounded-md bg-[#E3F2FD] mt-1 " onPress={showMap}>
        <FontAwesome6 name="map" size={16} color="#0286ff" />
        <Text className="text-[#0286ff] font-bold text-[14px]" >
          See on Map
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ItenaryItem;
