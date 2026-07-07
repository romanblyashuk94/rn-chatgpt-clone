import Colors from "@/constants/Colors";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PredefinedMessages = [
  { title: "Explain React Native", text: "like I'm five years old" },
  {
    title: "Suggest fun activities",
    text: "for a family visiting San Francisco",
  },
  {
    title: "Recommend a restaurant",
    text: "to impress a date who's a picky eater",
  },
];

interface MessageIdeasProps {
  onSelectCard: (message: string) => void;
}

const MessageIdeas = ({ onSelectCard }: MessageIdeasProps) => {
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          gap: 16,
        }}
      >
        {PredefinedMessages.map((message, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => onSelectCard(`${message.title} ${message.text}`)}
          >
            <Text style={{ fontSize: 16, fontWeight: "500" }}>
              {message.title}
            </Text>
            <Text style={{ fontSize: 14, color: Colors.grey }}>
              {message.text}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default MessageIdeas;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.input,
    padding: 14,
    borderRadius: 10,
  },
});
