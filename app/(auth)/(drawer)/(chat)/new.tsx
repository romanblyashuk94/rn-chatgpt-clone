import ChatMessage from "@/components/ChatMessage";
import HeaderDropdown from "@/components/HeaderDropdown";
import MessageIdeas from "@/components/MessageIdeas";
import MessageInput from "@/components/MessageInput";
import { defaultStyles } from "@/constants/Styles";
import { Message, Role } from "@/util/interfaces";
import { useAuth } from "@clerk/expo";
import { FlashList } from "@shopify/flash-list";
import { Stack } from "expo-router";
import { useState } from "react";
import { Image, Platform, StyleSheet, View } from "react-native";
import {
  KeyboardAvoidingView,
  useReanimatedKeyboardAnimation,
} from "react-native-keyboard-controller";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

interface NewChatPageProps {
  onShouldSendMessage: (message: string) => void;
}

const DUMMY_MESSAGES: Message[] = [
  {
    role: Role.Bot,
    content: "Hello, how can I help you today?",
  },
  {
    content:
      "I need a help with my React Native app. I need a help with my React Native app. I need a help with my React Native app. I need a help with my React Native app.",
    role: Role.User,
  },
  {
    role: Role.Bot,
    content: "Hello, how can I help you today?",
  },
  {
    content:
      "I need a help with my React Native app. I need a help with my React Native app. I need a help with my React Native app. I need a help with my React Native app.",
    role: Role.User,
  },
  {
    role: Role.Bot,
    content: "Hello, how can I help you today?",
  },
  {
    content:
      "I need a help with my React Native app. I need a help with my React Native app. I need a help with my React Native app. I need a help with my React Native app.",
    role: Role.User,
  },
  {
    role: Role.Bot,
    content: "Hello, how can I help you today?",
  },
  {
    content:
      "I need a help with my React Native app. I need a help with my React Native app. I need a help with my React Native app. I need a help with my React Native app.",
    role: Role.User,
  },
  {
    role: Role.Bot,
    content: "Hello, how can I help you today?",
  },
  {
    content:
      "I need a help with my React Native app. I need a help with my React Native app. I need a help with my React Native app. I need a help with my React Native app.",
    role: Role.User,
  },
  {
    role: Role.Bot,
    content: "Hello, how can I help you today?",
  },
  {
    content:
      "I need a help with my React Native app. I need a help with my React Native app. I need a help with my React Native app. I need a help with my React Native app.",
    role: Role.User,
  },
];

const NewChatPage = ({ onShouldSendMessage }: NewChatPageProps) => {
  const { signOut } = useAuth();
  const [gptVersion, setGptVersion] = useState<string>("3.5");
  const [messages, setMessages] = useState<Message[]>([...DUMMY_MESSAGES]);
  const [containerHeight, setContainerHeight] = useState(0);

  const { height: keyboardHeight } = useReanimatedKeyboardAnimation();

  const getCompletion = async (message: string) => {
    console.log(message);
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

  return (
    <View style={defaultStyles.pageContainer}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <HeaderDropdown
              title="Chat GPT"
              items={[
                { key: "3.5", title: "GPT-3.5", icon: "bolt" },
                { key: "4", title: "GPT-4", icon: "sparkles" },
              ]}
              onSelect={(key) => {
                setGptVersion(key);
              }}
              selected={gptVersion}
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
            keyExtractor={(item, index) => index.toString()}
            data={messages}
            renderItem={({ item }) => <ChatMessage {...item} />}
            contentContainerStyle={{ paddingBottom: 150, paddingTop: 30 }}
            keyboardDismissMode="on-drag"
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
  container: {},
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
