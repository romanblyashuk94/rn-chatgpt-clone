import ChatMessage from "@/components/ChatMessage";
import HeaderDropdown from "@/components/HeaderDropdown";
import MessageIdeas from "@/components/MessageIdeas";
import MessageInput from "@/components/MessageInput";
import { MODELS } from "@/constants/Models";
import { STORAGE_KEYS } from "@/constants/StorageKeys";
import { defaultStyles } from "@/constants/Styles";
import { Message, Model, Role } from "@/util/interfaces";
import { storage } from "@/util/storage";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import { Redirect, Stack } from "expo-router";
import { fetch as expoFetch } from "expo/fetch";
import OpenAI from "openai";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import {
  KeyboardAvoidingView,
  useReanimatedKeyboardAnimation,
} from "react-native-keyboard-controller";
import { useMMKVObject, useMMKVString } from "react-native-mmkv";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

interface NewChatPageProps {
  onShouldSendMessage: (message: string) => void;
}

const NewChatPage = ({ onShouldSendMessage }: NewChatPageProps) => {
  const messagesListRef = useRef<FlashListRef<Message>>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [apiKey] = useMMKVString(STORAGE_KEYS.API_KEY, storage);
  const [providerBaseUrl] = useMMKVString(
    STORAGE_KEYS.PROVIDER_BASE_URL,
    storage,
  );
  const [selectedModel, setSelectedModel] = useMMKVObject<Model>(
    "selectedModel",
    storage,
  );

  const isAutoScrollEnabled = useRef(true);
  const SCROLL_BOTTOM_THRESHOLD = 50;

  useEffect(() => {
    if (messages.length === 0 || !isAutoScrollEnabled.current) return;
    messagesListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const distanceFromBottom =
      contentSize.height - layoutMeasurement.height - contentOffset.y;
    isAutoScrollEnabled.current = distanceFromBottom <= SCROLL_BOTTOM_THRESHOLD;
  };

  const handleScrollBeginDrag = () => {
    isAutoScrollEnabled.current = false;
  };

  const [containerHeight, setContainerHeight] = useState(0);
  const { height: keyboardHeight } = useReanimatedKeyboardAnimation();

  const openAI = useMemo(
    () =>
      apiKey
        ? new OpenAI({
            apiKey: apiKey || "",
            // expo/fetch supports streaming response bodies in React Native.
            fetch: expoFetch as unknown as typeof globalThis.fetch,
            dangerouslyAllowBrowser: true,
            baseURL: providerBaseUrl || "https://openrouter.ai/api/v1/",
          })
        : undefined,
    [apiKey, providerBaseUrl],
  );

  const getCompletion = async (message: string) => {
    if (messages.length === 0) {
      // create chat later, store to DB
    }

    isAutoScrollEnabled.current = true;
    const conversation = [...messages, { role: Role.User, content: message }];

    setMessages([...conversation, { role: Role.Bot, content: "" }]);

    try {
      const stream = await openAI?.chat.completions.create({
        model: selectedModel?.key || MODELS[0].key,
        messages: conversation.map((m) => ({
          role: m.role === Role.User ? "user" : "assistant",
          content: m.content,
        })),
        stream: true,
      });

      let botResponse = "";

      for await (const chunk of stream ?? []) {
        const newContent = chunk.choices[0]?.delta?.content ?? "";

        if (!newContent) continue;

        botResponse += newContent;

        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage?.role !== Role.Bot) return prev;

          const updated = {
            ...lastMessage,
            content: lastMessage.content + newContent,
          };

          return [...prev.slice(0, -1), updated];
        });
      }

      const completedMessages = [
        ...conversation,
        { role: Role.Bot, content: botResponse },
      ];

      console.log("Chat ended. Saving messages to the DB", completedMessages);
    } catch (error) {
      console.warn("[OpenAI] Completion failed:", error);
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage?.role !== Role.Bot || lastMessage.content !== "") {
          return prev;
        }
        const updated = {
          ...lastMessage,
          content: "Something went wrong. Please try again.",
        };
        return [...prev.slice(0, -1), updated];
      });
    }
  };

  const onLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setContainerHeight(height);
  };

  // keyboardHeight goes from 0 → negative when keyboard opens,
  // so (containerHeight + keyboardHeight) gives the visible area height.
  const logoAnimatedStyle = useAnimatedStyle(() => {
    const visibleHeight = containerHeight + keyboardHeight.value;
    const marginTop = visibleHeight / 2 - 50;
    return { marginTop: Math.max(0, marginTop) };
  });

  if (!apiKey) {
    return <Redirect href="/(auth)/(modal)/settings" />;
  }

  return (
    <View style={defaultStyles.pageContainer}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <HeaderDropdown
              items={MODELS}
              onSelect={setSelectedModel}
              selected={selectedModel || MODELS[0]}
            />
          ),
        }}
      />

      <View style={{ flex: 1 }} onLayout={onLayout}>
        {messages.length === 0 ? (
          <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
            <Image
              source={require("@/assets/images/logo-white.png")}
              style={styles.image}
            />
          </Animated.View>
        ) : (
          <FlashList
            ref={messagesListRef}
            keyExtractor={(item, index) => index.toString()}
            data={messages}
            renderItem={({ item }) => <ChatMessage {...item} />}
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
        {messages.length === 0 && <MessageIdeas onSelectCard={getCompletion} />}
        <MessageInput onShouldSendMessage={getCompletion} />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    backgroundColor: "#000",
    borderRadius: 50,
  },
  image: {
    width: 30,
    height: 30,
  },
});

export default NewChatPage;
