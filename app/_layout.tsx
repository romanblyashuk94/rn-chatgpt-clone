import Colors from "@/constants/Colors";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { RootSiblingParent } from "react-native-root-siblings";
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

SplashScreen.preventAutoHideAsync();

function InitialLayout() {
  const [fontLoaded, fontError] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
  });

  const router = useRouter();

  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  useEffect(() => {
    if (fontLoaded && isAuthLoaded) SplashScreen.hideAsync();
  }, [fontLoaded, isAuthLoaded]);

  useEffect(() => {
    if (!isAuthLoaded || !fontLoaded) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (isSignedIn && !inAuthGroup) {
      // Bring the user inside
      router.replace("/(auth)/(drawer)/(chat)/new");
    } else if (!isSignedIn && inAuthGroup) {
      // Kick the user out
      router.replace("/");
    }
  }, [isSignedIn, isAuthLoaded, fontLoaded]);

  if (!isAuthLoaded || !fontLoaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color={"#000"} />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="login"
        options={{
          presentation: "modal",
          title: "",
          headerRight: () => (
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
              <Ionicons name="close-outline" size={24} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}

const RootLayoutNav = () => {
  return (
    <RootSiblingParent>
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <KeyboardProvider>
            <InitialLayout />
          </KeyboardProvider>
        </GestureHandlerRootView>
      </ClerkProvider>
    </RootSiblingParent>
  );
};

export default RootLayoutNav;
