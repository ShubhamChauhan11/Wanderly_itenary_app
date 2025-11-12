import { useTripStore } from "@/store/tripStore";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { CustomImage } from "../common/customImage";

const TripCard = ({
  image,
  name,
  days,
  destination,
  trip,
}: {
  image: string;
  name: string;
  days: number;
  destination: string;
  trip: {};
}) => {
  const router = useRouter();
  return (
    <View className="flex flex-row items-center gap-4 !h-[120px]  rounded-xl bg-white shadow-md">
      <CustomImage
        image={image}
        name={name.split(":")[0]}
        className="h-full w-[40%] rounded-l-xl"
      />
      <View className=" flex-1 flex flex-col gap-2 py-2 px-2 ">
        <Text
          className="text-lg font-semibold"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {name.toUpperCase()}
        </Text>

        <View className="flex flex-row gap-2">
          <Text className="text-gray-500 flex-1">
            Destination: {trip.region}
          </Text>
          <TouchableOpacity
            onPress={() => {
              useTripStore.getState().setSelectedTrip(trip);
              router.push("/(root)/(trip)/trip-details");
            }}
          >
            <MaterialIcons name="navigate-next" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <Text className="text-gray-500">Days: {days}</Text>
      </View>
    </View>
  );
};

export default TripCard;
