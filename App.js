import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState, createContext } from 'react';
import AppContext from './screens/AppContext';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import {
  StyleSheet, View, Text
} from 'react-native';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth'
import TabStackScreen from './screens/TabStackScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppStackScreen from './screens/TabStackScreen';
import { useNavigation } from "@react-navigation/native";

const queryClient = new QueryClient()

const App = () => {
  const [userID, setUserID] = useState();
  const getID = async () =>{
    const id = await AsyncStorage.getItem('userID')
    if(id){
      setUserID(id)
  }
}
  useEffect(()=>{
    getID();
    googleSigninConfigure();
  },[])
  // const navigation = useNavigation();
  const googleSigninConfigure = () => {
    GoogleSignin.configure({
      webClientId:
        '1035887526431-1prkio73erer7sktabhb33516kq82r0u.apps.googleusercontent.com',
    })
  }

  const setValue = (id) =>{
    setUserID(id);
  }
  const values = {
    userID: userID,
    setValue
  }
  return (
    <AppContext.Provider value={values}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <AppStackScreen/>
        </NavigationContainer>
      </QueryClientProvider>
    </AppContext.Provider>
  );
  
};

const styles = StyleSheet.create({

});

export default App;
