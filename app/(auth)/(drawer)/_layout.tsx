import Colors from "@/constants/Colors";
import { useUser } from "@clerk/expo";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { DrawerActions } from "@react-navigation/native";
import { Link } from "expo-router";
import { Drawer } from "expo-router/drawer";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const insets = useSafeAreaInsets();
  const { user } = useUser();

  return (
    <View style={{ flex: 1, marginTop: insets.top }}>
      <View style={{ backgroundColor: "#fff ", paddingBottom: 16 }}>
        <View style={styles.searchSection}>
          <Ionicons
            name="search-outline"
            size={20}
            color={Colors.greyLight}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            underlineColorAndroid="transparent"
          />
        </View>
      </View>
      <DrawerContentScrollView
        contentContainerStyle={{ paddingTop: 0 }}
        {...props}
      >
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {user && (
        <View style={{ padding: 16, paddingBottom: insets.bottom }}>
          <Link href="/(auth)/(modal)/settings" asChild>
            <TouchableOpacity style={styles.footer}>
              <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
              <Text
                style={styles.userName}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {user.fullName || user.emailAddresses[0].emailAddress}
              </Text>
              <Ionicons
                name="ellipsis-horizontal"
                size={24}
                color={Colors.greyLight}
              />
            </TouchableOpacity>
          </Link>
        </View>
      )}
    </View>
  );
};

const DrawerLayout = () => {
  const dimensions = useWindowDimensions();

  return (
    <Drawer
      drawerContent={CustomDrawerContent}
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: Colors.light },
        headerShadowVisible: false,
        drawerActiveBackgroundColor: Colors.selected,
        drawerActiveTintColor: "#000",
        drawerInactiveTintColor: "#000",
        drawerItemStyle: { borderRadius: 12 },
        overlayColor: "rgba(0, 0, 0, 0.2)",
        drawerStyle: { width: dimensions.width * 0.86 },

        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            style={{ marginLeft: 16 }}
          >
            <FontAwesome6 name="grip-lines" size={28} color={Colors.grey} />
          </TouchableOpacity>
        ),
      })}
    >
      <Drawer.Screen
        name="(chat)/new"
        options={{
          title: "ChatGPT",
          drawerIcon: () => (
            <View style={[styles.item, { backgroundColor: "#000" }]}>
              <Image
                source={require("@/assets/images/logo-white.png")}
                style={[styles.image]}
              />
            </View>
          ),
          headerRight: () => (
            <Link href="/(auth)/(drawer)/(chat)/new" push asChild>
              <TouchableOpacity>
                <Ionicons
                  name="create-outline"
                  size={24}
                  color={Colors.grey}
                  style={{ marginRight: 16 }}
                />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
      <Drawer.Screen
        name="dalle"
        options={{
          title: "Dall·E",
          drawerIcon: () => (
            <View style={[styles.item]}>
              <Image
                source={require("@/assets/images/dalle.png")}
                style={[styles.dalleImage]}
              />
            </View>
          ),
        }}
      />

      <Drawer.Screen
        name="explore"
        options={{
          title: "Explore GPTs",
          drawerIcon: () => (
            <View style={[styles.item, { backgroundColor: "#fff" }]}>
              <Ionicons name="apps-outline" size={18} color="#000" />
            </View>
          ),
        }}
      />
    </Drawer>
  );
};

const styles = StyleSheet.create({
  item: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  image: {
    margin: 6,
    width: 16,
    height: 16,
  },
  dalleImage: {
    width: 28,
    height: 28,
  },
  searchSection: {
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.input,
    borderRadius: 10,
    height: 34,
  },
  searchInput: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 8,
    alignItems: "center",
    color: "#424242",
  },
  searchIcon: {
    padding: 6,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  userName: {
    flex: 1,
    flexShrink: 1,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default DrawerLayout;
