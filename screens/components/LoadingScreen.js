import React from 'react'
import { StyleSheet, View } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay';

const LoadingScreen = () => {
    return (
        <View style={[styles.container]}>
            <Spinner
                visible={true}
                textContent={'Loading...'}
                textStyle={styles.spinnerTextStyle}
                size="large"
            />
        </View>
    )
}

export default LoadingScreen

const styles = StyleSheet.create({
    spinnerTextStyle: {
        color: '#FFF'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    }
})
