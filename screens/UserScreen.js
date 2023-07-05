import { React, useState, useEffect, useContext} from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import { View,Text, StyleSheet, Image, TouchableOpacity, ActionSheetIOS, Button, Alert ,Dimensions,ScrollView,SafeAreaView,StatusBar} from 'react-native';
import axios from 'axios';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {LineChart,ProgressChart} from "react-native-chart-kit";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth'
import AppContext from './AppContext';
import RNFS from 'react-native-fs';
import {
    QueryClient,
} from '@tanstack/react-query'
import { LogBox } from 'react-native';
import ImageModal from 'react-native-image-modal';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications
const {width,height} = Dimensions.get('window')
const viewcolor = '#ffffff'


const UserScreen = () => {
    const [name, setName] = useState();
    const [age, setAge] = useState();
    const [userHeight, setUserHeight] = useState();
    const [weight, setWeight] = useState();
    const [kcal, setKcal] = useState();
    const [carbo, setCarbo] = useState();
    const [protein, setProtein] = useState();
    const [fat, setFat] = useState();
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedActivity, setSelectedActivity] = useState('');
    
    const {userID, setValue} = useContext(AppContext)
    const [ID, setID] = useState();
    const weekArray = [[],[],[],[],[]]
    const [weekData, setWeekData] = useState();
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
    const divide = (data) => {
        // console.log(data.image)
        setName(data.name)
        if(data.image != ' '){
            setProfileImg("data:image/jpeg;base64,"+ data.image)
        }else{
            setProfileImg('/Users/jongsik2/Desktop/RN/RN_food_google_last/egg-bread.png')
        }
        setAge(data.age)
        setUserHeight(data.height)
        setWeight(data.weight)
        setSelectedGender(data.sex)
        setSelectedActivity(data.activity)
        setKcal(data.kcal)
        setCarbo(data.carbo)
        setProtein(data.protein)
        setFat(data.fat)
    };
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
    const weekDat = useQuery(['weekData'], async () =>{
        return await axios.get(`http://1.176.185.164:5000/weekData2/${userID}`,{
            // query URL without using browser cache
            headers: {
                'Cache-Control': 'no-cache',
            },
        }).then((res)=> res.data)
    },
    {
        onSuccess: (data) =>{
            // console.log(1, data)

            convertWeek(data)
            setWeekData(weekArray);
        }
    }
    );
    const userData = useQuery(['userData'], async () => { 
        return await axios.get(`http://1.176.185.164:5000/userData2/${userID}`,{
            // query URL without using browser cache
            headers: {
                'Cache-Control': 'no-cache',
            },
        })
        .then((res)=> res.data)
    },
    {
        onSuccess: (data) =>{
            divide(data)
        },
    });
    const openCamera = async () =>{
        const result = await launchCamera()
    }
    const showImagePicker = async () =>{
        const result = await launchImageLibrary()
        if(result.didCancel){
        }else{
            const base64Data = await RNFS.readFile(result.assets[0].uri, 'base64');
            await axios.post(`http://1.176.185.164:5000/updateProfileImage/${userID}`,JSON.stringify({
                image: base64Data
            }),
            {
                headers: {
                    'content-type': 'application/json',
                },
                responseType: 'json'
            })
            .catch((err) => {
                Alert.alert('이미지를 선택해 주세요.')
            });
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
    const convertWeek = (data) =>{
        for(let i = 0; i < data.length; i++){
            weekArray[0][i] = data[i]['date'].substring(5,)
            weekArray[1][i] = data[i]['kcal']
            weekArray[2][i] = data[i]['carbo']
            weekArray[3][i] = data[i]['fat']
            weekArray[4][i] = data[i]['protein']
        }
        for(let i = data.length; i < 7; i++){
            weekArray[0][i] = ' '
            weekArray[1][i] = 0
            weekArray[2][i] = 0
            weekArray[3][i] = 0
            weekArray[4][i] = 0
        }
    }
    return(
        // <View>
        //     <Text>asdf</Text>
        //     <Text>asdf</Text>
        //     <Text>asdf</Text>
        //     <Text>asdf</Text>
        //     <Button title='asdf' onPress={logOut}>
        //         asd
        //     </Button>
        // </View>
        name&&weekData&&
        <View style={styles.screen}>
            <StatusBar barStyle="light-content" />
            {/* <View style = {{width:width*0.95,height:'25%' ,backgroundColor:'#15161E',borderRadius:8,marginTop:'15%'}}>
                <View style = {{width:'100%',height:'70%',flexDirection:'row',backgroundColor:'red'}}>
                    <View style = {{width:'40%',height:'95%',borderWidth:1,borderColor:'grey',borderRadius:8}}>
                        <TouchableOpacity  onPress={actionSheet}>
                            {profileImg&&<Image style={{width:'100%',height:'100%',resizeMode:'contain'}} source={{ uri: profileImg }}/>}
                        </TouchableOpacity>
                    </View>
                    <View style = {{width:'30%',height:'30%',marginLeft:'30%',flexDirection:'row',justifyContent:'flex-end'}}>
                        <TouchableOpacity style={{marginRight:'4%'}} onPress={toSettingScreen}>
                            <Icon name="settings-outline" size={22} color='#ECEBF2' />
                        </TouchableOpacity>
                        <TouchableOpacity style={{marginRight:'4%'}} onPress={logOut}>
                            <Icon name="exit-outline" size={24} color='#ECEBF2' />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style = {{width:'100%',height:'50%'}}>
                    <Text style={{fontSize:28,marginLeft:'5%',color:'#ECEBF2',marginTop:'4%'}}>{name}</Text>
                </View>
            </View> */}
            {/* <View style = {{width:width*0.95,height:'20%',borderRadius:8,backgroundColor:'#15161E'}}>
                <View style={{width:'100%',height:'50%',flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
                    <View>
                        <Text style={{fontSize:13,color:'#ECEBF2'}}>height : {userHeight}cm</Text><Text style={{fontSize:13,color:'#ECEBF2'}}>weight: {weight}kg</Text>
                    </View>
                    <View>
                        <Text style={{fontSize:13,color:'#ECEBF2'}}>성별 : {selectedGender}</Text><Text style={{fontSize:13,color:'#ECEBF2'}}>활동량: {selectedActivity}</Text>
                    </View>
                </View>
                <View style={{width:'100%',height:'50%',flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
                    <Text style={{fontSize:13,color:'#ECEBF2'}}>kcal : {kcal}</Text>
                    <Text style={{fontSize:13,color:'#ECEBF2'}}>carbo : {carbo}</Text>
                    <Text style={{fontSize:13,color:'#ECEBF2'}}>protein : {protein}</Text>
                    <Text style={{fontSize:13,color:'#ECEBF2'}}>fat : {fat}</Text>
                </View>
            </View> */}
            <View style={{width: width *0.95,height:'45%',backgroundColor:'#15161E',marginTop:'15%',alignItems:'center',borderRadius:10}}>
                    <View style={{width:'100%',height:'13%',flexDirection:'row'}}>
                        <View  style={{width:'40%',height:'100%',justifyContent:'center'}}>
                            <Text style={{color:'white',fontSize:20,marginLeft:'5%'}}>마이페이지</Text>
                        </View>
                        <View  style={{width:'60%',height:'100%',flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                            <TouchableOpacity style={{marginRight:'6%'}} onPress={toSettingScreen}>
                                <Icon name="settings-outline" size={22} color='#ECEBF2' />
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginRight:'6%'}} onPress={logOut}>
                                <Icon name="exit-outline" size={24} color='#ECEBF2' />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{width:'97%',height:'70%',alignItems:'center',borderRadius:16,backgroundColor:'#2C2D3A'}}>
                        <View style={{width:'90%',height:'60%',alignItems:'center',borderBottomWidth:1,borderBottomColor:'grey',flexDirection:'row'}}>
                            <View style={{width:'63%',height:'90%',justifyContent:'center'}}>
                                <Text style={{fontSize:28,marginLeft:'5%',color:'#ECEBF2',marginTop:'4%'}}>{name} 님</Text>
                            </View>
                            <View style={{width:'37%',height:'80%',borderWidth:1,borderColor:'grey',borderRadius:90}}>
                                <TouchableOpacity  onPress={actionSheet}>
                                    {profileImg&&<Image style={{width:'100%',height:'100%',resizeMode:'cover',borderRadius:90}} source={{ uri: profileImg }}/>}
                                </TouchableOpacity>
                            </View>        
                        </View>
                        <View style={{width:'90%',height:'20%',flexDirection:'row',justifyContent:'space-around'}}>
                                <Text style={{fontSize:14,color:'#ECEBF2',marginTop:'8%'}}>키 : {userHeight}cm</Text>
                                <Text style={{fontSize:14,color:'#ECEBF2',marginTop:'8%'}}>몸무게: {weight}kg</Text>
                        </View>
                        <View style={{width:'90%',height:'20%',flexDirection:'row',justifyContent:'space-around'}}>
                        <Text style={{fontSize:14,color:'#ECEBF2'}}>성별 : {selectedGender}</Text>
                        <Text style={{fontSize:14,color:'#ECEBF2'}}>활동량: {selectedActivity}</Text>
                        </View>
                    </View>
                    <View style={{width:'100%',height:'10%',flexDirection:'row',justifyContent:'space-around',marginTop:'3%'}}>
                        <Text style={{fontSize:14,color:'#ECEBF2',borderRightWidth:1}}>칼로리 : {kcal}</Text>
                        <Text style={{fontSize:14,color:'#ECEBF2'}}>탄수화물 : {carbo}</Text>
                        <Text style={{fontSize:14,color:'#ECEBF2'}}>단백질 : {protein}</Text>
                        <Text style={{fontSize:14,color:'#ECEBF2'}}>지방 : {fat}</Text>
                    </View>
                </View>
                <View style = {{width:width*0.95,height:'40%',backgroundColor:'#15161E',borderRadius:10}}> 
                <LineChart
                        data={{
                            labels: weekData[0],
                            datasets: [
                                {
                                data: weekData[1]
                                }
                            ],
                            legend:['  kcal']
                        }}
                        width={width*0.95} 
                        // from react-native
                        height={height*0.30}
                        withInnerLines={false}
                        chartConfig={{
                        backgroundColor: '#15161E',
                        backgroundGradientFrom: '#15161E',
                        backgroundGradientTo: '#15161E',
                        decimalPlaces: 0, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(243, 243, 244, ${opacity})`,
                        labelColor: (opacity = 1) =>  `rgba(243, 243, 244, ${opacity})`,
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: "#d7e5fc"
                        }
                        }}
                        bezier
                        style={{
                            marginTop:'5%',
                            // borderRadius: 16,
                            // shadowColor: "#000",
                            // shadowOffset: {
                            //   width: 5,
                            //   height: 5,
                            // },
                            // shadowOpacity: 0.5,
                            // shadowRadius: 10,
                        }}
                    />
                </View>
        </View>
    )
}

export default UserScreen;

const styles = StyleSheet.create({
    screen:{
        flex:1,
        alignItems:'center',
        justifyContent:'space-around',
        backgroundColor:'#0C0B0D',
    }
})