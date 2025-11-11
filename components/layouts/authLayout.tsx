import React from "react";
import { Image, Text, View } from "react-native";

const AuthLayout = ({
  children,
  url,
  imageHeader,
  imageFooter,
}: {
  children: React.ReactNode;
  url: string;
  imageHeader?: string;
  imageFooter?: string;
}) => {
  return (
    <View className="flex-1 bg-white ">
      <View className="flex-1 h-full ">
        <View className=" h-[40%] relative">
          
          <Image
            className=" w-full h-full"
            source={{
              uri: url,
            }}
            resizeMode="cover"
          />
          {imageHeader && (
            <Text className="text-white font-bold text-[28px] absolute top-20 left-4 mb-2">
              {imageHeader}
            </Text>
          )}
          {imageFooter && (
            <Text className="text-white font-bold text-[20px] absolute bottom-4 left-4 mb-2">
              {imageFooter}
            </Text>
          )}
        </View>

        <View className="flex-1 h-full">{children}</View>
      </View>
    </View>
  );
};

export default AuthLayout;
