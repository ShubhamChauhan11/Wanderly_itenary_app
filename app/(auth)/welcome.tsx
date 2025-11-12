import CustomButton from "@/components/common/customButton";
import { router } from "expo-router";
import { Image, Text, View } from "react-native";

const Welcome = () => {
  const continueSignUp = () => {
    router.replace("/(auth)/sign-up");
  };
  const continueSignIn = () => {
    router.replace("/(auth)/sign-in");
  };
  return (
    <View className="flex-1 h-full bg-white">
     
        {/* HERO */}
        <View className="flex-[0.6] relative">
          <Image
            className="w-full h-full"
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTeeF7-stwaY2ni2a6qMcfgerfwm59BEjtoM7cTOjdqV_YQ7hpZzIk2mSEBJQmYGgPFeYBmfK5wQrVWfpQQlj-I_vnUIjq0FPMEEq0lHZCh0nabXdu24OLRrpn9EXE1QrAL4XAVTCKWlDC7EQ3B2NRoRSa-0ZvzMykDg_6A12HGDfQxYFuDnWkfysCa4zKO6i_u6il4O_cbo1mRpRLZ-LPruHMK9rUge5-rDNHx_u8h6JLeZaL6iE4aVztEuoMzTS7PaAWvH6lBjk8",
            }}
            resizeMode="cover"
          />

          {/* App name */}
          <Text className="text-white font-bold text-[28px] absolute top-20 left-4">
            Wanderly
          </Text>

        
          <View className="absolute bottom-4 left-4 mb-2 w-[85%]">
            <Text className="text-white font-bold text-[24px]">
              Your next adventure starts here.
            </Text>

            <Text
              className="text-white text-[16px] mt-2 italic"
            
              ellipsizeMode="tail"
            >
              Plan your trip with us, get personalized itineraries,  and explore
              with our interactive map view.
            </Text>
          </View>
        </View>

        {/* ACTIONS */}
        <View className="flex-[0.4]">
          <View className="w-full h-full px-4 flex flex-col gap-8 py-8">
            <CustomButton
              title="Sign up with Email"
              onPress={continueSignUp}
              className="py-4"
            />
            <CustomButton
              title="Log in with Email"
              onPress={continueSignIn}
              textVariant="primary"
              bgVariant="outline"
              className="py-4"
            />
            {/* <Oauth/> */}
          </View>
        </View>
      </View>
   
  );
};
export default Welcome;
