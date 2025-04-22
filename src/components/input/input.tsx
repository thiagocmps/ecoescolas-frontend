import react from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput as NativeTextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type TextInputProps = {
  secureTextEntry?: boolean;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  label?: string;
};

const TextInput: React.FC<TextInputProps> = ({
  secureTextEntry,
  placeholder,
  onChangeText,
  icon,
  value,
  label,
}) => {
  return (
    <View>
      {label && (
        <Text style={{ marginBottom: 5, fontSize: 16, color: "#333" }}>
          {label}
        </Text>
      )}
    <View style={styles.inputContainer}>
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
        style={{ flex: 1 }}
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
