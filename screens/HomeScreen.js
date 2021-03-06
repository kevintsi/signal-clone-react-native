import React, { useLayoutEffect, useState, useEffect } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Avatar } from 'react-native-elements'
import { auth, db } from '../firebase'
import CustomListItem from './components/CustomListItem'
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons"
import LoadingScreen from './components/LoadingScreen'

const HomeScreen = ({ navigation }) => {

    const [chats, setChats] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const enterChat = async (id, name) => {
        try {

            let participant = await db
                .collection("chats")
                .doc(id)
                .collection("participants")
                .where("userId", "==", auth.currentUser.uid)
                .get()

            //console.log(participant.docs.length)

            if (participant.docs.length == 0) {

                await db.collection("chats").doc(id).collection("participants").add({
                    userId: auth.currentUser.uid,
                    photoURL: auth.currentUser.photoURL,
                    displayName: auth.currentUser.displayName,
                    isWriting: false
                })
            }

            navigation.navigate("Chat", {
                id,
                name
            })
        } catch (error) {
            alert(error.message)
        }
    }

    const signOut = async () => {
        try {
            await auth.signOut()
            navigation.replace("Login")
        } catch (error) {
            alert(error.message)
        }
    }

    useEffect(() => {
        const unsubscribe = db.collection("chats").onSnapshot((snapshot) => {
            //console.log(`Chats : ${snapshot.docs}`)
            setIsLoading(true)
            setChats(snapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data()
            })))
            setIsLoading(false)
        })
        return unsubscribe
    }, [])

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Signal",
            headerStyle: { backgroundColor: "white" },
            headerTitleStyle: { color: "black" },
            headerTintColor: "black",
            headerLeft: () => (
                <View style={{ marginRight: 20 }}>
                    <TouchableOpacity onPress={signOut} activeOpacity={0.5}>
                        <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }} />
                    </TouchableOpacity>
                </View>
            ),
            headerRight: () => (
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: 100
                }}>
                    <TouchableOpacity activeOpacity={0.5}>
                        <AntDesign name="camerao" size={24} color="#dd392d" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { navigation.navigate("AddChat") }}
                        activeOpacity={0.5}
                    >
                        <SimpleLineIcons
                            name="pencil"
                            size={24}
                            color="#dd392d"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { navigation.navigate("Settings") }}
                        activeOpacity={0.5}
                    >
                        <SimpleLineIcons
                            name="settings"
                            size={24}
                            color="#dd392d"
                        />
                    </TouchableOpacity>
                </View>
            )
        })
    }, [navigation])

    return (
        <View>
            {isLoading ? <LoadingScreen /> : null}
            <ScrollView style={styles.container}>
                {chats.map(({ id, data: { name } }) => (
                    <CustomListItem key={id} id={id} chatName={name} enterChat={enterChat} />
                ))}
            </ScrollView>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        height: "100%"
    }
})
