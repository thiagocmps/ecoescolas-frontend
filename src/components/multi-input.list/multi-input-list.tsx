import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Button from "../button/button";
import { useState } from "react";
import Input from "../input/input";
import { Ionicons } from "@expo/vector-icons";

export type MessageObject = {
    messageInfo: string;
    createdAt: string;
};

type Props = {
  type: "array" | "object";
  label: string;
  placeholder?: string;
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  subLabel?: string;
  onSubmitEditing?: () => void;
  items: string[] | MessageObject[];
  onAdd: (item: string | MessageObject) => void;
  onRemove: (index: number) => void;
};

export default function MultiInputList({
  type,
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

    if (type === "array") {
      onAdd(input.trim());
    } else {
      const newObj: MessageObject = {
          messageInfo: input.trim(),
          createdAt: new Date().toISOString(),
        
      };
      onAdd(newObj);
    }

    setInput("");
  };

  return (
    <View style={localStyles.container}>
      <View>
        <Text style={localStyles.label}>{label}</Text>
        {subLabel && (
          <Text style={{ fontSize: 12, color: "#666", fontStyle: "italic" }}>
            {subLabel}
          </Text>
        )}
      </View>
      <View style={localStyles.inputRow}>
        <Input
          value={input}
          type="input"
          placeholder={placeholder}
          icon={icon}
          onChangeText={setInput}
          onSubmitEditing={onSubmitEditing}
        />
        <Button
          icon="add-outline"
          onPress={adicionar}
          style={localStyles.addButton}
        />
      </View>

      {items.map((item, index) => {
        const displayText =
          type === "array"
            ? (item as string)
            : `${(item as MessageObject).messageInfo} — ${new Date(
                (item as MessageObject).createdAt
              ).toLocaleString()}`;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => onRemove(index)}
            style={localStyles.item}
          >
            <Text style={localStyles.itemText}>{displayText}</Text>
            <Text style={localStyles.removeText}>✕</Text>
          </TouchableOpacity>
        );
      })}
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
    flex: 1,
  },
  removeText: {
    color: "#d00",
    fontWeight: "bold",
    marginLeft: 12,
  },
});
