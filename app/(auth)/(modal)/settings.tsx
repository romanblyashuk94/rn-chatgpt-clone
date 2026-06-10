import Colors from "@/constants/Colors";
import { STORAGE_KEYS } from "@/constants/StorageKeys";
import { defaultStyles } from "@/constants/Styles";
import { storage } from "@/util/storage";
import { useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useMMKVString } from "react-native-mmkv";

const SettingsPage = () => {
  const { signOut } = useAuth();

  const [keyInStorage, setKeyInStorage] = useMMKVString(
    STORAGE_KEYS.API_KEY,
    storage,
  );

  const [apiKey, setApiKey] = useState(keyInStorage);
  const router = useRouter();

  const isSaveDisabled = !apiKey;

  const saveApiKey = async () => {
    setKeyInStorage(apiKey);
    router.navigate("/(auth)/(drawer)/(chat)/new");
  };

  const removeApiKey = async () => {
    setKeyInStorage("");

    setApiKey("");
  };

  return (
    <View style={styles.container}>
      {keyInStorage ? (
        <>
          <Text style={styles.label}>API Key has been set successfully</Text>
          <TouchableOpacity
            style={[defaultStyles.btn, { backgroundColor: Colors.primary }]}
            onPress={removeApiKey}
          >
            <Text style={styles.buttonText}>Remove API Key</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.label}>API Secret Key:</Text>
          <TextInput
            style={styles.input}
            value={apiKey}
            onChangeText={setApiKey}
            placeholder="Enter your API key"
            autoCorrect={false}
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={[
              defaultStyles.btn,
              {
                backgroundColor: Colors.primary,
                opacity: isSaveDisabled ? 0.5 : 1,
              },
            ]}
            onPress={saveApiKey}
            disabled={!apiKey}
          >
            <Text style={styles.buttonText}>Save API Key</Text>
          </TouchableOpacity>
          <></>
        </>
      )}

      <Button title="Log out" onPress={() => signOut()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
});

export default SettingsPage;
