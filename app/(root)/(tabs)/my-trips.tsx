import CustomInput from "@/components/common/customInput";
import TripCard from "@/components/ui/tripCard";
import { useTripStore } from "@/store/tripStore";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MyTrips = () => {
  const [search, setSearch] = useState("");
  const trips = useTripStore((state) => state.trips);

  const [myTrips, setMyTrips] = useState([]);

  useEffect(() => {
    setMyTrips(trips);
  }, [trips]);

  const searchTrips = (val: string) => {
    if (!val) {
      setMyTrips([...trips]);
      return;
    }
    let filteredTrip = myTrips.filter(
      (trip) =>
        trip.title.toLowerCase().includes(val.toLowerCase()) ||
        trip.id.toLowerCase().includes(val.toLowerCase())
    );
    setMyTrips(filteredTrip);
  };
  const clearSearch = () => {
    setSearch("");
    setMyTrips(trips);
  };
  const router = useRouter();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <SafeAreaView>
            <View className="px-4 pt-4 flex-flex-col gap-4">
              <View>
                <Text className="flex text-xl font-bold">My Trips</Text>
              </View>
              <View>
                <CustomInput
                  secureTextEntry={false}
                  value={search}
                  placeholder="Search for trip by name or location"
                  onChangeText={(val) => {
                    setSearch(val);
                    searchTrips(val);
                  }}
                  onClear={clearSearch}
                  className="px-4  border-0"
                />
              </View>
            </View>
          </SafeAreaView>
          <ScrollView
            className="px-4 pb-10"
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex flex-col gap-4">
              {myTrips.map((trip) => {
                return (
                  <TripCard
                     key={trip.title}
                    name={trip.title}
                    image={trip.heroImages[0]}
                    destination={trip.region}
                    days={trip.duration}
                    trip={trip}
                  />
                 
                );
              })}
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
export default MyTrips;
