import React from 'react'
import { StyleSheet, View, ActivityIndicator } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay';

const LoadingScreen = () => {
    return (
        <View style={[styles.container, styles.horizontal]}>
            <ActivityIndicator size="large" color="red" animating={true} />
        </View>
    )
}

export default LoadingScreen

const styles = StyleSheet.create({
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
    }
})
