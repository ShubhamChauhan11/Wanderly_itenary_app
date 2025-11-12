import { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface tabValue {
    title: string;
    value: string;
    content: any;
}
interface tabProps {
    tabs: tabValue[];
    active: tabValue["title"];
    containerStyle?: string;
    tabStyle?: string;
    onTabChange: (val: string) => void;
}

const CustomTab = ({ tabs, active, containerStyle, onTabChange }: tabProps) => {
    const ActiveTabContent= useMemo(()=>{
        return tabs.filter((ele)=>ele.value===active)[0].content

    },[active, tabs])
   
    return (
        <View className="flex flex-1 flex-col gap-4">
        <View className="flex flex-row justify-between gap-4">
            {tabs.map((tab) => {
                return (
                    <TouchableOpacity
                        onPress={() => {
                            onTabChange(tab.value);
                        }}
                        key={tab.title}
                        className={`${active === tab.value
                                ? " border-[#0286ff] bg-[#bdd7efff]  "
                                : "text-gray-500 bg-gray-200"
                            } py-2  items-center flex-1 rounded-lg  `}
                        style={{
                            backgroundColor: active === tab.value ? "#bdd7efff" : "#e3dedee0",

                        }}
                    >
                        <Text
                            className={`${active === tab.value ? "text-[#0286ff] font-bold" : "text-gray-500"} text-lg`}
                        >
                            {tab.title}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
        <View className="flex-1">
            <ActiveTabContent/>
        </View>
        
        </View>
    );
};
export default CustomTab;
