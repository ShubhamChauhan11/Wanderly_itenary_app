import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from "expo-router";


const TabRootLayout=()=>{
    return (
        <Tabs>
            <Tabs.Screen name="home" options={{headerShown:false, title:"Plan Adventure", tabBarIcon: ({ color }) => <FontAwesome size={28} name="globe" color={color} />}}/>
            <Tabs.Screen name="my-trips"  options={{headerShown:false, title:"My Trips", tabBarIcon: ({ color }) => <FontAwesome size={28} name="list" color={color} />}}/>
            <Tabs.Screen name="profile"
              options={{headerShown:false, title:"Profile", tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />}}/>
        </Tabs>
    )

}
export default TabRootLayout