import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Touchable,
  View,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

type BackArrowProps = {
  style?: TouchableOpacityProps["style"];
  background?: boolean;
};
export default function BackArrow({ style, background }: BackArrowProps) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={[{ position: "absolute", top: 24, left: 16, width: 40, height: 40, justifyContent: "center", alignItems: "center" }, style]}
      onPress={() => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
      }}
    >
      {background && (
        <View
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            borderRadius: 100,
            elevation: 5,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "white",
          }}
        />
      )}
      <Ionicons
        name="arrow-back"
        size={24}
        color="black"
        style={{elevation: 10}}
      />
    </TouchableOpacity>
  );
}
