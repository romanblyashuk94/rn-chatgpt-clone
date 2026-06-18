import { FlashListRef } from "@shopify/flash-list";
import { RefObject, useEffect, useRef } from "react";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

interface Params {
  messagesListRef: RefObject<FlashListRef<any> | null> | null;
  messages: unknown[];
  scrollBottomThreshold?: number;
}

export const useChatAutoscroll = ({
  messagesListRef,
  scrollBottomThreshold = 50,
  messages,
}: Params) => {
  const isAutoScrollEnabled = useRef(true);

  const setIsAutoScrollEnabled = (value: boolean) => {
    isAutoScrollEnabled.current = value;
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const distanceFromBottom =
      contentSize.height - layoutMeasurement.height - contentOffset.y;
    isAutoScrollEnabled.current = distanceFromBottom <= scrollBottomThreshold;
  };

  const handleScrollBeginDrag = () => {
    isAutoScrollEnabled.current = false;
  };

  useEffect(() => {
    if (messages.length === 0 || !isAutoScrollEnabled.current) return;
    messagesListRef?.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return {
    isAutoScrollEnabled,
    setIsAutoScrollEnabled,
    handleScroll,
    handleScrollBeginDrag,
  };
};
