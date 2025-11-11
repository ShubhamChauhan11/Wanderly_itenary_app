import CustomInput from "@/components/common/customInput";
import TripCard from "@/components/ui/tripCard";
import { useState } from "react";
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
  let trips = [
    {
        id:1,
      name: "paris trip",
      destination: "Paris",
      days: 7,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBmvxEMy0lVWZOxQBV_DnoHz-1xkuHiVE4NtGiGoI8TBAVAuM-eOUzoLgC-7ShnJlbRqXLFUquSMIfMROfC1_v_qenP-WsTmnv9EgCgYuHdBNidPfUhGIqvh5KswX8OXsjsDYBvBAGa26WSlznIScp0cK0duR5uT6NiDe5Us87wq_YJYp8Bc0LdkjyoGj2KVn6xDR5sPuPG_BQnLftYORwDixZK5BkZHIyi1x5x64q4WP4Ijags2_gHs6pV75JIO60j4mFJd6kNuOX3",
    },
    {
        id:2,
      name: "manali adventure",
      destination: "Manali",
      days: 3,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBmvxEMy0lVWZOxQBV_DnoHz-1xkuHiVE4NtGiGoI8TBAVAuM-eOUzoLgC-7ShnJlbRqXLFUquSMIfMROfC1_v_qenP-WsTmnv9EgCgYuHdBNidPfUhGIqvh5KswX8OXsjsDYBvBAGa26WSlznIScp0cK0duR5uT6NiDe5Us87wq_YJYp8Bc0LdkjyoGj2KVn6xDR5sPuPG_BQnLftYORwDixZK5BkZHIyi1x5x64q4WP4Ijags2_gHs6pV75JIO60j4mFJd6kNuOX3",
    },
    {
        id:3,
      name: "manali adventure",
      destination: "Manali",
      days: 3,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBmvxEMy0lVWZOxQBV_DnoHz-1xkuHiVE4NtGiGoI8TBAVAuM-eOUzoLgC-7ShnJlbRqXLFUquSMIfMROfC1_v_qenP-WsTmnv9EgCgYuHdBNidPfUhGIqvh5KswX8OXsjsDYBvBAGa26WSlznIScp0cK0duR5uT6NiDe5Us87wq_YJYp8Bc0LdkjyoGj2KVn6xDR5sPuPG_BQnLftYORwDixZK5BkZHIyi1x5x64q4WP4Ijags2_gHs6pV75JIO60j4mFJd6kNuOX3",
    },
    {
        id:4,
      name: "manali adventure",
      destination: "Manali",
      days: 3,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBmvxEMy0lVWZOxQBV_DnoHz-1xkuHiVE4NtGiGoI8TBAVAuM-eOUzoLgC-7ShnJlbRqXLFUquSMIfMROfC1_v_qenP-WsTmnv9EgCgYuHdBNidPfUhGIqvh5KswX8OXsjsDYBvBAGa26WSlznIScp0cK0duR5uT6NiDe5Us87wq_YJYp8Bc0LdkjyoGj2KVn6xDR5sPuPG_BQnLftYORwDixZK5BkZHIyi1x5x64q4WP4Ijags2_gHs6pV75JIO60j4mFJd6kNuOX3",
    },
    {
        id:5,
      name: "manali adventure",
      destination: "Manali",
      days: 3,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBmvxEMy0lVWZOxQBV_DnoHz-1xkuHiVE4NtGiGoI8TBAVAuM-eOUzoLgC-7ShnJlbRqXLFUquSMIfMROfC1_v_qenP-WsTmnv9EgCgYuHdBNidPfUhGIqvh5KswX8OXsjsDYBvBAGa26WSlznIScp0cK0duR5uT6NiDe5Us87wq_YJYp8Bc0LdkjyoGj2KVn6xDR5sPuPG_BQnLftYORwDixZK5BkZHIyi1x5x64q4WP4Ijags2_gHs6pV75JIO60j4mFJd6kNuOX3",
    },
    {
        id:6,
      name: "manali adventure",
      destination: "Manali",
      days: 3,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBmvxEMy0lVWZOxQBV_DnoHz-1xkuHiVE4NtGiGoI8TBAVAuM-eOUzoLgC-7ShnJlbRqXLFUquSMIfMROfC1_v_qenP-WsTmnv9EgCgYuHdBNidPfUhGIqvh5KswX8OXsjsDYBvBAGa26WSlznIScp0cK0duR5uT6NiDe5Us87wq_YJYp8Bc0LdkjyoGj2KVn6xDR5sPuPG_BQnLftYORwDixZK5BkZHIyi1x5x64q4WP4Ijags2_gHs6pV75JIO60j4mFJd6kNuOX3",
    },
    {
        id:7,
      name: "manali adventure",
      destination: "Manali",
      days: 3,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBmvxEMy0lVWZOxQBV_DnoHz-1xkuHiVE4NtGiGoI8TBAVAuM-eOUzoLgC-7ShnJlbRqXLFUquSMIfMROfC1_v_qenP-WsTmnv9EgCgYuHdBNidPfUhGIqvh5KswX8OXsjsDYBvBAGa26WSlznIScp0cK0duR5uT6NiDe5Us87wq_YJYp8Bc0LdkjyoGj2KVn6xDR5sPuPG_BQnLftYORwDixZK5BkZHIyi1x5x64q4WP4Ijags2_gHs6pV75JIO60j4mFJd6kNuOX3",
    },
    {
        id:8,
      name: "manali adventure",
      destination: "Manali",
      days: 3,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBmvxEMy0lVWZOxQBV_DnoHz-1xkuHiVE4NtGiGoI8TBAVAuM-eOUzoLgC-7ShnJlbRqXLFUquSMIfMROfC1_v_qenP-WsTmnv9EgCgYuHdBNidPfUhGIqvh5KswX8OXsjsDYBvBAGa26WSlznIScp0cK0duR5uT6NiDe5Us87wq_YJYp8Bc0LdkjyoGj2KVn6xDR5sPuPG_BQnLftYORwDixZK5BkZHIyi1x5x64q4WP4Ijags2_gHs6pV75JIO60j4mFJd6kNuOX3",
    },
  ];
  const [search, setSearch] = useState("");
  const [myTrips, setMyTrips] = useState([...trips]);
  const searchTrips = (val: string) => {
    if (!val) {
      setMyTrips([...trips]);
      return;
    }
    let filteredTrip = myTrips.filter(
      (trip) =>
        trip.name.toLowerCase().includes(val.toLowerCase()) ||
        trip.destination.toLowerCase().includes(val.toLowerCase())
    );
    setMyTrips(filteredTrip);
  };
  const clearSearch = () => {
    setSearch("");
    setMyTrips(trips);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          <SafeAreaView >
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
          <ScrollView className="px-4 pb-10" keyboardShouldPersistTaps="handled">
            <View className="flex flex-col gap-4">
              {myTrips.map((trip) => {
                return (
                  <TripCard
                     key={trip.id}
                    name={trip.name}
                    image={trip.image}
                    destination={trip.destination}
                    days={trip.days}
                  />
                );
              })}
            </View>
            
          </ScrollView>
        </>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
export default MyTrips;
