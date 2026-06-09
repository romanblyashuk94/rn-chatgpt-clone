import { Message, Role } from "@/util/interfaces";
import { useUser } from "@clerk/expo";
import { Image, StyleSheet, Text, View } from "react-native";

const ChatMessage = ({ role, content, imageUrl, prompt }: Message) => {
  const { user } = useUser();

  return (
    <View style={styles.row}>
      {role === Role.Bot ? (
        <View style={[styles.item]}>
          <Image
            source={require("@/assets/images/logo-white.png")}
            style={styles.btnImage}
          />
        </View>
      ) : (
        <>
          <Image
            source={imageUrl ? { uri: imageUrl } : { uri: user?.imageUrl }}
            style={styles.avatar}
          />
        </>
      )}

      <Text style={styles.text}>{content}</Text>
    </View>
  );
};

export default ChatMessage;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 14,
    gap: 14,
    marginVertical: 12,
  },
  item: {
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  btnImage: {
    margin: 6,
    width: 16,
    height: 16,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  text: {
    padding: 4,
    fontSize: 16,
    flexWrap: "wrap",
    flex: 1,
  },
});
