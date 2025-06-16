import { useEffect, useState } from "react";
import { Dimensions } from "react-native";

export function useResponsiveWidth(numColumns: number, spacing = 160) {
  const [width, setWidth] = useState(Dimensions.get("window").width);

  useEffect(() => {
    const handler = ({ window }: { window: { width: number } }) => {
      setWidth(window.width);
    };

    const subscription = Dimensions.addEventListener("change", handler);
    return () => subscription?.remove();
  }, []);

  const totalSpacing = spacing * (numColumns + 1);
  const cardWidth = (width - totalSpacing) / numColumns;

  return cardWidth;
}