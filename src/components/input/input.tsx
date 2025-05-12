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

type TextInputProps = {
  secureTextEntry?: boolean;
  placeholder?: string;
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
  style,
}) => {
  return (
    <View style={[{ width: "100%" }, style]}>
        {label && (
          <Text style={{ marginBottom: 5, fontSize: 16, color: "#333" }}>
            {label}
          </Text>
        )}
        <View style={[styles.inputContainer, style]}>
          {icon && (
            <Ionicons
              name={icon}
              size={20}
              color="#ccc"
              style={{ marginRight: 10 }}
            />
          )}
          <NativeTextInput
            secureTextEntry={secureTextEntry}
            placeholder={placeholder}
            onChangeText={onChangeText}
            value={value}
            style={{ flex: 1, height: "100%", width: "100%" }}
            placeholderTextColor="#ccc" // Cor do texto do placeholder
            autoCapitalize="none" // Desabilita a capitalização automática
          />
        </View>
    </View>
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
