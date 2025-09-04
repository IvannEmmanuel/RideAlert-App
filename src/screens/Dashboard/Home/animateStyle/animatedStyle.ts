import { Animated, Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");

// This is a function, not a hook. You pass your animation value into it.
export const getAnimatedStyle = (animation: Animated.Value) => ({
  width: animation.interpolate({
    inputRange: [0, 1],
    outputRange: [60, width],
  }),
  height: animation.interpolate({
    inputRange: [0, 1],
    outputRange: [60, 210],
  }),
  borderTopLeftRadius: animation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 48],
  }),
  borderTopRightRadius: animation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 48],
  }),
  borderBottomLeftRadius: animation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  }),
  borderBottomRightRadius: animation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  }),
  backgroundColor: animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#223392d4", "#F7F6FB"],
  }),
  bottom: animation.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 0],
  }),
  left: animation.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  }),
});