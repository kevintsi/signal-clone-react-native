import React, { useLayoutEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Input } from 'react-native-elements'
import Icon from "react-native-vector-icons/FontAwesome"
import { db } from '../firebase'
import LoadingScreen from './components/LoadingScreen'

const AddChatScreen = ({ navigation }) => {

    const [nameChat, setNameChat] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const createChat = async () => {
        try {
            setIsLoading(true)
            await db.collection("chats").add({
                name: nameChat
            })
            setIsLoading(false)
            navigation.goBack()
        } catch (error) {
            alert(error.message)
            setIsLoading(false)
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Add a new Chat",
            headerBackTitle: "Chats",

        })
    }, [navigation])

    return (
        <View style={styles.container}>
            {isLoading ? <LoadingScreen /> : null}
            <Input
                placeholder="Enter a chat name"
                value={nameChat}
                onChangeText={(text) => setNameChat(text)}
                leftIcon={
                    <Icon name="wechat" type="antdesign" size={24} color="black" />
                }
                onSubmitEditing={createChat}
            />
            <Button onPress={createChat} title="Create new chat" />
        </View>
    )
}

export default AddChatScreen

const styles = StyleSheet.create({
    container: {

    }
})
