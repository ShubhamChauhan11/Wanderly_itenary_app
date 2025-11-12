import React from "react";
import { ActivityIndicator, GestureResponderEvent, Text, TouchableOpacity } from "react-native";

type Props = {
  title: string;
  onPress?: (e: GestureResponderEvent) => void;
  bgVariant?: string;
  textVariant?: string;
  IconLeft?: React.ComponentType<any>;
  IconRight?: React.ComponentType<any>;
  className?: string;
  disabled?: boolean;
  loading?:boolean;
  // allow other TouchableOpacity props if needed
  [key: string]: any;
};

const CustomButton: React.FC<Props> = ({
  title,
  onPress,
  bgVariant = "default",
  textVariant = "default",
  IconLeft,
  IconRight,
  className = "",
  disabled = false,
  loading=false,
  ...props
}) => {
  const getBgVariantStyle = (variant: string) => {
    switch (variant) {
      case "secondary":
        return "bg-gray-500";
      case "danger":
        return "bg-red-500";
      case "success":
        return "bg-green-500";
      case "outline":
        return "bg-transparent border-neutral border-[0.5px]";
      default:
        return "bg-[#0286ff]";
    }
  };

  const getTextVariantStyle = (variant: string) => {
    switch (variant) {
      case "primary":
        return "text-black";
      case "secondary":
        return "text-gray-100";
      case "danger":
        return "text-red-100";
      case "success":
        return "text-green-100";
      default:
        return "text-white";
    }
  };

 
  const tailwindClass = `${getBgVariantStyle(bgVariant)} ${
    disabled ? "disabled:opacity-40" : "opacity-100"
  } rounded-md flex flex-row justify-center items-center ${className}`;

  // defensive onPress wrapper: ensure press doesn't fire when disabled
  const handlePress = (e: GestureResponderEvent) => {
    if (disabled || loading) return;
    onPress?.(e);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={handlePress}
      className={tailwindClass}
     
      style={disabled || loading ? { opacity: 0.5 } : undefined}
      {...props}
    >
      {IconLeft && <IconLeft style={{ marginRight: 8 }} />}
      <Text className={`text-lg font-bold ${getTextVariantStyle(textVariant)}`}>
        {title}
      </Text>
      {
        loading &&
          <ActivityIndicator className="ml-2" size="small" color="white" />
      }
      {IconRight && <IconRight style={{ marginLeft: 8 }} />}
    </TouchableOpacity>
  );
};

export default CustomButton;
