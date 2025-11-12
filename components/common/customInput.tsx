import { icons } from "@/constants";
import React from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
interface inputProps {
  label?: string;
  LeftIcon?: React.ComponentType<any>;
  
 
  placeholder: string;
  value:string,
  className?:string,
  onClear?:()=>void,
  onChangeText: (name: string, value: string) => void;
   secureTextEntry: boolean
}

const CustomInput = ({
  label,
  placeholder,
  LeftIcon, 
  value,
  onChangeText,
  secureTextEntry,
  className,
  onClear,
  ...props
}: inputProps) => {
  return (
   
    <View className="w-full flex flex-col gap-2">
      {label && <Text className="font-bold">{label}</Text>}
      <View className={`flex flex-row gap-2 items-center h-14 border-[1px] border-gray-300 bg-white rounded-lg focus:border-primary-500 ${className}`}>
        {LeftIcon && <Image source={LeftIcon} className={`w-8 h-8 ml-4`} />}
        <TextInput
          placeholder={placeholder}
          value={value}
          secureTextEntry={secureTextEntry || false}
          placeholderTextColor="#888"
          onChangeText={onChangeText}
          className="flex-1 text-black"
          {...props}
        />
        {value && value.length>0 && onClear && 
        <TouchableOpacity onPress={onClear} className="w-8 h-8 rounded-full bg-gray-200 flex flex-row items-center justify-center">
        <Image source={icons.close} className={`w-4 h-4 `}/>
        </TouchableOpacity>
         }
      </View>
    </View>
    
  );
};
export default CustomInput;
