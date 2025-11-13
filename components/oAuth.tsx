import { icons } from "@/constants";
import { useSSO } from "@clerk/clerk-expo";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Alert, Image, Linking, Text, View } from "react-native";
import CustomButton from "./common/customButton";

const Oauth = ({ className }: { className?: string }) => {
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  function extractQueryParam(url: string | null | undefined, key: string) {
    if (!url) return null;
    // url may be like "exp://host?created_session_id=...&rotating_token_nonce=..."
    const q = url.split("?")[1];
    if (!q) return null;
    try {
      const params = new URLSearchParams(q);
      return params.get(key);
    } catch (e) {
      // Fallback for very odd input
      const pairs = q.split("&");
      for (const p of pairs) {
        const [k, v] = p.split("=");
        if (k === key) return decodeURIComponent(v ?? "");
      }
      return null;
    }
  }
  const continueWithOauth = useCallback(async () => {
    try {
      // useProxy true works well in Expo dev; tweak for prod with custom scheme
      const redirectUrl = AuthSession.makeRedirectUri({ useProxy: true });
      console.log("Using redirectUrl:", redirectUrl);

      const result = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl,
      });

      console.log("startSSOFlow raw result:", result);

      // 1) prefer createdSessionId if present
      let createdSessionId = result?.createdSessionId ?? null;

      // 2) fallback: parse authSessionResult.url for created_session_id
      if (!createdSessionId && result?.authSessionResult?.url) {
        createdSessionId = extractQueryParam(result.authSessionResult.url, "created_session_id");
        if (createdSessionId) {
          console.log("Found created_session_id in authSessionResult.url:", createdSessionId);
        }
      }

      // 3) if still not found, check for deep-link fallback URL via Linking.getInitialURL() (edge cases)
      if (!createdSessionId) {
        try {
          const initial = await Linking.getInitialURL();
          if (initial) {
            const maybe = extractQueryParam(initial, "created_session_id");
            if (maybe) {
              createdSessionId = maybe;
              console.log("Found created_session_id via Linking.getInitialURL():", createdSessionId);
            }
          }
        } catch (e) {
          // ignore
        }
      }

      // 4) set active session if we have an id
      if (createdSessionId && result?.setActive) {
        await result.setActive({
          session: createdSessionId,
          navigate: async () => {
            router.push("/(root)/(tabs)/home");
          },
        });
        return;
      }

      // If no id, surface helpful debugging info
      console.warn("No createdSessionId returned. Full startSSOFlow result:", result);
      Alert.alert(
        "Sign-in incomplete",
        "Sign-in did not produce a session automatically. Check logs for `startSSOFlow` result. If you see a `signIn` or `signUp` object, follow Clerk docs to continue the flow.",
        [{ text: "OK" }]
      );
    } catch (err) {
      console.error("SSO error:", err);
      Alert.alert("Authentication error", "Unable to complete sign-in. Try again.");
    }
  }, [startSSOFlow, router]);

  return (
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
  );
};
export default Oauth;
