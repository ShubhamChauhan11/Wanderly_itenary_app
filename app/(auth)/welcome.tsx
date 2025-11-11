import CustomButton from "@/components/common/customButton";
import AuthLayout from "@/components/layouts/authLayout";
import Oauth from "@/components/oAuth";
import { router } from "expo-router";
import { View } from "react-native";

const Welcome = () => {
  const continueSignUp = () => {
    router.replace("/(auth)/sign-up");
  };
  const continueSignIn = () => {
    router.replace("/(auth)/sign-in");
  };
  return (
    <AuthLayout imageHeader="Wanderly" imageFooter="Your next adventure starts here" url="https://lh3.googleusercontent.com/aida-public/AB6AXuCTeeF7-stwaY2ni2a6qMcfgerfwm59BEjtoM7cTOjdqV_YQ7hpZzIk2mSEBJQmYGgPFeYBmfK5wQrVWfpQQlj-I_vnUIjq0FPMEEq0lHZCh0nabXdu24OLRrpn9EXE1QrAL4XAVTCKWlDC7EQ3B2NRoRSa-0ZvzMykDg_6A12HGDfQxYFuDnWkfysCa4zKO6i_u6il4O_cbo1mRpRLZ-LPruHMK9rUge5-rDNHx_u8h6JLeZaL6iE4aVztEuoMzTS7PaAWvH6lBjk8">
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
          className="py-4 "
        />
        <Oauth/>
      </View>
    </AuthLayout>
  );
};
export default Welcome;
