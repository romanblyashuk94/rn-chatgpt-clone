import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import {
  getHeaderTitle,
  Header,
  useHeaderHeight,
} from "@react-navigation/elements";
import { BlurView } from "expo-blur";
import Drawer from "expo-router/drawer";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const sections = [
  { title: "Top Picks", label: "Curated top picks from this week" },
  { title: "Dall·E", label: "Transform your ideas into amazing images" },
  {
    title: "Writing",
    label:
      "Enhance your writing with tools for creation, editing, and style refinement",
  },
  { title: "Productivity", label: "Increase your efficiency" },
  {
    title: "Research & Analysis",
    label: "Find, evaluate, interpret, and visualize information",
  },
  { title: "Programming", label: "Write code, debug, test, and learn" },
];

const ExplorePage = () => {
  const headerHeight = useHeaderHeight();
  const [selected, setSelected] = useState(sections[0].title);

  return (
    <View style={styles.container}>
      <Drawer.Screen
        options={{
          headerTransparent: true,
          headerRight: () => (
            <TouchableOpacity style={{ marginRight: 16 }}>
              <Ionicons name="search" size={24} color={Colors.grey} />
            </TouchableOpacity>
          ),
          header: ({ options, route }) => (
            <BlurView
              intensity={40}
              tint="light"
              style={{ backgroundColor: "rgba(255,255,255,0.5)" }}
            >
              <Header
                {...options}
                title={getHeaderTitle(options, route.name)}
                headerStyle={{ backgroundColor: "transparent" }}
                headerBackground={() => null}
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  gap: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                }}
              >
                {sections.map((section, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setSelected(section.title);
                    }}
                    style={
                      selected === section.title
                        ? styles.sectionBtnSelected
                        : styles.sectionBtn
                    }
                  >
                    <Text
                      style={
                        selected === section.title
                          ? styles.sectionBtnTextSelected
                          : styles.sectionBtnText
                      }
                    >
                      {section.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </BlurView>
          ),
        }}
      />

      <ScrollView
        contentContainerStyle={{
          paddingTop: headerHeight,
        }}
      ></ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light,
  },
  section: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  sectionBtn: {
    backgroundColor: Colors.input,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sectionBtnSelected: {
    backgroundColor: Colors.grey,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sectionBtnText: {
    color: "#000",
    fontWeight: "500",
  },
  sectionBtnTextSelected: {
    color: "#fff",
    fontWeight: "500",
  },
  card: {
    borderRadius: 8,
    backgroundColor: Colors.input,
    padding: 16,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 40,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  cardDesc: {
    fontSize: 14,
    color: "#000",
  },
  cardAuthor: {
    fontSize: 14,
    color: "#666",
  },
});

export default ExplorePage;
