import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "react-native";

export default function AddActivityScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Agora vai pelo amor de Deus</Text>
      </View>
    </SafeAreaView>
  );
}
