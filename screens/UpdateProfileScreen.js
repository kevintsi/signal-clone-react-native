import React, { useEffect, useLayoutEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Input } from 'react-native-elements'
import { auth } from '../firebase'

const UpdateProfileScreen = ({ navigation }) => {
    const [displayName, setDisplayName] = useState("")
    const [email, setEmail] = useState("")
    const [photoURL, setPhotoURL] = useState("")

    const updateProfile = async () => {
        try {
            await auth.currentUser.updateProfile({
                displayName: displayName,
                photoURL: photoURL || "https://avatarfiles.alphacoders.com/197/197662.jpg"
            })
            await auth.currentUser.updateEmail(email)
            alert("Profile updated successfully")
        } catch (error) {
            alert(error.message)
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Update profile"
        })
    })

    useEffect(() => {
        setDisplayName(auth.currentUser.displayName)
        setEmail(auth.currentUser.email)
        setPhotoURL(auth.currentUser.photoURL)
    }, [])

    return (
        <View style={styles.container}>
            <Text style={{ textAlign: "center", fontSize: 25, fontWeight: "700", marginBottom: 30 }} >Update Profile</Text>
            <View style={{ margin: 10 }}>
                <View >
                    <Text>Display Name :</Text>
                    <Input placeholder="Enter your display name" value={displayName} onChangeText={(text) => setDisplayName(text)} />
                </View>
                <View>
                    <Text>Email :</Text>
                    <Input placeholder="Enter your email" value={email} onChangeText={(text) => setEmail(text)} />
                </View>
                <View>
                    <Text>Photo URL (optional) :</Text>
                    <Input placeholder="Enter the url to your photo" value={photoURL} onChangeText={(text) => setPhotoURL(text)} />
                </View>
                <Button onPress={updateProfile} title="Update" />
            </View>
        </View>
    )
}

export default UpdateProfileScreen

const styles = StyleSheet.create({
    container: {
        height: "100%",
        paddingTop: 20
    }
})
