import CustomButton from "@/components/common/customButton";
import CustomInput from "@/components/common/customInput";
import CheckboxButton from "@/components/ui/checkBoxButton";
import Counter from "@/components/ui/counter";
import { fetchAPI } from "@/lib/fetch";
import { refreshTripImages } from "@/lib/image";
import { useMapStore } from "@/store/mapStore";
import { useUser } from "@clerk/clerk-expo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { GoogleGenAI } from "@google/genai";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTripStore } from "../../../store/tripStore";
const prompt = `You are a JSON generator. Produce a single JSON object and NOTHING ELSE (no text, no markdown, no comments).
The JSON must match exactly this schema and key names, using the same data types as in the example:
{
  "id": "string",
  "title": "string",
  "country": "string | null",
  "region": "string | null",
  "rating": number,
  "reviewsCount": number,
  "heroImages": ["string"],
  "coordinates": { "lat": number | null, "lng": number | null },
  "description": "string | null",
  "duration": "string",
  "cost": "string | null",
  "bestSeason": ["string"],
  "style": ["string"],
  "tabs": ["string"],
  "itinerary": [
    {
      "day": number,
      "title": "string",
      "activities": [
        {
          "name": "string",
          "image": "string | null",
          "description": "string | null",
          "duration": "string | null",
          "price": "string | null",
          "tags": ["string"],
          "coordinates": { "lat": number | null, "lng": number | null },
          "nearbyCafes": [ { "name": "string", "coordinates": { "lat": number | null, "lng": number | null } } ],
          "nearbyHotels": [ { "name": "string", "rating": number | null, "priceCategory": "string | null", "distance": "string | null", "coordinates": { "lat": number | null, "lng": number | null } } ]
        }
      ]
    }
  ],
  "howToReach": {
    "nearestAirport": { "name": "string | null", "coordinates": { "lat": number | null, "lng": number | null } },
    "description": "string | null"
  },
  "nearbyHotels": [
    { "name": "string", "image": "string | null", "rating": number | null, "reviews": "string | null", "priceCategory": "string | null", "coordinates": { "lat": number | null, "lng": number | null } }
  ],
  "nearbyCafes":[
  { "name": "string", "image": "string | null", "rating": number | null, "reviews": "string | null", "priceCategory": "string | null", "coordinates": { "lat": number | null, "lng": number | null } }

  ]
  "getInspired": [
    { "title": "string", "thumbnail": "string | null", "videoUrl": "string | null" }
  ]
}

Rules:
1. Output exactly the keys above. Do NOT omit any key. If a value is unknown, set it to null.
2. Use numbers for numeric fields (rating, reviewsCount, coordinates lat/lng, etc.). Use strings where shown.
3. Generate itinerary with exactly N day objects (N = number of days provided).
4. Keep text values concise (<= 40 words).
5. ID pattern: "trip_{slug}_{nnn}" if not provided.
6. If "categories" array is provided: Only include activities matching those categories. Allowed categories may include (examples): "history", "temples", "nature", "cafes".
   - For each activity, set the tags field to include the matched category.
7. If "categories" array is empty, generate itinerary normally without filtering.

Inputs:
- destination: "{DESTINATION}"
- days: {DAYS}
- currency: "{CURRENCY}"   // optional; if empty, pick a sensible local currency
- categories: {CATEGORIES} // array of strings

Generate the JSON now.`;

const categories = [
  {
    title: "Temple",
    icon: "temple-hindu",
  },
  {
    title: "Historical",
    icon: "home",
  },
  {
    title: "Nature",
    icon: "nature",
  },
  {
    title: "Cafes & Restaurants",
    icon: "local-cafe",
  },
  {
    title: "Shopping",
    icon: "shop",
  },
];

