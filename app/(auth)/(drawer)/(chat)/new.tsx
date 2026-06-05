import HeaderDropdown from "@/components/HeaderDropdown";
import { defaultStyles } from "@/constants/Styles";
import { Stack } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

const NewChatPage = () => {
  const [gptVersion, setGptVersion] = useState<string>("3.5");

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default NewChatPage;
