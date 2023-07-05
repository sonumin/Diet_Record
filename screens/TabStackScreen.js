import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import {React, useContext, useEffect} from 'react';
import { View,Text, Button, Alert } from 'react-native';
import NewPage from './NewPage';
import DetailScreen from './DetailScreen';
import SettingScreen from './SettingScreen';
import EditUserScreen from './EditUserScreen';
import SignInScreen from './SignInScreen';
import Ionicons from '../node_modules/react-native-vector-icons/Ionicons';
import HomeScreen from './HomeScreen'
import LoginScreen from './LoginScreen'
import FirstSettingScreen from './FirstSettingScreen'
import AppContext from './AppContext';
import SplashScreen from './SplashScreen';
import auth from '@react-native-firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserScreen from './UserScreen';


const TabStack = createBottomTabNavigator();
const NewStack = createStackNavigator();
const UserStack = createStackNavigator();
const HomeStack = createStackNavigator();
const DetailStack = createStackNavigator();
const SettingStack = createStackNavigator();
const LoginStack = createStackNavigator();
const AppStack = createStackNavigator();

const NewName = "홈"
const HomeName="메인화면"
const DetailName="사진"
const SettingName="내정보"
const LoginName="로그인"
const UserName="마이페이지"
// const context = useContext(AppContext)   

const NewStackScreen = () => {
    return(
        <NewStack.Navigator>
            <NewStack.Screen name='New' component={NewPage} options={{headerShown:false}}></NewStack.Screen>
        </NewStack.Navigator>
    )
}
const UserStackScreen = () => {
    return(
        <UserStack.Navigator>
            <UserStack.Screen name='User' component={UserScreen} 
            options={{headerShown:false,
            }}/>
            <UserStack.Screen name='Send' component={EditUserScreen} options={{headerShown:false}}/>
        </UserStack.Navigator>
    )
}
const HomeStackScreen=()=>{
    return(
        <HomeStack.Navigator>
            <HomeStack.Screen name='Home' component={HomeScreen} options={{headerShown:false}}/>
        </HomeStack.Navigator>
    )
}
const DetailStackScreen=()=>{
    return(
        <DetailStack.Navigator>
            <DetailStack.Screen name='Detail' component={DetailScreen} options={{headerShown:false}}/>
        </DetailStack.Navigator>
    )
}
const SettingStackScreen=()=>{
    return(
        <SettingStack.Navigator>
            <SettingStack.Screen name='Setting' component={SettingScreen} 
            options={{headerShown:true,
                headerRight: () => (
                    <Button
                      onPress={() => alert('This is a button!')}
                      title="Info"
                      color="#fff"
                    />
                  ),
            }}/>
            <SettingStack.Screen name='Send' component={EditUserScreen} options={{headerShown:true}}/>
        </SettingStack.Navigator>
    )
}
const LoginStackScreen=()=>{
    return(
        <LoginStack.Navigator>
            <LoginStack.Screen name='Login' component={LoginScreen} options={{headerShown:false}}/>
            <LoginStack.Screen name='SignIn' component={SignInScreen} options={{headerShown:false}}/>
            <LoginStack.Screen name='FirstSet' component={FirstSettingScreen} options={{headerShown:false,style:{backgroundColor:'black'}}}/>
        </LoginStack.Navigator>
    )
}
const TabStackScreen = () =>{
    return(
        <TabStack.Navigator
            inintailRouteName={NewName}
            screenOptions={({route})=>({
                tabBarIcon: ({focused,color,size})=>{
                    let iconName;
                    let rn = route.name;
                    if(rn==NewName){
                        iconName = focused ? 'calendar' : 'calendar-outline';
                    }else if(rn ==DetailName){
                        iconName = focused ? 'add-circle' : 'add-circle-outline';
                    }else if(rn ==UserName){
                        iconName = focused ? 'person-circle' : 'person-circle-outline';
                    }
                    return <Ionicons name ={iconName} size = {size} color= {color}/>
                },
            })}
            tabBarOptions={{
                inactiveBackgroundColor:'black',
                activeBackgroundColor:'black',
                activeTintColor:'white',
                inactiveTintColor:'white',
                style:{
                    backgroundColor:'black'
                }
            }}
        >
            <TabStack.Screen name={NewName} component = {NewStackScreen} options={{headerShown:false}} />
            
            <TabStack.Screen name ={DetailName} component = {DetailStackScreen} options={{headerShown:false}}/>
            {/* <TabStack.Screen name ={SettingName} component = {SettingStackScreen}/>  */}
            <TabStack.Screen name={UserName} component = {UserStackScreen} option = {{headerShown:false}} />
        </TabStack.Navigator>
    );
}

const AppStackScreen = () => {
    const context = useContext(AppContext)
    const id = context.userID
    useEffect(()=>{
        // console.log(id)
    },[])
    return(
        <AppStack.Navigator>
            <AppStack.Screen name={'Splash'} component={SplashScreen} options={{headerShown:false}}/>
            <AppStack.Screen name={'Log'} component={LoginStackScreen} options={{headerShown:false}}/>
            <AppStack.Screen name={'Main'} component={TabStackScreen} options={{headerShown:false}}/>
        </AppStack.Navigator>
    );
}

export default AppStackScreen;
// export default TabStackScreen;