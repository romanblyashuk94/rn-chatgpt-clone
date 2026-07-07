import Colors from "@/constants/Colors";
import { copyImageToClipboard, saveToPhotos, shareImage } from "@/util/image";
import { Message, Role } from "@/util/interfaces";
import { useUser } from "@clerk/expo";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import Markdown from "react-native-markdown-display";
import * as ContextMenu from "zeego/context-menu";

const ChatMessage = ({
  role,
  content,
  imageUrl,
  prompt,
  loading,
}: Message & { loading?: boolean }) => {
  const { user } = useUser();
  const isBotImage = role === Role.Bot && imageUrl;

  const contextItems = [
    {
      title: "Copy",
      systemIcon: "doc.on.doc",
      action: () => copyImageToClipboard(imageUrl!),
    },
    {
      title: "Save to Photos",
      systemIcon: "arrow.down.to.line",
      action: () => saveToPhotos(imageUrl!),
    },
    {
      title: "Share",
      systemIcon: "square.and.arrow.up",
      action: () => shareImage(imageUrl!),
    },
  ];

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
        <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
      )}

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="small" color={Colors.primary} />
          </View>
        ) : isBotImage ? (
          <ContextMenu.Root>
            <ContextMenu.Trigger>
              <Image source={{ uri: imageUrl }} style={styles.generatedImage} />
            </ContextMenu.Trigger>
            <ContextMenu.Content>
              {contextItems.map((item) => (
                <ContextMenu.Item key={item.title} onSelect={item.action}>
                  <ContextMenu.ItemTitle>{item.title}</ContextMenu.ItemTitle>
                  <ContextMenu.ItemIcon
                    ios={{ name: item.systemIcon, pointSize: 18 }}
                  />
                </ContextMenu.Item>
              ))}
            </ContextMenu.Content>
          </ContextMenu.Root>
        ) : (
          <Markdown style={markdownStyles}>{content}</Markdown>
        )}
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
  loading: {
    justifyContent: "center",
    height: 86,
    borderWidth: 1,
    borderColor: Colors.greyLight,
    borderRadius: 12,
  },
  generatedImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
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
