import React, { useLayoutEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Input } from 'react-native-elements'
import Icon from "react-native-vector-icons/FontAwesome"
import { db } from '../firebase'

const AddChatScreen = ({ navigation }) => {

    const [nameChat, setNameChat] = useState("")

    const createChat = async () => {
        try {
            await db.collection("chats").add({
                name : nameChat
            })
            navigation.goBack()
        } catch (error) {
            alert(error.message)
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title : "Add a new Chat",
            headerBackTitle : "Chats",

        })
    }, [navigation])
    return (
        <View style={styles.container}>
            <Input
             placeholder="Enter a chat name" 
             value={nameChat} 
             onChangeText={(text) => setNameChat(text)}
             leftIcon={
                 <Icon name="wechat" type="antdesign" size={24} color="black"/>
             }
             onSubmitEditing={createChat}
             />
             <Button onPress={createChat} title="Create new chat"/>
        </View>
    )
}

export default AddChatScreen

const styles = StyleSheet.create({
    container : {

    }
})
