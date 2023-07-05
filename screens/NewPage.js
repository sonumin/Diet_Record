import { useQuery, QueryCache, useQueries } from '@tanstack/react-query';
import axios from 'axios';
import React, { useContext, useEffect, useState,useCallback } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, Button, Dimensions, ScrollView, Modal } from 'react-native';
import CalendarComponent from 'react-native-swipeable-weekly-calendar';
import * as Progress from 'react-native-progress';
import AppContext from './AppContext';
import { LogBox } from 'react-native';
import ImageModal from 'react-native-image-modal';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications
const {width,height} = Dimensions.get('window')
const NewPage = () =>{
    const {inwidth,inheight} = Dimensions.get('window')
    const {userID, setValue} = useContext(AppContext)
    const [date, setDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [imageUrl, setImageUrl] = useState();
    const [eatData, setEatData] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const [eat,setEat] = useState();
    const [persentData,setPersentData] = useState();
    const [userGoal,setUserGoal] = useState();
    const imgArray = []
    const eatArray = []
    const result = []
    const fontcolor = 'white'
    useEffect(()=>{
            handleDateSelect(date);
    }, [])

    const divideImages = (data) =>{
        for(let i = 0; i < data.length-3; i++){
            imgArray[i] = "data:image/jpeg;base64,"+ data[i+3][0].image_data
            eatArray[i] = data[i+3][0].data
        }
        setImageUrl(imgArray)
        setEatData(eatArray)
    }

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
      
        return `${year}-${month}-${day}`;
    };
    
    const handleDateSelect = (date) => {
        setPersentData(null);
        setEat(null);
        setDate(date);

        const formattedDate = formatDate(date);
        setSelectedDate(date);
        fetchImage(formattedDate);
        // console.log(imageUrl[3])
    };

    const fetchImage = (formattedDate) => {
        axios.get(`http://1.176.185.164:5000/loadDayData/${userID}/${formattedDate}`,{
            headers: {
                'Cache-Control': 'no-cache',
            }
        }
        )
        .then(response => {
            // const { imageUrl } = response.data[1].image_data;
            // response.data[1].image_data
            // console.log(response.data[3][0])
            divideImages(response.data)
            // setImageUrl(`data:image/jpeg;base64,${response.data[3].image_data}`);
            setUserGoal(response.data[0])
            setPersentData(response.data[1])
            setEat(response.data[2])
        })
        .catch(error => {
            console.error(error);
        });
    };
    const showFoodList = () =>{
        
        if(eatData.length != 0){
            for (let i = 0; i < eatData.length; i++){
            result.push(
                <View key={i}>
                    <View style={{width:'95%',height:height*0.2,backgroundColor:'white',alignItems:'center',margin:'2.5%',borderRadius:16,backgroundColor:'#15161E'}}>
                        <View style={{width:'95%',height:'20%',justifyContent:'center',borderBottomWidth:0.5,borderColor:'grey'}}>
                            {/* <Text style={{fontSize:18,marginLeft:'3%'}}>음식{i+1}</Text> */}
                            <Text style={{fontSize:18,marginLeft:'3%',color:fontcolor}}>{eatData[i].foodName}</Text>
                        </View>
                        <View style={{width:'95%',height:'75%',flexDirection:'row',marginTop:'2%',backgroundColor:'#15161E'}}>
                            <View style={{width:'50%',height:'100%'}}>
                                <Text style={{marginLeft:'5%',marginTop:'5%',color:fontcolor}}>칼로리 : {eatData[i].kcal}kcal</Text>
                                <Text style={{marginLeft:'5%',marginTop:'5%',color:fontcolor}}>탄수화물 : {eatData[i].carbo}g</Text>
                                <Text style={{marginLeft:'5%',marginTop:'5%',color:fontcolor}}>단백질 : {eatData[i].protein}g</Text>
                                <Text style={{marginLeft:'5%',marginTop:'5%',color:fontcolor}}>지방 : {eatData[i].fat}g</Text>
                            </View>
                            <View style={{width:'50%',height:'100%'}}>
                                <ImageModal style={styles.modal} modalImageResizeMode = {'contain'}   source={{uri: `${imageUrl[i]}`}} />
                            </View>
                        </View>
                    </View>
                </View>)
            }
        }
        else{
            result.push(
                    <View style={{width:'95%',height:height*0.2,backgroundColor:'white',alignItems:'center',margin:'2.5%',borderRadius:16,backgroundColor:'#15161E'}}>  
                    </View>
                )
            }
        
        return result
    }

    return(
        <View style={styles.screen}>
            <View style={styles.first}>
                <CalendarComponent
                    date={date}
                    onPressDate={handleDateSelect}
                    showMonth
                    language="ko"
                />
            </View>
            <View style={styles.second}>
                {
                    eat && persentData && userGoal &&
                    <View>
                        <View style={styles.secondfirst}>
                            <Text  style={{fontSize:18, marginLeft:'4%',color:fontcolor}}>일일 영양 섭취량 </Text>
                        </View>
                        <View style={styles.secondsencond}>
                            <View style={{flexDirection:'row'}}>
                                <Text style={{marginLeft:'3%',marginBottom:'1%',color:fontcolor}}>총 칼로리</Text>
                                <Text style={{color:fontcolor}}>  {eat.kcal} / {userGoal.kcal} kcal</Text>
                            </View>
                            <View style={styles.onebar}>
                                <Progress.Bar progress={persentData.kcal} width={350} height={10} color={'#66a1ff'}/>
                                
                            </View>
                            <View style={styles.threebar}>
                                <View>
                                    <Text style={{marginBottom:'4%',color:fontcolor}}>탄수화물</Text>
                                    <Progress.Bar progress={persentData.carbo} width={100} height={10} color={'#66a1ff'}/>
                                    <Text style={{color:fontcolor}}>{eat.carbo} / {userGoal.carbo} g</Text>
                                </View>
                                <View>
                                    <Text style={{marginBottom:'4%',color:fontcolor}}>단백질</Text>
                                    <Progress.Bar progress={persentData.protein} width={100} height={10}color={'#66a1ff'}/>
                                    <Text style={{color:fontcolor}}>{eat.protein} / {userGoal.protein} g</Text>
                                </View>
                                <View>
                                    <Text style={{marginBottom:'4%',color:fontcolor}}>지방</Text>
                                    <Progress.Bar progress={persentData.fat} width={100} height={10}color={'#66a1ff'}/>
                                    <Text style={{color:fontcolor}}>{eat.fat} / {userGoal.fat} g</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                }
            </View>
            <View style={styles.third}>
                
                <ScrollView
                    decelerationRate={0}
                    snapToInterval={height}
                    snapToAlignment={"center"}
                    contentInset={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                }}>
                    {eatData && 
                        showFoodList()}
                </ScrollView>
            </View>
        </View>
    );
}

