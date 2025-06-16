import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
  ActivityIndicator,
  TouchableOpacityProps,
  OpaqueColorValue,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native-animatable";
import { variants } from "./variants";

type ButtonProps = {
  title?: string;
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  isLoading?: boolean;
  variant?: "primary" | "outlined";
  style?: TouchableOpacityProps["style"];
  contentColor?: OpaqueColorValue | string;
};

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled,
  icon,
  isLoading,
  variant = "primary",
  style,
  contentColor,
}) => {
  const buttonVariant = variants[variant];
  const buttonStyle = disabled ? buttonVariant.disabled : buttonVariant.enabled;
  return (
    <TouchableOpacity
      style={[localStyles.button, { ...buttonStyle.button }, style]}
      onPress={onPress}
      disabled={isLoading || disabled}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={buttonStyle.icon.color} />
      ) : (
        <View style={localStyles.contentAlignment}>
          {icon && (
            <Ionicons
              name={icon}
              size={20}
              color={contentColor ?? buttonStyle.icon.color} // Cor do ícone
              style={title ? { marginRight: 8 } : undefined} // Espaçamento entre o ícone e o texto
            />
          )}
          {title === "" || title === null || title === undefined ? null : (
            <Text
              numberOfLines={1}
              style={[
                localStyles.text,
                { color: contentColor ?? buttonStyle.title.color },
              ]}
            >
              {title}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const localStyles = StyleSheet.create({
  contentAlignment: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#660099", // azul
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 100,
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    height: 50,
  },
  text: {
    color: "#ffffff",
    fontWeight: "500",
    fontSize: 16,
  },
});

export default Button;
