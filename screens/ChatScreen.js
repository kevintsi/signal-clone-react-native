import React, { useLayoutEffect, useState } from 'react'
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { Avatar } from 'react-native-elements'
import { Ionicons, FontAwesome } from "@expo/vector-icons"
import { StatusBar } from 'expo-status-bar'
import { auth, db } from '../firebase'
import * as firebase from "firebase"
import { useScrollToTop } from '@react-navigation/native'

const ChatScreen = ({ navigation, route }) => {
    const [inputMessage, setInputMessage] = useState("")
    const [messages, setMessages] = useState([])

    const sendMessage = async () => {
        Keyboard.dismiss()
        try {
            await db.collection("chats").doc(route.params.id).collection("messages").add({
                timestamp: firebase.default.firestore.FieldValue.serverTimestamp(),
                message: inputMessage,
                displayName: auth.currentUser.displayName,
                email: auth.currentUser.email,
                photoURL: auth.currentUser.photoURL
            })
            setInputMessage("")
        } catch (error) {
            alert(error.message)
        }

    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: "Chats",
            headerTitle: () => (
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                    }} >
                    <Avatar
                        source={{ uri: messages[messages.length - 1]?.data.photoURL }}
                        rounded
                    />
                    <Text style={{ color: "white", marginLeft: 10, fontWeight: "700" }}>{route.params.name}</Text>
                </View>
            ),
            headerRight: () => (
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: 70,
                    marginRight: 5
                }}>
                    <TouchableOpacity>
                        <FontAwesome name="video-camera" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="call" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            )
        })
    }, [navigation, messages])

    useLayoutEffect(() => {
        const unsubscribe = db
            .collection("chats")
            .doc(route.params.id)
            .collection("messages")
            .orderBy('timestamp', "asc")
            .onSnapshot((snapshot) => {
                snapshot.docs.map(doc => {
                    console.log(doc.data().timestamp)
                })
                setMessages(
                    snapshot.docs.map(doc => ({
                        id: doc.id,
                        data: doc.data()
                    }))
                )
            })

        return unsubscribe
    }, [route])

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <StatusBar style="light" />
            <KeyboardAvoidingView
                style={styles.container}
                keyboardVerticalOffset={90}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                    <>
                        <ScrollView contentContainerStyle={{
                            paddingTop: 15,
                        }}
                        >
                            {messages.map(({ id, data }) =>
                                data.email === auth.currentUser.email ? (
                                    <View key={id} style={styles.reciever}>
                                        <Avatar
                                            size={30}
                                            source={{ uri: data.photoURL }}
                                            rounded
                                            // WEB
                                            containerStyle={{
                                                position: "absolute",
                                                bottom: -15,
                                                right: -5
                                            }}
                                            position="absolute"
                                            bottom={-15}
                                            right={-5}
                                        />
                                        <Text style={styles.recieverText}>{data.message}</Text>
                                    </View>
                                ) : (
                                    <View key={id} style={styles.sender}>
                                        <Avatar
                                            source={{ uri: data.photoURL }}
                                            rounded
                                            // WEB
                                            containerStyle={{
                                                position: "absolute",
                                                bottom: -15,
                                                left: -5
                                            }}
                                            position="absolute"
                                            bottom={-15}
                                            left={-5}
                                        />
                                        <Text style={styles.senderText}>{data.message}</Text>
                                        <Text style={styles.senderName}>{data.displayName}</Text>
                                    </View>
                                )
                            )}
                        </ScrollView>
                        <View style={styles.footer}>
                            <TextInput
                                value={inputMessage}
                                onChangeText={(text) => setInputMessage(text)}
                                placeholder="Signal Message" style={styles.inputMessage}
                                onSubmitEditing={sendMessage}
                            />
                            <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
                                <Ionicons name="send" size={24} color="#dd392d" />
                            </TouchableOpacity>
                        </View>
                    </>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </View>
    )
}

export default ChatScreen

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        height: "100%"
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        padding: 15,
    },
    inputMessage: {
        bottom: 0,
        height: 40,
        flex: 1,
        marginRight: 15,
        borderColor: "transparent",
        backgroundColor: "#ECECEC",
        borderWidth: 1,
        padding: 10,
        color: "grey",
        borderRadius: 30
    },
    sender: {
        padding: 15,
        backgroundColor: "#dd392d",
        alignSelf: "flex-start",
        borderRadius: 20,
        margin: 15,
        maxWidth: "80%",
        position: "relative"
    },
    reciever: {
        padding: 15,
        backgroundColor: "#ECECEC",
        alignSelf: "flex-end",
        borderRadius: 20,
        marginRight: 15,
        marginBottom: 20,
        maxWidth: "80%",
        position: "relative"
    },
    senderName: {
        left: 10,
        paddingRight: 10,
        fontSize: 10,
        color: "white"
    },
    senderText: {
        color: "black",
        fontWeight: "500",
        marginLeft: 10,
        marginBottom: 15
    },
    recieverText: {
        color: "black",
        fontWeight: "500",
        marginLeft: 10,
        marginBottom: 15
    }
})
