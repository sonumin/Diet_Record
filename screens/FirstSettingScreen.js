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
    const [height, setHeight] = useState();
    const [weight, setWeight] = useState();
    const [kcal, setKcal] = useState();
    const [carbo, setCarbo] = useState();
    const [protein, setProtein] = useState();
    const [fat, setFat] = useState();
    const navigation = useNavigation();

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
                backgroundColor: '#ffffff',
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
                Registration Successful
                </Text>
                <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={toMainScreen}>
                <Text style={styles.buttonTextStyle}>Login Now</Text>
                </TouchableOpacity>
            </View>
            );
        }
        const setSucess = async () =>{
            const form = {
                id: id,
                name: name,
                height: height,
                weight: weight,
                kcal: kcal,
                carbo: carbo,
                protein: protein,
                fat: fat
            }
            await axios
            .post('http://121.174.150.180:50001/join',JSON.stringify(form),{
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
            <View style={styles.firstContainer}>
                <View style={styles.textBoxContainer}>
                    <View style={styles.textBoxRow}>
                        <Text style={styles.textCon}>이름 :</Text>
                        <TextInput style={styles.textBox}
                            placeholder='이름을 적으시오'
                            onChangeText={val=>{
                                setName(val);
                            }}
                        />
                    </View>
                    <View style={styles.textBoxRow}>
                        <Text style={styles.textCon}>키 :</Text>
                        <TextInput style={styles.textBox}
                            placeholder='키를 적으시오'
                            
                            onChangeText={val=>{
                                setHeight(val);
                            }}
                        />
                    </View>
                    <View style={styles.textBoxRow}>
                        <Text style={styles.textCon}>몸무게 :</Text>
                        <TextInput style={styles.textBox}
                            placeholder='몸무게를 적으시오'
                            onChangeText={val=>{
                                setWeight(val);
                            }}
                        />
                    </View>
                    <View style={styles.textBoxRow}>
                        <Text style={styles.textCon}>칼로리 :</Text>
                        <TextInput style={styles.textBox}
                            placeholder='칼로리를 적으시오'
                            value={Number}
                            onChangeText={val=>{
                                setKcal(val)
                            }}
                        />
                    </View>
                    <View style={styles.textBoxRow}>
                        <Text style={styles.textCon}>탄수화물 :</Text>
                        <TextInput style={styles.textBox}
                            placeholder='탄수화물을 적으시오'
                            value={Number}
                            onChangeText={val=>{
                                setCarbo(val);
                            }}
                        />
                    </View>
                    <View style={styles.textBoxRow}>
                        <Text style={styles.textCon}>단백질 :</Text>
                        <TextInput style={styles.textBox}
                            placeholder='단백질을 적으시오'
                            value={Number}
                            onChangeText={val=>{
                                setProtein(val);
                            }}
                        />
                    </View>
                    <View style={styles.textBoxRow}>
                        <Text style={styles.textCon}>지방 :</Text>
                        <TextInput style={styles.textBox}
                            placeholder='지방을 적으시오'
                            onChangeText={val=>{
                                setFat(val);
                            }}
                        />
                    </View>
                </View>
              
            
            </View>
            <View style={styles.secondContainer}>
                <Pressable style={styles.button} onPress={setSucess}>
                    <Icon name="save" size={24} color="#ffffff" />
                </Pressable>
            </View>
        </View>
    )
}
export default FirstsetScreen;

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
    successTextStyle: {
        color: 'black',
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