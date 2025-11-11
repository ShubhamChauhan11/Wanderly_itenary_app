import * as React from "react";
import { Dimensions, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { CustomImage } from "./customImage";

const width = Dimensions.get("window").width;

function CustomCarousel({ data, name }: { data: string[]; name: string }) {
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <Carousel
        ref={ref}
        width={width}
        height={width / 2}
        data={data}
        onProgressChange={progress}
        renderItem={({ index }) => (
          <View
            style={{
              flex: 1,

              justifyContent: "center",
            }}
          >
            <CustomImage
              image={data[index]}
              name={name}
              className="w-full h-full"
            />
            {/* <Image source={{uri: data[index]}} className="w-full h-full"/> */}
          </View>
        )}
      />

      <Pagination.Basic
        progress={progress}
        data={data}
        dotStyle={{ backgroundColor: "gray", borderRadius: 40 }}
        containerStyle={{ gap: 8, position: "absolute", bottom: 25 }}
        onPress={onPressPagination}
        activeDotStyle={{ backgroundColor: "white" }}
      />
    </View>
  );
}

export default CustomCarousel;
