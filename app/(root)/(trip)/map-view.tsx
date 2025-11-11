import Map from "@/components/map/Map";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";

import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MapView=()=>{
    const router = useRouter();  
    return(
       <SafeAreaView className="flex-1">
        <View className="flex flex-row w-full justify-between  !px-6  pb-4 pt-2">
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
        >
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-center font-bold text-lg">Trip Map</Text>
        <TouchableOpacity onPress={() => {}}>
          <MaterialIcons name="share" size={24} color="black" />
        </TouchableOpacity>
      </View>
   <View></View>
      <Map/>
       </SafeAreaView>
    )
}
export default MapView