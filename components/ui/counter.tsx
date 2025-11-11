import { Text, TouchableOpacity, View } from "react-native"

const Counter=({
    value,
    onIncrement,
    onDecrement,
}:{
    value:number,
    onIncrement:()=>void,
    onDecrement:()=>void
})=>{
    return(
        <View className="flex flex-row gap-2 items-center">
            <TouchableOpacity onPress={onDecrement} className="bg-gray-300 h-10 w-10 rounded-full flex items-center justify-center">
                <Text >-</Text>
            </TouchableOpacity>
            <Text>{value}</Text>
               <TouchableOpacity onPress={onIncrement} className="bg-gray-300 h-10 w-10 rounded-full flex items-center justify-center">
                <Text>+</Text>
            </TouchableOpacity>

        </View>

    )
}
export default Counter