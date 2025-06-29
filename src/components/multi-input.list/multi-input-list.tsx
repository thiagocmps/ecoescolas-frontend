import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Button from "../button/button";
import { useState } from "react";
import Input from "../input/input";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  label: string;
  placeholder?: string;
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  subLabel?: string;
  onSubmitEditing?: () => void;
  items: string[];
  onAdd: (item: string) => void;
  onRemove: (index: number) => void;
};

export default function MultiInputList({
  label,
  placeholder,
  icon,
  subLabel,
  items,
  onAdd,
  onRemove,
  onSubmitEditing,
}: Props) {
  const [input, setInput] = useState("");

  const adicionar = () => {
    if (!input.trim()) return;
    onAdd(input.trim());
    setInput("");
  };

  return (
    <View style={localStyles.container}>
      <View>
        <Text style={localStyles.label}>{label}</Text>
        {subLabel && <Text style={{ fontSize: 12, color: "#666", fontStyle: "italic" }}>{subLabel}</Text>}
      </View>
      <View style={localStyles.inputRow}>
        <Input
          value={input}
          type="input"
          placeholder={placeholder}
          onSubmitEditing={onSubmitEditing} 
          icon={icon}
          onChangeText={setInput}
        ></Input>
        <Button
          icon="add-outline"
          onPress={adicionar}
          style={localStyles.addButton}
        />
      </View>

      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onRemove(index)}
          style={localStyles.item}
        >
          <Text style={localStyles.itemText}>{item}</Text>
          <Text style={localStyles.removeText}>✕</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 8,
  },
  label: {
    fontWeight: "600",
    marginBottom: 4,
    fontSize: 16,
  },
  inputRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  addButton: {
    width: 60,
    height: 50,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 8,
  },
  itemText: {
    fontSize: 14,
  },
  removeText: {
    color: "#d00",
    fontWeight: "bold",
  },
});
