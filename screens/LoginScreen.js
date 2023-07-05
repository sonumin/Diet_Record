import React, { useState, useEffect, useContext } from 'react';
import {
    StyleSheet,
    TextInput,
    View,
    Text,
    ScrollView,
    Image,
    Keyboard,
    TouchableOpacity,
    KeyboardAvoidingView,
    Alert,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth'
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signIn } from "../lib/auth";
import AppContext from './AppContext';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

const LoginScreen = () =>{
    const {userID, setValue} = useContext(AppContext)

    const checkGoogle = async (user) =>{
        const google = await axios.get(`http://1.176.185.164:5000/checkGoogle/${user}`,{
            headers: {
                'Cache-Control': 'no-cache',
            },
        }).then((res)=> res.data)
        if(google['status']){
            toHomeScreen()
        }else{
            toFirstSettingScreen()
        }
    }
    const onPressGoogleBtn = async () => {
        await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
        const {idToken} = await GoogleSignin.signIn();
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        const res = await auth().signInWithCredential(googleCredential);
        const user = res.user.uid
        await AsyncStorage.setItem('userID', user)
        await AsyncStorage.setItem('isLogin', 'true')
        checkGoogle(user);
      };
    const navigation = useNavigation();
    const [password,setPassword] = useState();
    const [id,setId] = useState();
    
    const login = async () =>{
        if(!id || !password){
            if(!id){
                Alert.alert('아이디를 입력해 주세요')
            }else{
                Alert.alert('비밀번호를 입력해 주세요')
            }
        }else{
            try {
                const userInfo = await auth().signInWithEmailAndPassword(id, password);
                const user = userInfo.user['uid']
                await AsyncStorage.setItem('isLogin', 'true')
                await AsyncStorage.setItem('userID',user)
                toHomeScreen();
              } catch (e) {
                Alert.alert("로그인에 실패하였습니다.");
              }
        }
    }
    const toSignInScreen =() => {
        navigation.navigate("SignIn")
    }
    const toFirstSettingScreen =() => {
        navigation.navigate("FirstSet")
    }
    const toHomeScreen =() => {
        navigation.replace("Splash")
    }

    return(
        <View style={styles.screen}>
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                flex: 1,
                justifyContent: 'center',
                alignContent: 'center',
            }}>
                <View>
                    <KeyboardAvoidingView enabled>
                        <View style={{alignItems: 'center'}}>
                            <Image 
                                source={require('/Users/jongsik2/Desktop/RN/RN_food_google_last/egg-bread.png')}
                                style={{
                                    width: '50%',
                                    height: 100,
                                    resizeMode: 'contain',
                                    margin: 30,
                                }}
                            />
                        </View>
                        <View style={styles.SectionStyle}> 
                            <TextInput
                                style={styles.inputStyle}
                                onChangeText={(val) =>
                                    setId(val)
                                }
                                placeholder="Enter Email" //dummy@abc.com
                                placeholderTextColor="#b4b1ae"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                returnKeyType="next"
                                underlineColorAndroid="#f000"
                                blurOnSubmit={false}
                            />
                        </View>
                        <View style={styles.SectionStyle}>
                            <TextInput
                                style={styles.inputStyle}
                                onChangeText={(UserPassword) =>
                                    setPassword(UserPassword)
                                }
                                placeholder="Enter Password" //12345
                                placeholderTextColor="#b4b1ae"
                                keyboardType="default"
                                onSubmitEditing={Keyboard.dismiss}
                                blurOnSubmit={false}
                                secureTextEntry={true}
                                underlineColorAndroid="#f000"
                                returnKeyType="next"
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.buttonStyle}
                            activeOpacity={0.5}
                            onPress={login}
                        >
                            <Text style={styles.buttonTextStyle}>LOGIN</Text>   
                        </TouchableOpacity>
                        <GoogleSigninButton 
                            style={{marginLeft:40, marginTop:20}}
                            title='asdf' 
                            size={GoogleSigninButton.Size.Wide}
                            color={GoogleSigninButton.Color.Dark}
                            onPress={onPressGoogleBtn} />

                        <Text style={styles.registerTextStyle} onPress={toSignInScreen}>
                            New Here ? Register
                        </Text>
                    </KeyboardAvoidingView>  
                        
                        
                </View>      
            </ScrollView>
        </View>
    )
}


const styles=StyleSheet.create({
    screen:{
        flex:1,
        backgroundColor:'#15161E',
    },
    SectionStyle: {
        flexDirection: 'row',
        height: 40,
        marginTop: 20,
        marginLeft: 35,
        marginRight: 35,
        margin: 10,
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
    kakaobutton: {
        flexDirection:'row',
        backgroundColor: '#FEE500',
        borderWidth: 0,
        color: '#000000',
        borderColor: '#7DE24E',
        height: 40,
        alignItems:'center',
        justifyContent:'center',
        borderRadius: 30,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 20,
        marginBottom: 25,
    },
    kakaoTextStyle: {
        color: '#000000',
        paddingVertical: 10,
        fontSize: 16,
    },
    inputStyle: {
        flex: 1,
        color: 'white',
        paddingLeft: 15,
        paddingRight: 15,
        borderWidth: 1,
        borderRadius: 30,
        borderColor: '#dadae8',
        width:'88%'
    },
    registerTextStyle: {
        color: '#ECEBF2',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 14,
        alignSelf: 'center',
        padding: 10,
    },
    errorTextStyle: {
        color: 'red',
        textAlign: 'center',
        fontSize: 14,
    },
})

export default LoginScreen;
