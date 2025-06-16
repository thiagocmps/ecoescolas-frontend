import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  ViewProps,
  ScrollViewProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownSelectProps {
  label?: string;
  subLabel?: string;
  options: DropdownOption[];
  selected: DropdownOption | null;
  onSelect: (option: DropdownOption) => void;
  placeholder?: string;
  containerStyle?: ViewProps["style"];
  dropdownStyle?: ScrollViewProps["style"];
}

const DropdownSelect: React.FC<DropdownSelectProps> = ({
  label,
  subLabel,
  options,
  containerStyle,
  dropdownStyle,
  selected,
  onSelect,
  placeholder = "Selecione uma opção",
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (option: DropdownOption) => {
    onSelect(option);
    setOpen(false);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      {subLabel && <Text style={styles.subLabel}>{subLabel}</Text>}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setOpen((prev) => !prev)}
      >
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>
            {selected ? selected.label : placeholder}
          </Text>
          <Ionicons
            name={open ? "chevron-up" : "chevron-down"}
            size={24}
            style={styles.icon}
          />
        </View>
      </TouchableOpacity>

      {open && (
        <ScrollView
          style={[styles.dropdown]}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
        >
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.item}
              onPress={() => handleSelect(option)}
            >
              <Text style={styles.itemText} numberOfLines={2}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default DropdownSelect;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    /* position: "relative", */
    zIndex: Platform.OS === "web" ? 5 : undefined,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    color: "#333",
  },
  subLabel: {
    fontSize: 12,
    color: "#666",
    paddingBottom: 4,
    fontStyle: "italic",
  },
  button: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#333",
    width: "90%",
  },
  icon: {
    color: "#333",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    marginTop: 4,
    zIndex: Platform.OS === "web" ? 999 : 999,
    elevation: Platform.OS !== "web" ? 5 : 0,
    width: "100%",
    maxHeight: 200,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  itemText: {
    width: "80%",
    fontSize: 16,
    color: "#333",
  },
});
