import React, { useLayoutEffect, useState, useEffect } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Avatar } from 'react-native-elements'
import { auth, db } from '../firebase'
import CustomListItem from './components/CustomListItem'
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons"

const HomeScreen = ({ navigation }) => {

    const [chats, setChats] = useState([])

    const enterChat = (id, name) => {
        navigation.navigate("Chat", {
            id, 
            name
        })
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
                console.log(`Chats : ${snapshot.docs}`)
                setChats(snapshot.docs.map((doc) => ({
                    id : doc.id,
                    data : doc.data()
                })))
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
            headerRight : () => (
                <View style={{
                    flexDirection : "row",
                    justifyContent : "space-between",
                    width : 80,
                    marginRight : 20
                }}>
                    <TouchableOpacity activeOpacity={0.5}>
                        <AntDesign name="camerao" size={24} color="#dd392d" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => { navigation.navigate("AddChat")}} 
                        activeOpacity={0.5}
                    >
                        <SimpleLineIcons 
                            name="pencil" 
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
            <ScrollView style={styles.container}>
                {chats.map(({id, data : { name}}) => (
                    <CustomListItem key={id} id chatName={name} enterChat={enterChat} />
                ))}
            </ScrollView>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container : {
        height : "100%"
    }
})
