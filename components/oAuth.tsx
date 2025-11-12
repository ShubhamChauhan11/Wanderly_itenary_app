import { icons } from "@/constants";
import { useSSO } from "@clerk/clerk-expo";
import * as AuthSession from 'expo-auth-session';
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Image, Text, View } from "react-native";
import CustomButton from "./common/customButton";


const Oauth=({className}:{className?:string})=>{
  const { startSSOFlow } = useSSO()
  const router= useRouter()
  const continueWithOauth = useCallback(async () => {
    try {
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
        strategy: 'oauth_google',
        // For web, defaults to current path
        // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
        // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
        redirectUrl: AuthSession.makeRedirectUri(),
      })
      console.log("created", createdSessionId)

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive!({
          session: createdSessionId,
          // Check for session tasks and navigate to custom UI to help users resolve them
          // See https://clerk.com/docs/guides/development/custom-flows/overview#session-tasks
          navigate: async ({ session }) => {
           
              router.push('/(root)/(tabs)/home')
             
          },
        })
      } else {
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // See https://clerk.com/docs/guides/development/custom-flows/authentication/oauth-connections#handle-missing-requirements
      }
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }, [])
  
    return(
        <View className={`flex flex-col gap-4 ${className}`}>
        <View className="flex flex-row gap-2 items-center justify-center">
          <View className="h-[1px] flex-1 bg-gray-300 "></View>
          <Text>or</Text>
          <View className="h-[1px] flex-1 bg-gray-300"></View>
        </View>
        <CustomButton
          title="Continue with Google"
          onPress={continueWithOauth}
          textVariant="primary"
          bgVariant="outline"
          className="py-4"
          IconLeft={() => (
            <Image
              source={icons.google}
              resizeMode="contain"
              className="w-5 h-5 mx-2"
            />
          )}
        />
        </View>

    )
}
export default Oauth