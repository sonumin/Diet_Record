import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable,Image,TouchableOpacity} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

const FirstsetScreen=()=>{
    const [id, setId] = useState();
    const [name, setName] = useState();
    const [age, setAge] = useState();
    const [height, setHeight] = useState();
    const [weight, setWeight] = useState();
    const [kcal, setKcal] = useState(0);
    const [carbo, setCarbo] = useState(0);
    const [protein, setProtein] = useState(0);
    const [fat, setFat] = useState(0);
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedActivity, setSelectedActivity] = useState('');
    const navigation = useNavigation();

    const handleGenderSelect = (gender) => {
        setSelectedGender(gender);
    };
    const handleActivitySelect = (activity) => {
        setSelectedActivity(activity);
    };

    const toMainScreen = () => {
        navigation.navigate('Login')
    }
    useEffect(()=>{
        const getId = async () =>{
            const id = await AsyncStorage.getItem('userID')
            setId(id)
        }
        getId()
    },[])
    const [isRegistraion,setIsRegistraion] = useState(false);
        if(isRegistraion){
            return (
            <View
                style={{
                flex: 1,
                backgroundColor: '#15161E',
                justifyContent: 'center',
                }}>
                <Image
                source={require('/Users/jongsik2/Desktop/RN/RN_food_google_last/egg-bread.png')}
                style={{
                    height: 150,
                    resizeMode: 'contain',
                    alignSelf: 'center'
                }}
                />
                <Text style={styles.successTextStyle}>
                회원가입이 완료되었습니다!
                </Text>
                <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={toMainScreen}>
                <Text style={styles.buttonTextStyle}>지금 로그인하기</Text>
                </TouchableOpacity>
            </View>
            );
        }

    const calculate =  () =>{
        // 성별에 따른 기초 대사량 계산
        let bmr;
        if (selectedGender === "남성") {
            bmr = 66 + 13.75 * weight + 5 * height - 6.8 * age;
        } else if (selectedGender === "여성") {
            bmr = 655 + 9.56 * weight + 1.85 * height - 4.68 * age;
        }

        // 활동 수준에 따른 활동 대사량 계산
        let pal;
        if (selectedActivity === "낮음") {
            pal = 1.2;
        } else if (selectedActivity === "보통") {
            pal = 1.55;
        } else if (selectedActivity === "높음") {
            pal = 1.9;
        }

        // 일일 권장 에너지 섭취량 계산
        const dailyEnergyIntake = (bmr * pal).toFixed();
        const proteinIntake = (weight * 0.8).toFixed(); // 체중(kg)의 0.8g 단백질 섭취
        const fatIntake = ((dailyEnergyIntake * 0.3) / 9).toFixed(); // 에너지 섭취량의 30%를 지방으로 가정
        const carbohydrateIntake =
          ((dailyEnergyIntake - proteinIntake * 4 - fatIntake * 9) / 4).toFixed(); // 나머지를 탄수화물로 가정
        setKcal(dailyEnergyIntake)
        setCarbo(carbohydrateIntake)
        setProtein(proteinIntake)
        setFat(fatIntake)
        // console.log(dailyEnergyIntake)
        // console.log(carbohydrateIntake)
        // console.log(proteinIntake)
        // console.log(fatIntake)
    }

    const setSucess = async () =>{
        const form = {
            id: id,
            name: name,
            age: age,
            height: height,
            weight: weight,
            sex: selectedGender,
            activity: selectedActivity,
            kcal: kcal,
            carbo: carbo,
            protein: protein,
            fat: fat,
            image: undefined
        }
        await axios
        .post('http://1.176.185.164:5000/join',JSON.stringify(form),{
            headers: {
                'content-type': 'application/json',
            },
            responseType: 'json'
        }).then((res) => res.data)
        setIsRegistraion(true);  
        AsyncStorage.setItem('isLogin', 'true')
    }
    return(
        <View style={styles.screen}>
            {/* <ScrollView> */}
                <View style={styles.firstContainer}>
                    <View style={styles.textBoxContainer}>
                        <View style={styles.textBoxRow}>
                            <Text style={styles.textCon}>이름 :</Text>
                            <TextInput style={styles.textBox}
                                onChangeText={val=>{
                                    setName(val);
                                }}
                            />
                        </View>
                        <View style={styles.textBoxRow}>
                            <Text style={styles.textCon}>나이 :</Text>
                            <TextInput style={styles.textBox}
                                onChangeText={val=>{
                                    setAge(val);
                                }}
                            />
                        </View>
                        <View style={styles.textBoxRow}>
                            <Text style={styles.textCon}>키 :</Text>
                            <TextInput style={styles.textBox}
                                onChangeText={val=>{
                                    setHeight(val);
                                }}
                            />
                        </View>
                        <View style={styles.textBoxRow}>
                            <Text style={styles.textCon}>몸무게 :</Text>
                            <TextInput style={styles.textBox}
                                onChangeText={val=>{
                                    setWeight(val);
                                }}
                            />
                        </View>
                        <View style={styles.textBoxRow}>
                            <Text style={styles.textCon}>성별 :</Text>

                            <TouchableOpacity
                                style={styles.radioButton}
                                onPress={() => handleGenderSelect('남성')}
                            >
                                {selectedGender === '남성' && <View style={styles.radioButtonSelected} />}
                                <Text style={styles.radioButtonText}>남성</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.radioButton}
                                onPress={() => handleGenderSelect('여성')}
                            >
                                {selectedGender === '여성' && <View style={styles.radioButtonSelected} />}
                                <Text style={styles.radioButtonText}>여성</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.textBoxRow}>
                            <Text style={styles.textCon}>활동량 :</Text>

                            <TouchableOpacity
                                style={styles.radioButton}
                                onPress={() => handleActivitySelect('낮음')}
                            >
                                {selectedActivity === '낮음' && <View style={styles.radioButtonSelected} />}
                                <Text style={styles.radioButtonText}>낮음</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.radioButton}
                                onPress={() => handleActivitySelect('보통')}
                            >
                                {selectedActivity === '보통' && <View style={styles.radioButtonSelected} />}
                                <Text style={styles.radioButtonText}>보통</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.radioButton}
                                onPress={() => handleActivitySelect('높음')}
                            >
                                {selectedActivity === '높음' && <View style={styles.radioButtonSelected} />}
                                <Text style={styles.radioButtonText}>높음</Text>
                            </TouchableOpacity>
                            <Pressable style={styles.button} onPress={calculate}>
                                {/* <Icon name="save" size={4} color="#ffffff" /> */}
                                <Text style={{color:'#0C0B0D'}}>계산</Text>
                            </Pressable>
                        </View>
                        <View style={styles.textBoxRow}>
                            <Text style={styles.textCon}>칼로리 :</Text>
                            <TextInput style={styles.textBox}
                                value={kcal.toString()}
                                onChangeText={val=>{
                                    setKcal(val)
                                }}
                            />
                        </View>
                        <View style={styles.textBoxRow}>
                            <Text style={styles.textCon}>탄수화물 :</Text>
                            <TextInput style={styles.textBox}
                                value={carbo.toString()}
                                onChangeText={val=>{
                                    setCarbo(val);

                                }}
                            />
                        </View>
                        <View style={styles.textBoxRow}>
                            <Text style={styles.textCon}>단백질 :</Text>
                            <TextInput style={styles.textBox}
                                value={protein.toString()}
                                onChangeText={val=>{
                                    setProtein(val);
                                }}
                            />
                        </View>
                        <View style={styles.textBoxRow}>
                            <Text style={styles.textCon}>지방 :</Text>
                            <TextInput style={styles.textBox}
                                value={fat.toString()}
                                onChangeText={val=>{
                                    setFat(val);
                                }}
                            />
                        </View>
                    </View>
                
                
                </View>
                <View style={styles.secondContainer}>
                    <Pressable style={styles.button} onPress={setSucess}>
                        {/* <Icon name="save" size={24} color="#ffffff" /> */}
                        <Text style={{color:'#0C0B0D',fontSize:14}}>SAVE</Text>
                    </Pressable>
                </View>
            {/* </ScrollView> */}
        </View>
    )
}
export default FirstsetScreen;

