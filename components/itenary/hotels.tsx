import React from "react";
import { FlatList, Text, View } from "react-native";
import { CustomImage } from "../common/customImage";

const hotels = [
  {
    id: 1,
    name: "Victoria Jungfrau",
    rating: 4.9,
    reviews: "1.2k",
    priceLevel: "$$$",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
  },
  {
    id: 2,
    name: "Grandhotel Giessbach",
    rating: 4.7,
    reviews: "890",
    priceLevel: "$$",
    image: "https://images.unsplash.com/photo-1551776235-dde6d4829808?w=800",
  },
  {
    id: 2,
    name: "Grandhotel Giessbach",
    rating: 4.7,
    reviews: "890",
    priceLevel: "$$",
    image: "https://images.unsplash.com/photo-1551776235-dde6d4829808?w=800",
  },
  {
    id: 2,
    name: "Grandhotel Giessbach",
    rating: 4.7,
    reviews: "890",
    priceLevel: "$$",
    image: "https://images.unsplash.com/photo-1551776235-dde6d4829808?w=800",
  },
];

const NearbyHotels = ({ data }: { data: [] }) => {
  return (
    <View className="">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-bold text-gray-800">Nearby Hotels</Text>
        {/* <TouchableOpacity>
          <Text className="text-[#0286ff] font-semibold">See All</Text>
        </TouchableOpacity> */}
      </View>

      {/* Horizontal Cards */}
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View className="bg-white rounded-2xl  mr-3 w-52">
            <CustomImage
              image={item.image}
              name={item.name}
              className="w-full h-32 rounded-t-2xl"
            />
            <View className="p-3 relative">
              <Text className="font-semibold text-gray-900 text-base mb-1">
                {item.name}
              </Text>

              <View className="flex-row   justify-between ">
                <View className="flex-row flex-1">
                  <Text className="text-yellow-500">⭐</Text>
                  <Text className="text-gray-700 text-sm">
                    {item.rating}{" "}
                    <Text className="text-gray-400">({item.reviews})</Text>
                  </Text>
                </View>

                <View className="h-6 bg-yellow-300 px-2 rounded-md items-center justify-center">
                  <Text className="text-gray-500 text-xs font-bold text-black">
                    {item.priceCategory}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default NearbyHotels;
