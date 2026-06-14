import { Message, Role } from "@/util/interfaces";
import { useUser } from "@clerk/expo";
import { Image, StyleSheet, View } from "react-native";
import Markdown from "react-native-markdown-display";

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

      <View style={styles.content}>
        <Markdown style={markdownStyles}>{content}</Markdown>
      </View>
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
  content: {
    flex: 1,
  },
});

const markdownStyles = StyleSheet.create({
  body: {
    fontSize: 16,
  },
  code_inline: {
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    paddingHorizontal: 4,
    fontSize: 14,
    fontFamily: "Courier",
  },
  fence: {
    backgroundColor: "#1e1e1e",
    color: "#d4d4d4",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: "Courier",
  },
  blockquote: {
    backgroundColor: "#f5f5f5",
    borderLeftWidth: 4,
    borderLeftColor: "#ccc",
    paddingLeft: 12,
    marginVertical: 8,
  },
  heading1: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 8,
  },
  heading2: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 6,
  },
  heading3: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 4,
  },
  paragraph: {
    marginVertical: 4,
  },
});
