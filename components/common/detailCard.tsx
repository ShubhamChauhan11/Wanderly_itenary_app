import { Text, View } from "react-native"

const DetailCard=({title, value}:{title:string, value:string |string[]})=>{
    return(
        <View className=" flex-1  bg-white shadow-sm shadow-gray rounded-lg px-2 py-2 ">
            <Text className="text-lg text-gray-500">{title}</Text>
            {Array.isArray(value)?
            <View className="flex flex-wrap">{value.map((val)=>(
                <Text className=" font-bold">{val}</Text>
            ))}
            </View>
            : <Text className=" font-bold">{value}</Text>
            }
            

        </View>
    )
}
export default DetailCard