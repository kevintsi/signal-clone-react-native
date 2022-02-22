import React, { useEffect, useLayoutEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import { Button, Avatar, Input } from 'react-native-elements'
import { auth, storage } from '../firebase'
import LoadingScreen from './components/LoadingScreen'
import * as ImagePicker from 'expo-image-picker';
import { Entypo } from '@expo/vector-icons'

const UpdateProfileScreen = ({ navigation }) => {
    const [displayName, setDisplayName] = useState("")
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [profilePicture, setProfilePicture] = useState(null)

    const updateProfile = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(profilePicture.uri);
            const blob = await response.blob();
            const storageRef = storage.ref()
            var imageRef = storageRef.child(`images/${auth.currentUser.uid}/profilePicture`)

            const task = imageRef.put(blob)

            task.on('state_changed',
                (taskSnapshot) => {
                    console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
                }, (error) => {
                    console.log("Error when uploading profile picture")
                    console.log(error)
                    setIsLoading(false)
                }, () => {

                    console.log('Image uploaded to the bucket!');
                    task.snapshot.ref.getDownloadURL().then(url => {

                        console.log("FULL PATH :" + url)

                        auth.currentUser.updateProfile({
                            displayName: displayName,
                            photoURL: url || "https://avatarfiles.alphacoders.com/197/197662.jpg"
                        }).then(() => {
                            auth.currentUser.updateEmail(email).then(() => {
                                alert("Profile updated successfully")
                                setIsLoading(false)
                            })

                            setIsLoading(false)
                        })
                    })
                })

        } catch (error) {
            alert(error.message)
            setIsLoading(false)
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Update profile"
        })
    })

    const pickProfilePicture = async () => {
        console.log("Start profile picture...")

        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            setProfilePicture(result);
        }
    };

    useEffect(() => {
        setDisplayName(auth.currentUser.displayName)
        setEmail(auth.currentUser.email)
        setProfilePicture(auth.currentUser.photoURL)
    }, [])

    return (
        <View style={styles.container}>
            {isLoading ? <LoadingScreen /> : null}
            <View style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <TouchableOpacity
                    style={styles.profilePicture}
                    activeOpacity={0.5}
                    onPress={pickProfilePicture}>
                    <Avatar size={150} rounded source={{ uri: profilePicture }} />
                    <Entypo name="pencil" size={30} color="#dd392d" style={{ position: "absolute", left: 120 }} />
                </TouchableOpacity>
            </View>
            <View style={{ margin: 10, marginTop: 50, borderWidth: 0, width: "80%", display: "flex", alignItems: "flex-start" }}>
                <Text style={{ fontSize: 20, fontWeight: "bold", paddingLeft: 0 }}>Display Name :</Text>
                <Input containerStyle={styles.input} placeholder="Enter your display name" value={displayName} onChangeText={(text) => setDisplayName(text)} />
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Email :</Text>
                <Input containerStyle={styles.input} placeholder="Enter your email" value={email} onChangeText={(text) => setEmail(text)} />
                <Button buttonStyle={styles.updateBtn} onPress={updateProfile} title="Update" />
            </View>
        </View >
    )
}

export default UpdateProfileScreen

const styles = StyleSheet.create({
    container: {
        height: "100%",
        paddingTop: 20,
        backgroundColor: "white",
        display: "flex",
        alignItems: "center"
    },
    profilePicture: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
    },
    updateBtn: {
        marginLeft: 120
    },
    updateBtnContainer: {
        display: "flex",
        borderWidth: 1,
        alignItems: "center",
        width: 100
    },
    input: {
        borderWidth: 0,
        paddingLeft: 0,
        paddingRight: 0
    }
})
