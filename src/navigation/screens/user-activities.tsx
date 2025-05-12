import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function UserActivitiesScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text>MINHAS ATIVIDADES</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
