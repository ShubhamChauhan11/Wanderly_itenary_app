import { icons } from "@/constants";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile=()=>{
    const profileDetails={
        name:"Alexandar Smith",
        email:"alexandar@xyz.com"
    }
    const handleLogout=()=>{
        router.replace("/(auth)/sign-in")
    }
    return(
        <SafeAreaView className="flex-1">
            <View className="flex flex-row justify-center items-center px-6 border-b-2 border-gray-300 pb-4 pt-2">
                    <TouchableOpacity onPress={()=>{
                        router.back()
                    }}>
                        <MaterialIcons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text className="w-full text-center font-bold text-lg">My Profile</Text>
                </View>
            <View className="flex flex-col p-4 items-center justify-between ">
                <View className="flex flex-col items-center">
                    <View className="w-24 h-24 rounded-full bg-black justify-center items-center mb-2">
                         <Image source={icons.profile} className={`w-18 h-18 text-black `}/>

                    </View>
                    <Text className="text-lg font-bold">
                        {profileDetails.name}
                    </Text>
                     <Text className="text-md font-bold text-gray-500">
                        {profileDetails.email}
                    </Text>

                </View>
               
                

            </View>
            <View className="px-4 flex-1 flex justify-end">
                 <TouchableOpacity onPress={handleLogout} className="flex flex-row gap-6 bg-gray-200 px-2 py-4 rounded-lg">
                    <MaterialIcons name="logout" size={24} color="red" />
                    <View className="flex flex-row gap-6 text-red">
                        <Text className="text-[20px] text-red-500">Logout</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}
export default Profile;