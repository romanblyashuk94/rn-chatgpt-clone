import Colors from "@/constants/Colors";
import { STORAGE_KEYS } from "@/constants/StorageKeys";
import { storage } from "@/util/storage";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { useMMKVString } from "react-native-mmkv";

const Layout = () => {
  const router = useRouter();
  const [apiKey, setApiKey] = useMMKVString(STORAGE_KEYS.API_KEY, storage);

  return (
    <Stack>
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(modal)/settings"
        options={{
          headerTitle: "Settings",
          headerShadowVisible: false,
          gestureEnabled: false,
          headerLeft: () =>
            apiKey && (
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: Colors.selected,
                  padding: 4,
                  borderRadius: 20,
                }}
                onPress={() => router.back()}
              >
                <Ionicons
                  name="arrow-back-outline"
                  size={24}
                  color={Colors.grey}
                />
              </TouchableOpacity>
            ),
        }}
      />
      <Stack.Screen
        name="(modal)/image/[url]"
        options={{
          headerTitle: "",
          presentation: "fullScreenModal",
          headerBlurEffect: "dark",
          headerStyle: { backgroundColor: "rgba(0,0,0,0.4)" },
          headerLeft: () =>
            router.canGoBack() && (
              <TouchableOpacity
                style={{
                  padding: 4,
                  borderRadius: 20,
                }}
                onPress={() => router.back()}
              >
                <Ionicons name="close-outline" size={28} color={"#fff"} />
              </TouchableOpacity>
            ),
        }}
      />
    </Stack>
  );
};

export default Layout;
