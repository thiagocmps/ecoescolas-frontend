import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Platform } from 'react-native';
import WebNavigator from "../navigation/webNavigator";
import BottomNavigator from "../navigation/bottomNavigator";

export default function App() {
  return Platform.OS === "web" ? <WebNavigator/> : <BottomNavigator/>;
}
