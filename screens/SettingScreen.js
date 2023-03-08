import { React, useState, useEffect, useContext} from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import { View,Text, StyleSheet, Image, TouchableOpacity, ActionSheetIOS, Button, Alert ,Dimensions,ScrollView} from 'react-native';
import axios from 'axios';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth'
import AppContext from './AppContext';
import {
    QueryClient,
} from '@tanstack/react-query'
import { LogBox } from 'react-native';
import ImageModal from 'react-native-image-modal';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications
const {width,height} = Dimensions.get('window')
const SettingScreen = () =>{

    const {userID, setValue} = useContext(AppContext)
    const [ID, setID] = useState();
    const getID = async () =>{
        const id = await AsyncStorage.getItem('userID')
        if(id){
            setID(id)
        }
    }
    useEffect(()=>{
        getID();
    }, [])
    const [userProfile, setUserProfile] = useState();
    const [profileImg, setProfileImg] = useState('/Users/jongsik2/Desktop/RN/RN_food_google_last/egg-bread.png');
    const [nineImages, setNineImages] = useState();
    const imgArray = []
    const imagesData = useQuery(['9Image'], async () => {
        return await axios.get(`http://121.174.150.180:50001/load9Images/${userID}`,{
            // query URL without using browser cache
            headers: {
                'Cache-Control': 'no-cache',
            },
        })
        .then((res)=> res.data)
    },
    {
        onSuccess: (data) =>{
            divideImages(data)
        },
    });
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
            setUserProfile(data)
        },
    });
    const divideImages = (data) =>{
        for(let i = 0; i < 9; i++){
            imgArray[i] = data[i]['image_data']
        }
        setNineImages(imgArray)
    }
    
    const NineImages = () => {
        const {width,height} = Dimensions.get('window')
        return(
            nineImages&&
            <View style={styles.secondContainer}>
                <View  style={styles.imageRow}>
                    {nineImages[0] === ' ' ? <Image style={styles.imageBox2} source={{uri:`${nineImages[0]}`}}></Image> : 
                    <ImageModal swipeToDismiss={false} modalImageResizeMode = {'contain'} style={styles.imageBox2} source={{uri:`${nineImages[0]}`}}/>}
                    {nineImages[1] === ' ' ? <Image style={styles.imageBox2} source={{uri:`${nineImages[1]}`}}></Image> : 
                    <ImageModal swipeToDismiss={false} modalImageResizeMode = {'contain'} style={styles.imageBox2} source={{uri:`${nineImages[1]}`}}/>}
                    {nineImages[2] === ' ' ? <Image style={styles.imageBox2} source={{uri:`${nineImages[2]}`}}></Image> : 
                    <ImageModal swipeToDismiss={false} modalImageResizeMode = {'contain'} style={styles.imageBox2} source={{uri:`${nineImages[2]}`}}/>}
                </View>
                <View style={styles.imageRow}>
                    {nineImages[3] === ' ' ? <Image style={styles.imageBox2} source={{uri:`${nineImages[3]}`}}></Image> : 
                    <ImageModal swipeToDismiss={false} modalImageResizeMode = {'contain'} style={styles.imageBox2} source={{uri:`${nineImages[3]}`}}/>}
                    {nineImages[4] === ' ' ? <Image style={styles.imageBox2} source={{uri:`${nineImages[4]}`}}></Image> : 
                    <ImageModal swipeToDismiss={false} modalImageResizeMode = {'contain'} style={styles.imageBox2} source={{uri:`${nineImages[4]}`}}/>}
                    {nineImages[5] === ' ' ? <Image style={styles.imageBox2} source={{uri:`${nineImages[5]}`}}></Image> : 
                    <ImageModal swipeToDismiss={false} modalImageResizeMode = {'contain'} style={styles.imageBox2} source={{uri:`${nineImages[5]}`}}/>}
                </View>
                <View style={styles.imageRow}>
                    {nineImages[6] === ' ' ? <Image style={styles.imageBox2} source={{uri:`${nineImages[6]}`}}></Image> : 
                    <ImageModal swipeToDismiss={false} modalImageResizeMode = {'contain'} style={styles.imageBox2} source={{uri:`${nineImages[6]}`}}/>}
                    {nineImages[7] === ' ' ? <Image style={styles.imageBox2} source={{uri:`${nineImages[7]}`}}></Image> : 
                    <ImageModal swipeToDismiss={false} modalImageResizeMode = {'contain'} style={styles.imageBox2} source={{uri:`${nineImages[7]}`}}/>}
                    {nineImages[8] === ' ' ? <Image style={styles.imageBox2} source={{uri:`${nineImages[8]}`}}></Image> : 
                    <ImageModal swipeToDismiss={false} modalImageResizeMode = {'contain'} style={styles.imageBox2} source={{uri:`${nineImages[8]}`}}/>}
                </View>
            </View>
        );
    }
    const actionSheet = () =>{
        ActionSheetIOS.showActionSheetWithOptions(
            {
              options: ["카메라로 촬영하기", "사진 선택하기", "취소"],
              cancelButtonIndex: 2,
            },
            (buttonIndex) => {
              if (buttonIndex === 0) {
                openCamera();
              } else if (buttonIndex === 1) {
                showImagePicker();
              }
            },
        )
    }
    const openCamera = async () =>{
        const result = await launchCamera()
    }
    const showImagePicker = async () =>{
        const result = await launchImageLibrary()
        if(result.didCancel){
        }else{
            setProfileImg(result.assets[0].uri)
        }
    }
    const navigation= useNavigation();
    const toSettingScreen =() => {
        navigation.navigate("Send")
    }
    const logOut = async () => {
        const queryClient = new QueryClient()
        await queryClient.invalidateQueries()
        setValue('null')
        await auth().signOut()
        await AsyncStorage.removeItem('userID')
        navigation.replace("Splash")
        Alert.alert("로그아웃 되었습니다.")
    }
    return(
        nineImages&&
        userProfile&&
        <View style={styles.screen}>
            <View style={styles.firstContainer}>
                <View style={styles.profileContainer}>
                    <View style={styles.profile}>
                        <TouchableOpacity style={styles.profileImageContainer} onPress={actionSheet}>
                            {profileImg&&<Image style={styles.profileImage}source={{ uri: profileImg }}/>}
                        </TouchableOpacity>

                        <View style={styles.profileName}>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.button} onPress={toSettingScreen}>
                                    <Icon name="settings-outline" size={22} color="#000000" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button2} onPress={logOut}>
                                    {/* <Text>logOut</Text> */}
                                    <Icon name="exit-outline" size={24} color="#000000" />
                                </TouchableOpacity>
                            </View>    
                            <Text style={styles.userLable}>안녕하세요 {userProfile['name']}님!</Text>
                        </View>
                    </View>
                    <View style={styles.goalContainer}>
                        <Text style={styles.goalText}>키 : {userProfile['height']}  몸무게 : {userProfile['weight']}</Text>
                        <Text style={styles.goalText}></Text>
                        <Text style={styles.goalText}>목표 칼로리 : {userProfile['kcal']}</Text>
                        <Text style={styles.goalText}>목표 탄수화물 : {userProfile['carbo']}</Text>
                        <Text style={styles.goalText}>목표 단백질 : {userProfile['protein']}</Text>
                        <Text style={styles.goalText}>목표 지방 : {userProfile['fat']}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.history}>
                <Text style={{fontSize:22}}>History</Text>
            </View>
            <NineImages/>
        </View>
    )
}