const Home = () => {
  const [chooseLocation, setChooseLocation] = useState(false);
  const { user, isSignedIn } = useUser();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [destination, setDestination] = useState(null);
  const setRegionCoords = useMapStore((state) => state.setRegionCoords);
  const ai = new GoogleGenAI({
    apiKey: `${process.env.EXPO_PUBLIC_GEN_AI_KEY}`,
  });
  const toggleSwitch = () => {
    setChooseLocation((prev) => !prev);
  };

  const [days, setDays] = useState(1);
  const [loading, setLoading] = useState(false);
  const incrementDays = () => {
    setDays((prev) => prev + 1);
  };
  const decrementDays = () => {
    setDays((prev) => (prev > 1 ? prev - 1 : 1));
  };
  const addToSelctedCategories = (val) => {
    if (selectedCategories.includes(val)) {
      let filtered = selectedCategories.filter((ele) => ele !== val);
      setSelectedCategories(filtered);
    } else {
      setSelectedCategories((prev) => [...prev, val]);
    }
  };
  useEffect(() => {
    let tripdata = getTripsData(user);
  }, [user]);
  async function getTripsData(user) {
    let data = await fetchAPI(`/(api)/get-trips?clerkId=${user.id}`, {
      method: "GET",
    });
   

    useTripStore.getState().addTrips(data.trips);

    return data;
  }

 const getSuggestion = async () => {
  try {
    setLoading(true);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
        .replace("{DESTINATION}", destination)
        .replace("{DAYS}", String(days))
        .replace("{CATEGORIES}", selectedCategories),
    });

    if (!response?.text) {
      throw new Error("Empty response received from AI model");
    }

    const cleanedRes = response.text
      .replace(/^```json/i, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .trim();

    const parsedTrip = JSON.parse(cleanedRes);

    const tripWithImages = await refreshTripImages(parsedTrip);

    useTripStore.getState().setSelectedTrip(tripWithImages);

    setRegionCoords({
      latitude: tripWithImages.coordinates.lat,
      longitude: tripWithImages.coordinates.lng,
      latitudeDelta: 1,
      longitudeDelta: 1,
    });

    router.push("/(root)/(trip)/trip-details");
  } catch (err) {
    console.log("Error:", err);

    Alert.alert(
      "Something went wrong",
      "Unable to generate trip details. Please try again.",
      [{ text: "OK" }]
    );
  } finally {
   
    setLoading(false);
  }
};

  const changeDestination = (value: string) => {
    return setDestination(value);
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView>
          <View className="h-screen w-full py-4 px-4 ">
            <View className="flex flex-col gap-4">
              <View className="flex  items-center">
                <Text className="font-bold text-xl">Plan Your Trip</Text>
              </View>
              {/* <View className="flex flex-row justify-between items-center"> */}
              <Text className="font-bold text-lg">Where to?</Text>
              {/* <View className="flex flex-row gap-2 items-center ">
              <Text className="text-gray-700">Suggest</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#0286ff" }}
                onValueChange={toggleSwitch}
                value={chooseLocation}
              />

              <Text className="text-gray-700">Choose</Text>
            </View> */}
              {/* </View> */}

              {/* {chooseLocation && ( */}
              <View className="flex flex-row justify-between items-center">
                <CustomInput
                  secureTextEntry={false}
                  value={destination}
                  placeholder="Search Destination"
                  onChangeText={changeDestination}
                  className="px-4 bg-gray-200 border-0"
                />
              </View>
              {/* )} */}

              <View className="flex flex-row justify-between items-center">
                <View className="flex flex-row gap-2 items-center">
                  <FontAwesome size={28} name="calendar" color={"gray"} />
                  <View>
                    <Text>Trip Duration</Text>
                    <Text className="text-gray-500">in days</Text>
                  </View>
                </View>
                <Counter
                  value={days}
                  onDecrement={decrementDays}
                  onIncrement={incrementDays}
                />
              </View>
              <View className="flex flex-col gap-2">
                <Text className="text-lg font-bold">
                  What are you interested in?
                </Text>
                <View className="flex flex-row gap-4 flex-wrap">
                  {categories.map((category) => {
                    return (
                      <CheckboxButton
                        title={category.title}
                        key={category.title}
                        icon={category.icon}
                        isSelected={selectedCategories.includes(category.title)}
                        onPress={addToSelctedCategories}
                      />
                    );
                  })}
                </View>
              </View>
              <CustomButton
                title="Get Suggestions"
                onPress={getSuggestion}
                disabled={!destination}
                loading={loading}
                className="py-4 rounded-full mt-6"
              />
            </View>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
// utils/parseTripText.js
export function parsePossiblyStringTrip(raw) {
  if (raw == null) return null;
  // Already an object
  if (typeof raw === "object") return raw;

  let s = String(raw).trim();

  // Remove fence blocks like ```json ... ```
  s = s
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  // Extract first JSON object substring if extra text exists
  const jsonMatch = s.match(/\{[\s\S]*\}/);
  if (jsonMatch) s = jsonMatch[0];

  try {
    return JSON.parse(s);
  } catch (err) {
    console.warn("parsePossiblyStringTrip: JSON.parse failed", err);
    return null;
  }
}

export default Home;
