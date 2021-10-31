import { StatusBar } from 'expo-status-bar'
import React, { useState, useEffect } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native'
import { Button, Input, Image } from "react-native-elements"
import { auth } from '../firebase'
import LoadingScreen from './components/LoadingScreen'

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const signIn = async () => {
        try {
            setIsLoading(true)
            await auth.signInWithEmailAndPassword(email, password)
            setIsLoading(false)
        } catch (error) {
            alert(error.message)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            //console.log(user)
            if (user) {
                navigation.replace("Home")
            }
        })
        return unsubscribe
    }, [])
    return (
        <KeyboardAvoidingView style={styles.container}>
            {isLoading ? <LoadingScreen /> : null}
            <StatusBar style="light" />
            <Image
                source={require("../assets/signal-logo.png")}
                style={{ width: 150, height: 150 }}
            />
            <View style={styles.inputContainer}>
                <Input
                    placeholder="Email"
                    autoFocus type="email"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                />
                <Input
                    placeholder="Password"
                    type="password"
                    secureTextEntry
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    onSubmitEditing={signIn}
                />
            </View>
            <Button
                containerStyle={styles.button}
                title="Login"
                onPress={signIn}
            />
            <Button
                containerStyle={styles.button}
                type="outline"
                title="Register"
                onPress={() => navigation.navigate("Register")}
            />
            <View style={{ height: 20 }} />
        </KeyboardAvoidingView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    inputContainer: {
        width: 300,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    button: {
        width: 200,
        marginTop: 10
    }
})
