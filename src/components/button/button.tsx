import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
  ActivityIndicator,
  TouchableOpacityProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native-animatable";
import { variants } from "./variants";

type ButtonProps = {
  title: string;
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  isLoading?: boolean;
  variant?: "primary" | "outlined"; 
  style?: TouchableOpacityProps["style"]; 
};

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled,
  icon,
  isLoading,
  variant = "primary",
  style,
}) => {
  const buttonVariant = variants[variant]; // Obtém o estilo do botão com base na variante selecionada
  const buttonStyle = disabled ? buttonVariant.disabled : buttonVariant.enabled;
  return (
    <TouchableOpacity
      style={[styles.button, { ...buttonStyle.button }, style]} // Aplica o estilo do botão e a cor de fundo quando desabilitado
      onPress={onPress}
      disabled={isLoading || disabled} // Desabilita o botão se isLoading ou disabled
      activeOpacity={0.8} // Opacidade ao pressionar
      // Adiciona a propriedade variant
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={buttonStyle.icon.color} />
      ) : (
        <View style={styles.contentAlignment}>
          {icon && (
            <Ionicons
              name={icon}
              size={20}
              color={buttonStyle.icon.color} // Cor do ícone
              style={{ marginRight: 8 }} // Espaçamento entre o ícone e o texto
            />
          )}
          <Text style={[styles.text, { color: buttonStyle.title.color }]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contentAlignment: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "tomato", // azul
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