const styles = StyleSheet.create({
    
    screen: {
      flex: 1,
      backgroundColor: '#15161E',
    },
    firstContainer:{
        width:'100%',
        height:'88%',
        marginTop:"8%",
        alignItems: 'center',
        justifyContent:'center',
    },
    textBoxContainer:{
        width:'88%',
        height:'70%',
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
        fontSize:16,
        color:'#ECEBF2'
    },
    textBox:{
        borderWidth:1,
        borderColor:'#ECEBF2',
        width:'50%',
        height:'40%',
        borderRadius: 5,
        textAlign:'center',
        color:'white'
    },
    secondContainer:{
        width:'100%',
        height:'8%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button:{
        alignItems: 'center',
        justifyContent: 'center',
        // paddingVertical: 12,
        // paddingHorizontal: 32,
        borderRadius: 10,
        elevation: 3,
        backgroundColor: '#ECEBF2',
        // shadowColor: "#000",
        // shadowOffset: {
        //   width: 5,
        //   height: 5,
        // },
        // shadowOpacity: 0.5,
        // shadowRadius: 6,
        width:'24%',
        height:'50%'
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
      },
    radioButtonSelected: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor:'#ECEBF2', // 선택된 상태의 색상
        marginRight: 6,
    },
    radioButtonText: {
        fontSize: 16,
        color:'#ECEBF2'
    },
    successTextStyle: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
        padding: 30,
    },
    buttonStyle: {
        backgroundColor: '#000000',
        borderWidth: 0,
        color: '#000000',
        borderColor: '#7DE24E',
        height: 40,
        alignItems: 'center',
        borderRadius: 30,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 20,
    },
    buttonTextStyle: {
        color: '#ffffff',
        paddingVertical: 10,
        fontSize: 16,
    },
})