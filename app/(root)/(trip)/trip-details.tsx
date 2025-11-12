import CustomCarousel from "@/components/common/carousel";
import CustomTab from "@/components/common/customTab";
import DetailCard from "@/components/common/detailCard";
import Itenary from "@/components/itenary/Itenary";
import Map from "@/components/map/Map";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "@/components/common/customButton";
import CustomInput from "@/components/common/customInput";
import { fetchAPI } from "@/lib/fetch";
import { exportTripAsPDF } from "@/lib/trip";
import { useTripStore } from "@/store/tripStore";
import { useUser } from "@clerk/clerk-expo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Modal from "react-native-modal";

const TripDetails = () => {
  const tabs = [
    {
      title: "Overview",
      value: "overview",
      content: Itenary,
    },
    {
      title: "Map",
      value: "map",
      content: Map,
    },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].value);
  const onTabChange = (val: string) => {
    setActiveTab(val);
  };

  const selectedTrip = useTripStore((state) => state.selectedTrip);
  const tripData = selectedTrip;
  const [showSaveModal, setShowSaveModal] = useState(false);
  return (
    <SafeAreaView className="flex-1 ">
      <View className="flex  flex-row w-full justify-between  !px-6  pb-4 pt-2">
        <TouchableOpacity
          onPress={() => {
            router.replace("/(root)/(tabs)/home");
          }}
        >
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex-1 items-center mx-2">
          <Text className="text-center font-bold text-lg ">
            {tripData.title}
          </Text>
        </View>
        <View className="flex flex-row gap-4 items-center ">
         <TouchableOpacity
                onPress={() => {
                  setShowSaveModal(true);
                }}
              >
                <FontAwesome name="save" size={22} color="green" />
              </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            exportTripAsPDF(tripData);
          }}
        >
          <MaterialIcons name="download" size={24} color="black" />
        </TouchableOpacity>
        </View>
      </View>

      <ScrollView className=" pb-10" keyboardShouldPersistTaps="handled">
        <View className="w-full h-60">
          <CustomCarousel
            data={tripData.heroImages}
            name={tripData.title.split(":")[0]}
          />
        </View>

        <View className="flex flex-col gap-4 px-4">
          <View className="flex  flex-col gap-[1px]">
            
              <Text className="text-[20px] font-bold ">
                {tripData.title}
              </Text>
             
           
            <Text className="text-[14px] font-bold flex-[0.8]">
                {tripData.region}
              </Text>
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
            <CustomTab
              tabs={tabs}
              active={activeTab}
              onTabChange={onTabChange}
              trip={TripDetails}
            />
          </View>
        </View>
        <SaveModal
          showModal={showSaveModal}
          onModalClose={() => {
            setShowSaveModal(false);
          }}
          trip={tripData}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
export default TripDetails;

function SaveModal({
  showModal,
  onModalClose,
  trip,
}: {
  showModal: boolean;
  onModalClose: () => void;
  trip?: {};
}) {
  const [tripName, setTripName] = useState(trip?.title);
  const { user, isSignedIn } = useUser();
  let tripDetails = structuredClone(trip);
  const saveTrip = useCallback(async () => {
    tripDetails["title"] = tripName;
    await fetchAPI("/(api)/trips", {
      method: "POST",
      body: JSON.stringify({
        trip: tripDetails,
        clerkId: user?.id,
      }),
    });
    useTripStore.getState().addTrip(tripDetails);
     useTripStore.getState().setSelectedTrip(tripDetails)
    onModalClose()
  }, [tripName]);
  return (
    <Modal isVisible={showModal} onBackdropPress={onModalClose}>
      <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px] flex flex-col items-center justify-center">
        <View className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
          <FontAwesome name="save" size={30} color="white" />
        </View>
        <CustomInput
          label="Name"
          className="px-2"
          value={tripName}
          secureTextEntry={false}
          placeholder={tripName}
          onChangeText={(val: string) => setTripName(val)}
        />

        <CustomButton
          className="mt-5 py-4 w-full"
          title="Save"
          onPress={saveTrip}
          disabled={!tripName}
        />
      </View>
    </Modal>
  );
}
