import { icons } from "@/constants";
import { useClerk, useUser } from "@clerk/clerk-expo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const { user, isSignedIn } = useUser();
  console.log("user", user);
  const profileDetails = {
    name: "Alexandar Smith",
    email: "alexandar@xyz.com",
  };

  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();

      router.replace("/(auth)/sign-in");
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };
  return (
    <SafeAreaView className="flex-1">
      <View className="flex flex-row justify-center items-center px-6 border-b-2 border-gray-300 pb-4 pt-2">
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
        >
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="w-full text-center font-bold text-lg">My Profile</Text>
      </View>
      <View className="flex flex-col p-4 items-center justify-between ">
        <View className="flex flex-col items-center">
          <View className="w-24 h-24 rounded-full bg-black justify-center items-center mb-2">
            <Image source={icons.profile} className={`w-18 h-18 text-black `} />
          </View>
          <Text className="text-lg font-bold">{user?.username}</Text>
          <Text className="text-md font-bold text-gray-500">
            {user?.primaryEmailAddress.emailAddress}
          </Text>
        </View>
      </View>
      <View className="px-4 flex-1 justify-end">
        <TouchableOpacity
          onPress={handleSignOut}
          className="w-full flex-row items-center justify-center gap-3 bg-gray-200 px-4 py-3 rounded-lg"
        >
          <MaterialIcons name="logout" size={24} color="red" />
          <Text className="text-[18px] text-red-500 font-bold">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default Profile;
