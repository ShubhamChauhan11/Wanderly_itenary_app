import { icons } from "@/constants"
import { Image, Text, View } from "react-native"
import CustomButton from "./common/customButton"
const continueWithOauth=()=>{}

const Oauth=({className}:{className?:string})=>{
    return(
        <View className={`flex flex-col gap-4 ${className}`}>
        <View className="flex flex-row gap-2 items-center justify-center">
          <View className="h-[1px] flex-1 bg-gray-300 "></View>
          <Text>or</Text>
          <View className="h-[1px] flex-1 bg-gray-300"></View>
        </View>
        <CustomButton
          title="Continue with Google"
          onPress={continueWithOauth}
          textVariant="primary"
          bgVariant="outline"
          className="py-4"
          IconLeft={() => (
            <Image
              source={icons.google}
              resizeMode="contain"
              className="w-5 h-5 mx-2"
            />
          )}
        />
        </View>

    )
}
export default Oauth