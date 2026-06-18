import { useState } from "react";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { useAnimatedStyle } from "react-native-reanimated";

interface Params {
  logoHeight?: number;
}

export const useChatViewAnimatedHeight = ({ logoHeight = 0 }: Params = {}) => {
  const [containerHeight, setContainerHeight] = useState(0);
  const { height: keyboardHeight } = useReanimatedKeyboardAnimation();

  const logoAnimatedStyle = useAnimatedStyle(() => {
    const visibleHeight = containerHeight + keyboardHeight.value;
    const marginTop = visibleHeight / 2 - logoHeight;
    return { marginTop: Math.max(0, marginTop) };
  });

  const onLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setContainerHeight(height);
  };

  return { logoAnimatedStyle, onLayout };
};
