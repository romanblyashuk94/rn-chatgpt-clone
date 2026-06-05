import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { useSignIn, useSignUp } from "@clerk/expo";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

const LoginPage = () => {
  const { type } = useLocalSearchParams<{ type: "register" | "login" }>();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, fetchStatus: signInFetchStatus } = useSignIn();
  const { signUp, fetchStatus: signUpFetchStatus } = useSignUp();

  const onSignUpPress = async () => {
    if (signUpFetchStatus === "fetching") return;

    setLoading(true);

    try {
      const { error } = await signUp.create({
        emailAddress: email,
        password,
      });

      if (error) {
        Alert.alert("Error", error.message);
        return;
      }

      await signUp.finalize({
        navigate: ({ session }) => {},
      });

      Alert.alert("Success", "Account created successfully");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onSignInPress = async () => {
    if (signInFetchStatus === "fetching") return;

    setLoading(true);

    try {
      const { error } = await signIn.create({
        identifier: email,
        password,
      });

      signIn.finalize({});
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <View style={defaultStyles.loadingOverlay}>
          <ActivityIndicator size="large" color={"#fff"} />
        </View>
      )}

      <KeyboardAwareScrollView style={[styles.container]} bottomOffset={200}>
        <Image
          source={require("@/assets/images/logo-dark.png")}
          style={styles.logo}
        />

        <Text style={styles.title}>
          {type === "login" ? "Welcome back" : "Create your account"}
        </Text>

        <View style={{ marginBottom: 30 }}>
          <TextInput
            style={styles.inputField}
            autoCapitalize="none"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.inputField}
            autoCapitalize="none"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {type === "login" ? (
          <TouchableOpacity
            onPress={onSignInPress}
            style={[defaultStyles.btn, styles.btnPrimary]}
          >
            <Text style={styles.btnPrimaryText}>Login</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={onSignUpPress}
            style={[defaultStyles.btn, styles.btnPrimary]}
          >
            <Text style={styles.btnPrimaryText}>Create account</Text>
          </TouchableOpacity>
        )}
      </KeyboardAwareScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logo: {
    width: 60,
    height: 60,
    alignSelf: "center",
    marginVertical: 100,
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    fontWeight: "bold",
    alignSelf: "center",
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#FFF",
  },
  btnPrimary: {
    backgroundColor: Colors.primary,
    marginTop: 7,
    marginBottom: 20,
  },
  btnPrimaryText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default LoginPage;