export default SettingScreen;

const styles=StyleSheet.create({
    screen:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: 'white',
    },
    firstContainer:{
        width: '100%',
        height: '45%',
        alignItems:'center',
        justifyContent:'center',
    },    
    profileContainer:{
        width:'88%',
        height:'85%',
        borderRadius: 16,
        backgroundColor:'#ffffff',
        shadowColor: "#000",
          shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },
    profile:{
        width:'100%',
        height:'40%',
        flexDirection:'row',

    },
    profileImageContainer:{
        width:'35%',
        height:'90%',
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row',
        padding:'2%'
    },
    profileImage:{
        marginTop:'15%',
        width:'100%',
        height:'100%',
        resizeMode:'cover',
        borderRadius:70,
    },
    profileName:{
        width:'65%',
        height:'100%',
        alignItems:'center',
        paddingTop:'3%'
    },
    buttonContainer:{
        flexDirection:'row',
        justifyContent:'flex-end',
        width:'90%'
    },
    userLable:{
        width:'85%',
        height:'30%',
        marginTop:'5%',
        marginLeft:'5%',    
        fontSize:23,
    },
    goalContainer:{
        width:'100%',
        height:'60%',
        justifyContent:'space-around',
        padding:'5%'
    },
    goalText:{
        fontSize:17
    },
    history:{
        width: '90%',
        height: '5%'
    },
    secondContainer:{
        width: '90%',
        height: '50%',
    },
    imageRow:{
        width: '100%',
        height:'33%',
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
        flexDirection: 'row',
    },
    imageBox:{
      width: '30%',
      height:'90%',
      marginRight:'1%',
      marginTop:'1%',
      marginBottom:'1%',
      marginLeft:'1%',
      borderRadius:8
    },
    imageBox2:{
        width: width*0.9*0.3,
        height:height*0.5*0.33*0.74,
        marginRight:'1%',
        marginTop:'1%',
        marginBottom:'1%',
        marginLeft:'1%',
        borderRadius:8
      },
    button:{
        marginRight:'5%'
    },
    button2:{
        justifyContent:'center'
    }
})