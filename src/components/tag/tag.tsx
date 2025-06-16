import { Text, View, ViewProps } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type TagProps = {
  text?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  color: string;
  style?: ViewProps["style"];
  textColor?: string;
  iconColor?: string;
};

export default function Tag({ text, icon, color, style, textColor, iconColor }: TagProps) {
  return (
    <View
      style={[{
        height: 24,
        justifyContent: "center",
        alignItems: "center",
        /* marginStart: 8, */
        backgroundColor: color,
        borderRadius: 100,
        flexDirection: "row",
        paddingHorizontal: 8,
        gap: text === undefined || icon === undefined ? 0 : 6,
      }, style]}
    >
        {icon && (
            <Ionicons
            name={icon}
            size={16}
            color={iconColor ?? "white"}
            style={{ marginEnd: 4 }}
            />
        )}
        {
          text && (
            <Text
              style={{
                color: textColor ?? "white",
                fontSize: 12,
                fontWeight: "bold",
              }}
            >
              {text}
            </Text>
          )
        }
    </View>
  );
}
