import { useAuth } from "@clerk/expo";
import { Button, View } from "react-native";

const Page = () => {
  const { signOut } = useAuth();
  return (
    <View style={{ flex: 1, backgroundColor: "red" }}>
      <Button title="Logout" onPress={() => signOut()} />
    </View>
  );
};

export default Page;
