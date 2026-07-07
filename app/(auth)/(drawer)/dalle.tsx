import ChatMessage from "@/components/ChatMessage";
import MessageInput from "@/components/MessageInput";
import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { useChatAutoscroll } from "@/hooks/useChatAutoscroll";
import { useChatViewAnimatedHeight } from "@/hooks/useChatViewAnimatedHeight";
import { Message, Role } from "@/util/interfaces";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import { Stack } from "expo-router";
import { useRef, useState } from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import Animated from "react-native-reanimated";

const POLLINATIONS_BASE = "https://image.pollinations.ai/prompt";

const DallePage = () => {
  const messagesListRef = useRef<FlashListRef<Message>>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [working, setWorking] = useState(false);

  const { isAutoScrollEnabled, handleScroll, handleScrollBeginDrag } =
    useChatAutoscroll({ scrollBottomThreshold: 50, messagesListRef, messages });

  const { logoAnimatedStyle, onLayout } = useChatViewAnimatedHeight({
    logoHeight: 110,
  });

  const getCompletion = async (message: string) => {
    isAutoScrollEnabled.current = true;
    setMessages([...messages, { role: Role.User, content: message }]);
    setWorking(true);
    try {
      const imageUrl = `${POLLINATIONS_BASE}/${encodeURIComponent(message)}?width=1024&height=1024&seed=${Date.now()}&nologo=true&model=flux`;

      await Image.prefetch(imageUrl);

      setMessages((prev) => {
        return [
          ...prev,
          {
            role: Role.Bot,
            content: message,
            imageUrl,
            prompt: message,
          },
        ];
      });
    } catch (error) {
      console.warn("[Pollinations] Image generation failed:", error);
      setMessages((prev) => {
        return [
          ...prev,
          {
            role: Role.Bot,
            content: "Image generation failed. Please try again.",
          },
        ];
      });
    } finally {
      setWorking(false);
    }
  };

  return (
    <View style={defaultStyles.pageContainer}>
      <Stack.Screen
        options={{
          headerTitle: "DALL·E",
        }}
      />

      <View style={{ flex: 1 }} onLayout={onLayout}>
        {messages.length === 0 ? (
          <Animated.View
            style={[{ alignItems: "center", gap: 10 }, logoAnimatedStyle]}
          >
            <Image
              source={require("@/assets/images/dalle.png")}
              style={styles.image}
            />
            <Text style={styles.label}>
              Let me turn your imagination into imagery.
            </Text>
          </Animated.View>
        ) : (
          <FlashList
            ref={messagesListRef}
            keyExtractor={(item, index) => index.toString()}
            data={messages}
            renderItem={({ item }) => <ChatMessage {...item} />}
            ListFooterComponent={() =>
              working ? (
                <ChatMessage
                  role={Role.Bot}
                  content="Generating image..."
                  loading={working}
                />
              ) : null
            }
            contentContainerStyle={{ paddingBottom: 150, paddingTop: 30 }}
            keyboardDismissMode="on-drag"
            onScroll={handleScroll}
            onScrollBeginDrag={handleScrollBeginDrag}
            scrollEventThrottle={100}
          />
        )}
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ position: "absolute", bottom: 0, left: 0, width: "100%" }}
        keyboardVerticalOffset={70}
      >
        <MessageInput onShouldSendMessage={getCompletion} />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.greyLight,
  },
  label: {
    color: Colors.grey,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default DallePage;
