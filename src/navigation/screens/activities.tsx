import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ActivitiesScreen() {
    return (
        <View style={styles.screenContainer}>
        <Text>ATIVIDADES</Text>
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
