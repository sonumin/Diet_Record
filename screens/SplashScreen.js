import { View,Text, StyleSheet,ActivityIndicator, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { React, useEffect, useState, useContext } from 'react';
import { useNavigation } from "@react-navigation/native";
import { useQuery, QueryCache, useQueries } from '@tanstack/react-query';
import AppContext from './AppContext';
import axios from 'axios';
import {
    QueryClient
} from '@tanstack/react-query'
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

const SplashScreen = () => {
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation();
    const {userID, setValue} = useContext(AppContext)

    useEffect(()=>{
        const queryClient = new QueryClient()
        queryClient.invalidateQueries()
        setTimeout(()=>{
            setIsLoading(false);
            AsyncStorage.getItem('userID').then((value)=>
                {
                    setValue(value)
                    navigation.replace(value === null ? 'Log' : 'Main')
                }
            )
        }, 1000)
    },[])
    return(
        <View style={styles.screen}>
            <Image
                source={require('/Users/jongsik2/Desktop/RN/RN_food_google_last/egg-bread.png')}
                style={{
                    height: 150,
                    resizeMode: 'contain',
                    alignSelf: 'center'
                }}
            />
            <ActivityIndicator
                animating={isLoading}
                color="#000000"
                size="large"
                style={styles.activityIndicator}
            />
        </View>
    );
}
export default SplashScreen ;

const styles = StyleSheet.create({
    screen: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
    },
    activityIndicator: {
        alignItems: 'center',
        height: 80,
    },
    loadtext:{
        fontSize:24
    }
  });