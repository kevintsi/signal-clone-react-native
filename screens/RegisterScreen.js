import { StatusBar } from 'expo-status-bar'
import React, { useLayoutEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Button, Input, Text } from "react-native-elements"
import { auth, storage } from '../firebase'
import LoadingScreen from './components/LoadingScreen'
import * as MediaLibrary from 'expo-media-library'
import * as ImagePicker from 'expo-image-picker';

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [profilePicture, setProfilePicture] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const register = async () => {
        try {
            setIsLoading(true)
            let authUser = await auth.createUserWithEmailAndPassword(email, password)
            authUser.user.updateProfile({
                displayName: name,
                photoURL: profilePicture || "https://avatarfiles.alphacoders.com/197/197662.jpg"
            })
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            alert(error.message)
            setIsLoading(false)
        }
    }

    const selectOneFile = async () => {
        console.log("Start profile picture...")
        /*
        let isPermGranted = (await MediaLibrary.getPermissionsAsync())
        if (isPermGranted != MediaLibrary.PermissionStatus.GRANTED) {
            isPermGranted = await MediaLibrary.requestPermissionsAsync();
        }
        if (isPermGranted.status != 'granted') {
            return;
        }
        */

        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);
        console.log(result);

        if (!result.cancelled) {
            setProfilePicture(result.uri);
            const storageRef = storage.ref("/image/")

            const response = await fetch(result.uri);
            const blob = await response.blob();
            const task = storageRef.put(blob)
            task.on('state_changed', taskSnapshot => {
                console.log(`${taskSnapshot.bytesTransferred} transferred 
                out of ${taskSnapshot.totalBytes}`);
            });
            task.then(() => {
                console.log('Image uploaded to the bucket!');
            });
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: "Back to login",
        })
    }, [navigation])

    return (
        <KeyboardAvoidingView style={styles.container}>
            {isLoading ? <LoadingScreen /> : null}
            <StatusBar style="light" />
            <Text h3 style={{ marginBottom: 50 }}>
                Create a Signal account
            </Text>
            <View style={styles.inputContainer}>
                <Input
                    placeholder="Full name"
                    autoFocus
                    type="text"
                    value={name}
                    onChangeText={(text) => { setName(text) }}
                />
                <Input
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChangeText={(text) => { setEmail(text) }}
                />
                <Input
                    placeholder="Password"
                    secureTextEntry
                    type="password"
                    value={password}
                    onChangeText={(text) => { setPassword(text) }}
                />
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={selectOneFile}>
                    <Text>
                        Select a profile picture from your gallery
                    </Text>
                </TouchableOpacity>
            </View>
            <Button
                containerStyle={styles.button}
                raised
                onPress={register}
                title="Register"
            />

            <View style={{ height: 10 }} />
        </KeyboardAvoidingView>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    button: {
        width: 200,
        marginTop: 10
    },
    inputContainer: {
        width: 300
    }

})