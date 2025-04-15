import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function UserScreen() {
    return (
        <View style={styles.screenContainer}>
        <Text>CONTA</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    }})
