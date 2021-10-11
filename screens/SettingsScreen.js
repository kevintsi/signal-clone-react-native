import React, { useLayoutEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { auth } from '../firebase'
import { Avatar, Button } from 'react-native-elements'

const SettingsScreen = () => {

    return (
        <View style={styles.container}>
            <View style={{ padding: 20, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <Avatar size={150} rounded source={{ uri: auth?.currentUser?.photoURL }} />
                <Text style={{ paddingTop: 10, fontSize: 25, fontWeight: "700" }}>{auth?.currentUser.displayName}</Text>
            </View>
            <View style={{ flexDirection: "column", alignItems: "center", paddingTop: 80, height: "100%" }}>
                <TouchableOpacity style={styles.deleteAccountButton} activeOpacity={0.7}>
                    <View style={{ borderColor: "red", borderStyle: "solid" }}>
                        <Text style={{ color: "#dd392d", fontSize: 20, fontWeight: "700" }}>Delete account</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.updateProfileButton} activeOpacity={0.7}>
                    <View style={{ borderColor: "red", borderStyle: "solid" }}>
                        <Text style={{ fontSize: 20, fontWeight: "500", color: "black" }}>Update profile</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default SettingsScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        height: "100%"
    },
    deleteAccountButton: {
        width: "80%",
        alignItems: "center",
        padding: 15,
        borderColor: "red",
        borderWidth: 0.5,
        borderStyle: "solid",
        borderRadius: 50
    },
    updateProfileButton: {
        width: "80%",
        alignItems: "center",
        padding: 15,
        marginTop: 30,
        borderColor: "black",
        borderWidth: 0.5,
        borderStyle: "solid",
        borderRadius: 50

    }
})
