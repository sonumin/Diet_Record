import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import React, { useContext, useEffect, useState } from 'react';
import AppContext from './AppContext';
import { useQueries, useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

const SendScreen=()=>{
    const {userID, setValue} = useContext(AppContext)

    const [name, setName] = useState();
    const [height, setHeight] = useState();
    const [weight, setWeight] = useState();
    const [kcal, setKcal] = useState();
    const [carbo, setCarbo] = useState();
    const [protein, setProtein] = useState();
    const [fat, setFat] = useState();
    const [userProfile, setUserProfile] = useState();
    const navigation = useNavigation();
    const toHomeScreen = () =>{
        navigation.replace('Splash')
    }
    const userData = useQuery(['userData'], async () => { 
        return await axios.get(`http://121.174.150.180:50001/userData2/${userID}`,{
            // query URL without using browser cache
            headers: {
                'Cache-Control': 'no-cache',
            },
        })
        .then((res)=> res.data)
    },
    {
        onSuccess: (data) =>{
            console.log(data)
            setUserProfile(data)
        },
    });
    const updateUser = async () =>{
        const form = {
            id: userID,
            name: name,
            height: height,
            weight: weight,
            kcal: kcal,
            carbo: carbo,
            protein: protein,
            fat: fat
        }
        await axios
        .post(`http://121.174.150.180:50001/updateUserData/${userID}`,JSON.stringify(form),{
            headers: {
              'content-type': 'application/json',
            },
            responseType: 'json'
        }).then((res) => res.data)
        toHomeScreen()
    }
    return(
        userProfile&&
        <View style={styles.screen}>
            <View style={styles.firstContainer}>
                <View style={styles.textBoxContainer}>
                    <View style={styles.textBoxRow}>
                        <Text style={styles.textCon}>이름 :</Text>
                        <TextInput style={styles.textBox}
                            placeholder={userProfile['name']}
                            onChangeText={val=>{
                                setName(val);
                            }}
                        />
                    </View>
                    <View style={styles.textBoxRow}>
                        <Text style={styles.textCon}>키 :</Text>
                        <TextInput style={styles.textBox}
                            placeholder={userProfile['height'].toString()}
                            onChangeText={val=>{
                                setHeight(val);
                            }}
                        />
                    </View>
                    <View style={styles.textBoxRow}>
                        <Text style={styles.textCon}>몸무게 :</Text>
                        <TextInput style={styles.textBox}
                            placeholder={userProfile['weight'].toString()}
                            onChangeText={val=>{
                                setWeight(val);
                            }}
                        />
                    </View>
                    <View style={styles.textBoxRow}>
                        <Text style={styles.textCon}>칼로리 :</Text>
                        <TextInput style={styles.textBox}
                            placeholder={userProfile['kcal'].toString()}
                            onChangeText={val=>{
                                setKcal(val)
                            }}
                        />
                    </View>
                    <View style={styles.textBoxRow}>
                        <Text style={styles.textCon}>탄수화물 :</Text>
                        <TextInput style={styles.textBox}
                            placeholder={userProfile['carbo'].toString()}
                            onChangeText={val=>{
                                setCarbo(val);

                            }}
                        />
                    </View>
                    <View style={styles.textBoxRow}>
                        <Text style={styles.textCon}>단백질 :</Text>
                        <TextInput style={styles.textBox}
                            placeholder={userProfile['protein'].toString()}
                            onChangeText={val=>{
                                setProtein(val);
                            }}
                        />
                    </View>
                    <View style={styles.textBoxRow}>
                        <Text style={styles.textCon}>지방 :</Text>
                        <TextInput style={styles.textBox}
                            placeholder={userProfile['fat'].toString()}
                            onChangeText={val=>{
                                setFat(val);
                            }}
                        />
                    </View>
                </View>
              
            
            </View>
            <View style={styles.secondContainer}>
                <Pressable style={styles.button} onPress={updateUser}>
                    <Icon name="save" size={24} color="#ffffff" />
                </Pressable>
            </View>
        </View>
    )
}
export default SendScreen;

const styles = StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: 'white',
    },
    firstContainer:{
        width:'100%',
        height:'80%',
        alignItems: 'center',
        justifyContent:'center',
    },
    textBoxContainer:{
        width:'88%',
        height:'100%',
        alignItems:'center',
        justifyContent:'center',
    },
    textBoxRow:{
        flexDirection:'row',
        width:'88%',
        height:'14%',
        alignItems:'center',
    },
    textCon:{
        width:'38%',
        height:'25%',
        textAlign:'center',
        fontSize:18
    },
    textBox:{
        borderWidth:1,
        width:'50%',
        height:'40%',
        borderRadius: 5,
        textAlign:'center'
    },
    secondContainer:{
        width:'100%',
        height:'20%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button:{
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 10,
        elevation: 3,
        backgroundColor: '#000',
        bored:'2',
        shadowColor: "#000",
        shadowOffset: {
          width: 5,
          height: 5,
        },
        shadowOpacity: 0.5,
        shadowRadius: 6,
        width:'24%',
        height:'40%'
    },
})