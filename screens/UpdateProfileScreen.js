import React, { useEffect, useLayoutEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Button, Input } from 'react-native-elements'
import { Entypo } from '@expo/vector-icons';
import { auth, storage } from '../firebase'
import LoadingScreen from './components/LoadingScreen'
import * as ImagePicker from 'expo-image-picker';

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
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={pickProfilePicture}>
                    <Text>
                        {profilePicture != null ? "Picture chosen" : "Select a profile picture from your gallery"}
                        <Entypo name="attachment" size={24} color="black" />
                    </Text>

                </TouchableOpacity>
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
