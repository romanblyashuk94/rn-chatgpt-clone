import HeaderDropdown from "@/components/HeaderDropdown";
import MessageInput from "@/components/MessageInput";
import { defaultStyles } from "@/constants/Styles";
import { useAuth } from "@clerk/expo";
import { Stack } from "expo-router";
import { useState } from "react";
import { Button, Platform, StyleSheet, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

interface NewChatPageProps {
  onShouldSendMessage: (message: string) => void;
}

const NewChatPage = ({ onShouldSendMessage }: NewChatPageProps) => {
  const { signOut } = useAuth();
  const [gptVersion, setGptVersion] = useState<string>("3.5");

  const getCompletion = async (message: string) => {
    console.log(message);
  };

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

      <View style={{ flex: 1 }}>
        <Button
          title="Log out"
          onPress={() => {
            signOut();
          }}
        />
        {/* <ScrollView>
          {Array.from({ length: 100 }).map((_, index) => (
            <View key={index} style={{ height: 100 }}>
              <Text>Message {index}</Text>
            </View>
          ))}
        </ScrollView> */}
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
  container: {},
});

export default NewChatPage;
