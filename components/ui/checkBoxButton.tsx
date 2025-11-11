import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, TouchableOpacity } from "react-native";

const CheckboxButton=({title, isSelected,icon, onPress}:{title:string, isSelected:boolean, icon:string, onPress:(val:string)=>void})=>{
    return (
        <TouchableOpacity onPress={()=>{
            onPress(title)
        }} className={`${isSelected? `bg-[#0286ff]`: `bg-gray-300`} flex flex-row gap-2  px-4 py-2 rounded-full items-center self-start`}>
          
                {!isSelected && <MaterialIcons name={icon} size={18} color="black" />}
                {isSelected &&   <MaterialIcons size={18} name="check" color={'white'} /> }
                <Text className={`text-lg ${isSelected? 'text-white': 'text-black'}`}>{title}</Text>


            
        </TouchableOpacity>

    )
}
export default CheckboxButton;