import { Image, Text, View } from "react-native";

const TripCard = ({
  image,
  name,
  days,
  destination
}: {
  image: string;
  name: string;
  days: number;
  destination: string;
}) => {
  return (
    <View className="flex flex-row items-center gap-4  rounded-xl bg-white shadow-md">
      <Image source={{ uri: image }} className="h-[100px] w-[40%] rounded-l-xl" resizeMode="cover" />
      <View className="flex flex-col gap-2">
        <Text className="text-lg font-semibold">{name.toUpperCase()}</Text>
        <Text className="text-gray-500">Destination: {destination}</Text>
        <Text className="text-gray-500">Days: {days}</Text>
      </View>
    </View>
  );
};

export default TripCard;
