import * as Clipboard from "expo-clipboard";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";

export const shareImage = async (imageUrl: string) => {
  try {
    const destination = new FileSystem.File(
      FileSystem.Paths.cache,
      `${Date.now()}.jpg`,
    );
    const file = await FileSystem.File.downloadFileAsync(
      imageUrl,
      destination,
      { idempotent: true },
    );

    await Sharing.shareAsync(file.uri);
  } catch (error) {
    console.error(error);
    Alert.alert("Error", "Failed to share image");
  }
};

export const copyImageToClipboard = async (imageUrl: string) => {
  try {
    const destination = new FileSystem.File(
      FileSystem.Paths.cache,
      `${Date.now()}.jpg`,
    );
    const file = await FileSystem.File.downloadFileAsync(
      imageUrl,
      destination,
      {
        idempotent: true,
      },
    );
    const base64 = await file.base64();

    await Clipboard.setImageAsync(base64);
    Alert.alert("Success", "Image copied to clipboard");
  } catch (error) {
    console.error(error);
    Alert.alert("Error", "Failed to copy image to clipboard");
  }
};

export const saveToPhotos = async (imageUrl: string) => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync(true);
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Please grant photo library access to save images.",
      );
      return;
    }

    const destination = new FileSystem.File(
      FileSystem.Paths.cache,
      `${Date.now()}.jpg`,
    );
    const file = await FileSystem.File.downloadFileAsync(imageUrl, destination, {
      idempotent: true,
    });

    await MediaLibrary.saveToLibraryAsync(file.uri);
    Alert.alert("Success", "Image saved to photos");
  } catch (error) {
    console.error(error);
    Alert.alert("Error", "Failed to save image to photos");
  }
};
