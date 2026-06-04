import { Slot } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Layout = () => {
  const { bottom, top } = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "blue",
        paddingBottom: bottom,
        paddingTop: top,
      }}
    >
      <Text>Auth Layout</Text>
      <Slot />
    </View>
  );
};

export default Layout;
