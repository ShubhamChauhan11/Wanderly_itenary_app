import CustomButton from "@/components/common/customButton";
import CustomInput from "@/components/common/customInput";
import AuthLayout from "@/components/layouts/authLayout";
import { icons } from "@/constants";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableWithoutFeedback, View } from "react-native";

const SignIn = () => {
    const [initialFormValues, setFormValues] = useState({
        email: "",
        password: "",
    });
    const handleLogin = () => {
        console.log("values", initialFormValues)
        router.replace("/(root)/(tabs)/home")
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1">
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">

                        <AuthLayout imageHeader="Wanderly" imageFooter="Welcome Back" url="https://lh3.googleusercontent.com/aida-public/AB6AXuCLdyMMg1Ob-bDcW8SAhViq29gM9Y-3JC41wgvqG8vcKGRruaa8KjSEW-5Sj913nUyuNCH7ceYctxGpEM8qw37BDues76YZM1XpFuq3f6gAZb65goC2N52lZ5UJtMmruTMzlzajv7X8jEGHwptZoQgr20r8kmK4fU-N7tn19kmx7PINa_KMSuqhqo0F8RKuPVdEnF01swqAENvJS0RVeheW3CFL636VY7_i5ela5l_n8q9xGM7M6s3raqMUM_LD-TpRsLwIEGEzQo4d">
                            <View className="w-full h-full  px-4 flex flex-col justify-between py-8">
                                <View className="w-full  flex flex-col gap-8 ">
                                    <CustomInput
                                        label="Email Address"
                                        LeftIcon={icons.email}
                                        placeholder="you@example.com"
                                        onChangeText={(val: string) =>
                                            setFormValues(prev => ({ ...prev, email: val }))
                                        }
                                    />

                                    <CustomInput
                                        label="Password"
                                        LeftIcon={icons.lock}
                                        secureTextEntry
                                        placeholder="Enter your password"
                                        onChangeText={(val: string) =>
                                            setFormValues(prev => ({ ...prev, password: val }))
                                        }
                                    />
                                </View>
                                <View className="flex flex-col mb-2">
                                    <CustomButton onPress={handleLogin} title="Login" className="py-4 rounded-xl my-6" />
                                    <View className="flex-1 w-[full] justify-center items-center">
                                        <Text className="text-gray-500">Don't have an account?
                                            <Link className="text-[#0286ff] font-bold" href={"/(auth)/sign-up"} >Sign up</Link>
                                        </Text>

                                    </View>
                                </View>
                            </View>

                        </AuthLayout>

                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default SignIn;
