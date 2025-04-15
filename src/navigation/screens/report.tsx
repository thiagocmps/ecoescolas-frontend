import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ReportScreen() {
    return (
        <View style={styles.screenContainer}>
        <Text>OCORRÊNCIAS</Text>
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
