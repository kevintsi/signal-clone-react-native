import React, { useLayoutEffect } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Avatar } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'
import { auth } from '../firebase'
import CustomListItem from './components/CustomListItem'
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons"

const HomeScreen = ({ navigation }) => {

    const signOut = async () => {
        try {
            await auth.signOut()
            navigation.replace("Login")
        } catch (error) {
            alert(error.message)
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Signal",
            headerStyle: { backgroundColor: "white" },
            headerTitleStyle: { color: "black" },
            headerTintColor: "black",
            headerLeft: () => (
                <View style={{ marginRight: 20 }}>
                    <TouchableOpacity onPress={signOut} activeOpacity={0.5}>
                        <Avatar round source={{ uri: auth?.currentUser?.photoURL }} />
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
                        <AntDesign name="camerao" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => { navigation.navigate("AddChat")}} 
                        activeOpacity={0.5}
                    >
                        <SimpleLineIcons 
                            name="pencil" 
                            size={24} 
                            color="black"
                        />
                    </TouchableOpacity>
                </View>
            )
        })
    }, [navigation])
    return (
        <SafeAreaView>
            <ScrollView>
                <CustomListItem />
            </ScrollView>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({})
