import CustomButton from "@/components/common/customButton";
import CustomInput from "@/components/common/customInput";
import Oauth from "@/components/oAuth";
import { icons } from "@/constants";
import { Link } from "expo-router";
import { useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUp = () => {
  const [initialFormValues, setFormValues] = useState({
    fullName:"",
    email: "",
    password: "",
    confirmPassword:""
  });
  const handleSignUp=()=>{
    console.log("values", initialFormValues)
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      
          <ScrollView contentContainerStyle={{ flexGrow: 1, }} keyboardShouldPersistTaps="handled">

        
              <SafeAreaView className="flex-1  px-4 flex flex-col gap-8 py-8">
                <Text className="font-bold text-xl">Create Your Account</Text>
                <View  className="w-full  flex flex-col gap-4 ">
                <CustomInput
                  label="Full Name"
                  value={initialFormValues.fullName}
                  LeftIcon={icons.email}
                  placeholder="Enter your full name"
                  onChangeText={(val: string) =>
                    setFormValues(prev => ({ ...prev, fullName: val }))
                  }
                />

                <CustomInput
                  label="Email"
                  value={initialFormValues.email}
                  LeftIcon={icons.lock}
                  secureTextEntry
                  placeholder="Enter your email"
                  onChangeText={(val: string) =>
                    setFormValues(prev => ({ ...prev, email: val }))
                  }
                />
                <CustomInput
                  label="Password"
                  value={initialFormValues.password}
                  LeftIcon={icons.lock}
                  secureTextEntry
                  placeholder="Enter your password"
                  onChangeText={(val: string) =>
                    setFormValues(prev => ({ ...prev, password: val }))
                  }
                />
                <CustomInput
                  label="Confirm Password"
                  value={initialFormValues.confirmPassword}
                  LeftIcon={icons.lock}
                  secureTextEntry
                  placeholder="Confirm your password"
                  onChangeText={(val: string) =>
                    setFormValues(prev => ({ ...prev, confirmPassword: val }))
                  }
                />
                 <CustomButton onPress={handleSignUp} title="Create Account" className="py-4 rounded-xl my-6"/>
                </View>
                <Oauth/>
                <View className="justify-center items-center">
                    <Text className="text-gray-500">Already have an account? 
                        <Link className="text-[#0286ff] font-bold" href={"/(auth)/sign-in"} >Log In</Link>
                    </Text>

                </View>
               
              </SafeAreaView>
              
           

          </ScrollView>
       
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
