import React, { useMemo } from "react";
import { Text, View } from "react-native";

import { useTripStore } from "@/store/tripStore";
import CustomAccordion from "./accordion";
import NearbyHotels from "./hotels";


const Itenary = () => {
      const selectedTrip= useTripStore((state) => state.selectedTrip);
     const tripData= selectedTrip
     
 
  const dayWiseData= useMemo(()=>{
     
    let arr=[];
    tripData.itinerary.forEach((itnr)=>{
         let obj={};
         obj["title"]= `${itnr?.day}: ${itnr.title}`
         obj["content"]= itnr?.activities.map((each)=>({
            name:  each.name,
            image: each.image,
           description: each.description,
           duration: each.duration,
           price: each.price,
            tags: each.tags
         }))
         arr.push(obj);
    })
    return arr;

  },[tripData])
 

  return (
    <View className="flex-1  flex-col gap-4  ">
      <CustomAccordion data={dayWiseData}/>
      <View>
        <Text className="text-lg font-bold">How to Reach</Text>
        <View className="bg-white shadow shadow-gray p-2 rounded-md">
            <Text>{tripData.howToReach.description}</Text>

        </View>
      </View>
      
         
        <NearbyHotels data={tripData.nearbyHotels}/>
     
    </View>
  );
};


export default Itenary;
