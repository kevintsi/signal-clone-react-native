import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ListItem, Avatar } from "react-native-elements"
import { db } from '../../firebase'

const CustomListItem = ({ id, chatName, enterChat }) => {

    const [lastTalkingPerson, setLastTalkingPerson] = useState({})

    useEffect(() => {
        const unsubscribe = db
            .collection("chats")
            .doc(id)
            .collection("messages")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) => {
                setLastTalkingPerson({
                    photoURL: snapshot.docs[0]?.data().photoURL || "",
                    message: snapshot.docs[0]?.data().message || "",
                    displayName: snapshot.docs[0]?.data().displayName || ""
                })
            })
        return unsubscribe
    }, [])

    return (
        <ListItem onPress={() => enterChat(id, chatName)} key={id} bottomDivider>
            <Avatar
                rounded
                source={{
                    uri: lastTalkingPerson.photoURL
                }}
            />
            <ListItem.Content>
                <ListItem.Title style={{ fontWeight: "bold" }}>
                    {chatName}
                </ListItem.Title>
                <ListItem.Subtitle
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {lastTalkingPerson.displayName + " : " + lastTalkingPerson.message}
                </ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    )
}

export default CustomListItem

const styles = StyleSheet.create({})