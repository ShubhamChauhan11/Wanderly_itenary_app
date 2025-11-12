import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";

const Index = () => {
  const { isSignedIn } = useAuth();
  console.log("issigned", isSignedIn)
  if (isSignedIn) {
    return <Redirect href={"/(root)/(tabs)/home"} />;
  } else {
    return <Redirect href="/(auth)/welcome" />;
  }
};
export default Index;
