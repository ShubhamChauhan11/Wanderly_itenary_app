import CustomButton from "@/components/common/customButton";
import CustomInput from "@/components/common/customInput";
import Oauth from "@/components/oAuth";
import { icons } from "@/constants";
import { fetchAPI } from "@/lib/fetch";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,

  Platform,
  ScrollView,

  Text,
  TouchableWithoutFeedback,
  View
} from "react-native";
import Modal from 'react-native-modal';
import { SafeAreaView } from "react-native-safe-area-context";

const SignUp = () => {
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName:"",
    email: "",
    password: "",
    confirmPassword: "",
  });

  //clerk
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [code, setCode] = useState("");
  const { isLoaded, signUp, setActive } = useSignUp();
  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });
  const handleSignUp = async () => {
    if (!isLoaded) return;

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress: formValues.email,
        password: formValues.password,
        firstName: formValues.firstName,
        lastName: formValues.lastName
        
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setVerification({
        ...verification,
        state: "pending",
      });
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
        Alert.alert(err?.errors[0]?.longMessage);
    //  console.error(JSON.stringify(err, null, 2));
      
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
      code: verification.code
      });
      

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
         await fetchAPI("/(api)/user", {
          method:"POST",
          body: JSON.stringify({
            firstName:formValues.firstName,
            lastName: formValues.lastName,
            email: formValues.email,
            clerkId: signUpAttempt.createdUserId
          })
        })
        setVerification({
          ...verification,
          state: "success",
        });

     
      } else {
        setVerification({
          ...verification,
          state: "failed",
          error: "Verification failed",
        });
      }
    } catch (err: any) {
      setVerification({
        ...verification,
        state: "failed",
        error: err.errors[0].longMessage,
      });
      Alert.alert(err?.errors[0]?.message);
    }
  };
 

  //clerk

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <SafeAreaView className="flex-1  px-4 flex flex-col gap-4 py-8">
            <Text className="font-bold text-xl">Create Your Account</Text>
            <View className="w-full  flex flex-col gap-4 ">
              <CustomInput
                label="First Name"
                value={formValues.firstName}
                LeftIcon={icons.email}
                secureTextEntry={false}
                placeholder="Enter your first name "
                onChangeText={(val: string) =>
                  setFormValues((prev) => ({ ...prev, firstName: val }))
                }
              />
              <CustomInput
                label="Last Name"
                value={formValues.lastName}
                LeftIcon={icons.email}
                secureTextEntry={false}
                placeholder="Enter your last name"
                onChangeText={(val: string) =>
                  setFormValues((prev) => ({ ...prev, lastName: val }))
                }
              />
              <CustomInput
                label="Email"
                value={formValues.email}
                LeftIcon={icons.email}
                secureTextEntry={false}
                placeholder="Enter your email"
                onChangeText={(val: string) =>
                  setFormValues((prev) => ({ ...prev, email: val }))
                }
              />
              <CustomInput
                label="Password"
                value={formValues.password}
                LeftIcon={icons.lock}
                secureTextEntry
                placeholder="Enter your password"
                onChangeText={(val: string) =>
                  setFormValues((prev) => ({ ...prev, password: val }))
                }
              />
              <CustomInput
                label="Confirm Password"
                value={formValues.confirmPassword}
                LeftIcon={icons.lock}
                secureTextEntry
                placeholder="Confirm your password"
                onChangeText={(val: string) =>
                  setFormValues((prev) => ({ ...prev, confirmPassword: val }))
                }
              />
              <CustomButton
                onPress={handleSignUp}
                title="Create Account"
                className="py-4 rounded-xl my-6"
              />
            </View>
            <Oauth />
            <View className="justify-center items-center">
              <Text className="text-gray-500">
                Already have an account?
                <Link
                  className="text-[#0286ff] font-bold"
                  href={"/(auth)/sign-in"}
                >
                  Log In
                </Link>
              </Text>
            </View>
            <Modal isVisible={showSuccessModal}>
              <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                <Image
                  source={icons.check}
                  className="w-[110px] h-[110px] mx-auto my-5"
                />
                <Text className="text-3xl font-bold text-center">Verify</Text>
                <Text className="text-base text-gray-400 text-center mt-2">
                  {" "}
                  You have successfully verified your account
                </Text>
                <CustomButton
                  className="mt-5 py-4"
                  title="Browse Home"
                  onPress={() => {
                    router.push("/(root)/(tabs)/home");
                    setShowSuccessModal(false);
                  }}
                />
              </View>
            </Modal>
            <Modal
              isVisible={verification.state === "pending"}
              onModalHide={() => {
                if (verification.state === "success") {
                  setShowSuccessModal(true);
                }
              }}
            >
              <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                <Text className="text-2xl font-bold mb-2">Verification</Text>
                <Text className="mb-5">
                  We've sent a verification code to {formValues.email}
                </Text>
                <CustomInput
                  className=" px-2"
                  placeholder="12345"
                  value={verification.code}
                  keyboardType="numeric"
                  onChangeText={(code) => {
                    setVerification({ ...verification, code: code });
                  }}
                />
                {verification.error && (
                  <Text className="text-red-500 text-sm mt-1">
                    {verification.error}
                  </Text>
                )}
                <CustomButton
                  title="Verify Email"
                  onPress={onVerifyPress}
                  className="mt-5 bg-success-500 py-4"
                />
              </View>
            </Modal>
          </SafeAreaView>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