export default NewPage;

const styles = StyleSheet.create({
    screen:{
        flex:1,
        alignItems:'center',
        justifyContent:'space-around',
        backgroundColor:'#0C0B0D',
    },
    first:{
        marginTop:'10%',
        alignItems:'center',
        justifyContent:'center',
        width:'95%',
        height:'18%',
    },
    second:{
        width:'95%',
        height:'20%',
        borderRadius:16,
        backgroundColor:'#15161E'
        // backgroundColor:'blue',
    //     shadowColor: "#000",
    //     shadowOffset: {
    //       width: 3,
    //       height: 3,
    //   },
    //   shadowOpacity: 0.5,
    //   shadowRadius: 5,
    },
    secondfirst:{
        width:'95%',
        height:'30%',
        alignContent:'center',
        justifyContent:'center'
    },
    secondsencond:{
        width:'100%',
        height:'80%',

    },
    onebar:{
        alignItems:'center',
        width:'100%',
        height:'15%',
    },
    threebar:{
        width:'100%',
        height:'60%',
        flexDirection:'row',
        justifyContent:'space-around',

    },
    third:{
        width:width,
        height:height*0.5,
        // alignItems:'center',
        // justifyContent:'space-around',
        borderRadius:16,
        backgroundColor:'#0C0B0D',
    },
    modal:{
        width:width*0.95*0.95*0.5,
        height:height*0.2*0.7,
        borderRadius:5
    }
});