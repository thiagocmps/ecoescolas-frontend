import react from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput as NativeTextInput,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

type TextInputProps = {
  secureTextEntry?: boolean;
  type: "input" | "textarea";
  placeholder?: string;
  onSubmitEditing?: () => void;
  value?: string;
  onChangeText?: (text: string) => void;
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  label?: string;
  style?: React.ComponentProps<typeof View>["style"];
};

const TextInput: React.FC<TextInputProps> = ({
  secureTextEntry,
  placeholder,
  onChangeText,
  icon,
  value,
  label,
  onSubmitEditing,
  style,
  type,
}) => {
  return (
    <ScrollView style={[{ width: "100%" }, style]}>
      {label && (
        <Text style={{ marginBottom: 5, fontSize: 16, color: "#333" }}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          style,
          {
            height:
              type === "textarea" ? (Platform.OS == "web" ? 90 : 150) : 50,
            alignItems: type === "textarea" ? "flex-start" : "center",
          },
        ]}
      >
        <View
          style={{
            height: type === "textarea" ? "100%" : undefined,
            paddingTop: type === "textarea" ? 10 : 0,
          }}
        >
          {icon && (
            <Ionicons
              name={icon}
              size={20}
              color="#ccc"
              style={{ marginRight: 10 }}
            />
          )}
        </View>
        {type === "textarea" ? (
          <NativeTextInput
            secureTextEntry={secureTextEntry}
            placeholder={placeholder}
            onChangeText={onChangeText}
            value={value}
            style={{ flex: 1, height: "100%", width: "100%", paddingTop: 10 }}
            placeholderTextColor="#ccc"
            onSubmitEditing={onSubmitEditing}
            multiline={true}
            numberOfLines={4}
            autoCapitalize="none"
            textAlignVertical="top"
          />
        ) : (
          <NativeTextInput
            secureTextEntry={secureTextEntry}
            placeholder={placeholder}
            onChangeText={onChangeText}
            value={value}
            style={{ flex: 1, height: "100%", width: "100%" }}
            placeholderTextColor="#ccc"
            autoCapitalize="none"
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 10,
    borderColor: "#ccc",
    borderRadius: 10,
  },
});

export default TextInput;
