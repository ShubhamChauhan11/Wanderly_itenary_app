import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useRef } from "react";
import {
    Animated,
    Easing,
    I18nManager,
    PanResponder,
    Text,
    View
} from "react-native";

export default function SliderButton({
  label = "Slide to Delete Trip",
  onComplete = () => {},
  width = 320,
  height = 48,
  knobSize = 44,
  knobIconName = "chevron-right",
  knobIconColor = "white",
  backgroundColor = "#FDEDEE", // pale red
  knobColor = "#E53E3E", // red knob
  textColor = "#E53E3E",
  threshold = 0.75, // percent of track to trigger
  resetOnComplete = true, // animate back after completion
}) {
  // clamp width sanity
  const trackWidth = Math.max(width, knobSize + 40);
  const maxTranslate = trackWidth - knobSize - 8; // small padding

  const translateX = useRef(new Animated.Value(0)).current;
  const completedRef = useRef(false);

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        translateX.setOffset(translateX.__getValue() || 0);
        translateX.setValue(0);
      },

      onPanResponderMove: (e, gestureState) => {
        // gestureState.dx: positive to right (LTR)
        let dx = I18nManager.isRTL ? -gestureState.dx : gestureState.dx;
        const newX = Math.max(0, Math.min(maxTranslate, dx + (translateX._offset || 0)));
        translateX.setValue(newX - (translateX._offset || 0));
      },

      onPanResponderRelease: (e, gestureState) => {
        translateX.flattenOffset();
        const current = translateX.__getValue();
        const triggerAt = maxTranslate * threshold;

        if (current >= triggerAt && !completedRef.current) {
          // complete action
          completedRef.current = true;
          Animated.timing(translateX, {
            toValue: maxTranslate,
            duration: 150,
            useNativeDriver: false,
            easing: Easing.out(Easing.quad),
          }).start(() => {
            try {
              onComplete();
            } catch (err) {
              console.error(err);
            }

            if (resetOnComplete) {
              // small delay so user sees full slide
              setTimeout(() => {
                Animated.timing(translateX, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: false,
                }).start(() => {
                  completedRef.current = false;
                });
              }, 350);
            }
          });
        } else {
          // go back
          Animated.timing(translateX, {
            toValue: 0,
            duration: 250,
            useNativeDriver: false,
            easing: Easing.out(Easing.quad),
          }).start();
        }
      },
    })
  ).current;

  // knob style animated transform
  const knobStyle = {
    transform: [{ translateX }],
  };

  return (
    <View
      style={{
        width: trackWidth,
        height,
        borderRadius: height / 2,
        backgroundColor,
        justifyContent: "center",
        padding: 4,
      }}
    >
      {/* Label (center) */}
      <View
        pointerEvents="none" // allow dragging through label area
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: textColor,
            fontWeight: "600",
            fontSize: 16,
          }}
        >
          {label}
        </Text>
      </View>

      {/* Animated knob */}
      <Animated.View
        {...pan.panHandlers}
        style={[
          {
            width: knobSize,
            height: knobSize,
            borderRadius: knobSize / 2,
            backgroundColor: knobColor,
            justifyContent: "center",
            alignItems: "center",
            // start position padding-left
            left: 4,
            position: "absolute",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 3,
          },
          knobStyle,
        ]}
      >
        <MaterialIcons name={knobIconName} size={20} color={knobIconColor} />
      </Animated.View>
    </View>
  );
}
