import CustomCarousel from "@/components/common/carousel";
import CustomTab from "@/components/common/customTab";
import DetailCard from "@/components/common/detailCard";
import Itenary from "@/components/itenary/Itenary";
import Map from "@/components/map/Map";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTripStore } from "@/store/tripStore";

const TripDetails = () => {
  const tabs = [
    {
      title: "Overview",
      value: "overview",
      content:Itenary,
    },
    {
      title: "Map",
      value: "map",
      content: Map,
    },
  ];

  const [activeTab, setActiveTab]= useState(tabs[0].value)
  const onTabChange=(val:string)=>{
    setActiveTab(val)

  }
   const trips = useTripStore((state) => state.trips);
    const tripData= trips[trips.length-1]
  return (
    <SafeAreaView className="flex-1 ">

      <View className="flex flex-row w-full justify-between  !px-6  pb-4 pt-2">
        <TouchableOpacity
          onPress={() => {
            router.replace("/(root)/(tabs)/home");
          }}
        >
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-center font-bold text-lg">{tripData.title}</Text>
        <TouchableOpacity onPress={() => {}}>
          <MaterialIcons name="share" size={24} color="black" />
        </TouchableOpacity>
      </View>
       <ScrollView className=" pb-10" keyboardShouldPersistTaps="handled">
      <View className="w-full h-60">
        <CustomCarousel data={tripData.heroImages} name={tripData.title.split(":")[0]} />
      </View>
     
        <View className="flex flex-col gap-4 px-4">
          <View className="flex flex-col gap-[1px]">
            <Text className="text-[20px] font-bold ">{tripData.title}</Text>

            <Text className="text-gray-500 text-lg">{tripData.country}</Text>
            <Text className="text-md">{tripData.description}</Text>
          </View>
          <View className="flex flex-col gap-4">
            <View className="flex flex-row justify-between gap-4">
              <DetailCard title="Duration" value={tripData?.duration} />
              <DetailCard title="Cost" value={tripData?.cost} />
            </View>
            <View className="flex flex-row justify-between gap-4">
              <DetailCard title="Best Season" value={tripData?.bestSeason} />
              <DetailCard title="Category" value={tripData?.style} />
            </View>
          </View>
          <View>
            <CustomTab tabs={tabs} active={activeTab} onTabChange={onTabChange}/>
          </View>
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default TripDetails;
