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
  const [providerBaseUrlInStorage, setProviderBaseUrlInStorage] = useMMKVString(
    STORAGE_KEYS.PROVIDER_BASE_URL,
    storage,
  );

  const [apiKey, setApiKey] = useState(keyInStorage || "");
  const [providerBaseUrl, setProviderBaseUrl] = useState(
    providerBaseUrlInStorage || "",
  );
  const router = useRouter();

  const isSaveDisabled = !apiKey;

  const saveApiKey = async () => {
    setKeyInStorage(apiKey);
    setProviderBaseUrlInStorage(providerBaseUrl);
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
          <Text style={styles.label}>API Key:</Text>
          <Text numberOfLines={1} ellipsizeMode="clip" style={styles.text}>
            {apiKey}
          </Text>
          <Text style={styles.label}>Provider Base URL:</Text>
          <Text numberOfLines={1} ellipsizeMode="clip" style={styles.text}>
            {providerBaseUrl || "https://openrouter.ai/api/v1/"}
          </Text>
          <TouchableOpacity
            style={[defaultStyles.btn, { backgroundColor: Colors.primary }]}
            onPress={removeApiKey}
          >
            <Text style={styles.buttonText}>Remove API Key & Provider</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.label}>API Key:</Text>
          <TextInput
            style={styles.input}
            value={apiKey}
            onChangeText={setApiKey}
            placeholder="Enter your API key"
            autoCorrect={false}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Provider Base URL:</Text>

          <TextInput
            style={styles.input}
            value={providerBaseUrl}
            onChangeText={setProviderBaseUrl}
            placeholder="https://openrouter.ai/api/v1/"
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
            disabled={!apiKey || !providerBaseUrl}
          >
            <Text style={styles.buttonText}>Save Settings</Text>
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
  text: {
    fontSize: 16,
    marginTop: -5,
    marginBottom: 20,
    color: Colors.grey,
    flexWrap: "wrap",
    flexShrink: 1,
    maxWidth: "100%",
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
