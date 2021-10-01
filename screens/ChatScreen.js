import React, { useLayoutEffect } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Avatar } from 'react-native-elements'
import { AntDesign, Ionicons, FontAwesome} from "@expo/vector-icons"
import { StatusBar } from 'expo-status-bar'

const ChatScreen = ({navigation, route}) => {

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle : "Chats",
            headerTitle : () => (
                <View 
                style={{
                    flexDirection : "row",
                    alignItems : "center",
                }} >
                    <Avatar
                        source={{uri: "https://avatarfiles.alphacoders.com/197/197662.jpg"}}
                        rounded

                    />
                    <Text style={{ color : "white" , marginLeft:10, fontWeight: "700"}}>{route.params.name}</Text>
                </View>
            ),
            headerRight : () => (
                <View style={{
                    flexDirection : "row",
                    justifyContent : "space-between",
                    width : 70,
                    marginRight : 5
                }}>
                    <TouchableOpacity>
                        <FontAwesome name="video-camera" size={24} color="white"/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="call" size={24} color="white"/>
                    </TouchableOpacity>
                </View>
            )
        })
    }, [navigation])

    return (
        <View>
            <StatusBar style="light"/>
            <KeyboardAvoidingView 
                behavior={Platform.OS == "ios" ? "padding" : "height"}
                style={styles.container}
                keyboardVerticalOffset={90}
            >
            </KeyboardAvoidingView>
        </View>
    )
}

export default ChatScreen

const styles = StyleSheet.create({
    container : {
        
    }
})
