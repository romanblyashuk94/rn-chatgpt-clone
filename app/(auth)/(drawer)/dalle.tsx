import HeaderDropdown from "@/components/HeaderDropdown";
import { defaultStyles } from "@/constants/Styles";
import { Stack } from "expo-router";
import { View } from "react-native";

const DallePage = () => {
  return (
    <View style={defaultStyles.pageContainer}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <HeaderDropdown
              title="Dall·E"
              items={[
                {
                  key: "share",
                  title: "Share GPT",
                  icon: "square.and.arrow.up",
                },
                { key: "details", title: "See Details", icon: "info.circle" },
                { key: "keep", title: "Keep in Sidebar", icon: "pin" },
              ]}
              onSelect={() => {}}
              selected={undefined}
            />
          ),
        }}
      />
    </View>
  );
};

export default DallePage;
