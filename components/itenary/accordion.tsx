import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import { Text, View } from "react-native";
import Accordion from "react-native-collapsible/Accordion";
import ItenaryItem from "./itenaryItem";

const CustomAccordion=(
    {data}:{data:[]}
)=>{
     const [activeSections, setActiveSections] = useState<number[]>([0]);
    const renderHeader = (section: any, _: any, isActive: boolean) => (
    <View
      className={`px-4 !py-3 rounded-lg bg-white flex flex-row justify-between`}
    >
      <Text
        className={`text-lg font-bold w-[80%] `}
      >
        {section.title}
      </Text>
      <View className="w-[10%] items-center justify-center">
        {isActive ?
      <MaterialIcons name="arrow-drop-up" size={24} color="black" />:
      <MaterialIcons name="arrow-drop-down" size={24} color="black" />}
      </View>

    </View>
  );

  const renderContent = (section: any) => {
   
    return (
    <View className="p-4 bg-white rounded-b-lg flex flex-col gap-4  ">
       {section.content.map((item)=>{
        return (
            <ItenaryItem key={item.name} {...item}/>
        )
       })}
    </View>
  )};

  const updateSections = (active: number[]) => {
    setActiveSections(active);
  };
  console.log("active", activeSections)
 
    return (
        <View className="  flex-col gap-4 ">
              {data.map((section, index) => (
                <View key={section.title} > 
                  <Accordion
                    sections={[section]}
                    activeSections={
                      activeSections.includes(index) ? [0] : [] 
                    }
                    renderHeader={renderHeader}
                    renderContent={renderContent}
                    onChange={() =>
                      setActiveSections(
                        activeSections.includes(index)
                          ? activeSections.filter((i) => i !== index)
                          : [...activeSections, index]
                      )
                    }
                    
                    underlayColor="transparent"
                  />
                </View>
              ))}
            </View>
    )

}
export default CustomAccordion;