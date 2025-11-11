import { Stack } from "expo-router"

const RootLayout=()=>{
    return (
        <Stack>
            
              <Stack.Screen name="trip-details" options={{headerShown:false}}/>
               <Stack.Screen name="map-view" options={{headerShown:false}}/>
        </Stack>

    )
}
export default RootLayout