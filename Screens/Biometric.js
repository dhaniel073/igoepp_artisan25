import { Alert, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useId, useState } from 'react'
import * as LocalAuthentication from 'expo-local-authentication'
import {Ionicons, Octicons} from '@expo/vector-icons'
import * as Device from 'expo-device';
import { AuthContext } from '../utils/AuthContext'
import { BiometricSetup, DisableBiometric, HelperUrl } from '../utils/AuthRoute'
import { Color, marginStyle } from '../Components/Ui/GlobalStyle'
import LoadingOverlay from '../Components/Ui/LoadingOverlay'
import GoBack from '../Components/Ui/GoBack';

const Biometric = ({navigation}) => {
    const [biometric, setBiometric] = useState(true)
    const [IsBiometricSupported, setIsBiometricSupported] = useState(false)
    const authCtx = useContext(AuthContext)
    const [isloading, setisloading] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [check, setCheck] = useState([])
    const log = Device.osInternalBuildId
    


    useEffect(() => {
      const unsuscribe = navigation.addListener('focus', async () => {
        try {
          setisloading(true)
          const response = await HelperUrl(authCtx.Id, authCtx.token)
          // console.log(response)
          setCheck(response.biometric_setup)
          setisloading(false)
        } catch (error) {
          setisloading(true)
          // console.log(error.response.data)
          Alert.alert("Sorry", "An error occured try again later", [
            {
              text:"Ok",
              onPress: () => navigation.goBack()
            }
          ])
          setisloading(false)
        }
      })
      return unsuscribe;
    }, [])

    useEffect(() => {
      (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      // console.log(compatible)
      setIsBiometricSupported(compatible)
    })
    }, [])


    function toggleBiometric(){
      // onAuthenticate()
    }

    const Enabled = async () => {
      try {
        const response = await BiometricSetup(authCtx.Id, log, authCtx.token)
        setBiometric(previousState => !previousState)
        Alert.alert("Successful", "Bimoetric enabled sucessfully",[
          {
            text: 'Ok',
            onPress: () => navigation.goBack()
          }
        ]) 
        // console.log(response)
      } catch (error) {
        // console.log(error.response)
        Alert.alert("Error", "An error occured",[
          {
            text: 'Ok',
            onPress: () => navigation.goBack()
          }
        ]) 
      }
    }
    
    const DisEnabled = async () => {
      try {
        const response = await DisableBiometric(authCtx.Id, authCtx.token)
        // console.log(response)
        setBiometric(previousState => !previousState)
        Alert.alert("Successful", "Bimoetric disabled sucessfully",[
          {
            text: 'Ok',
            onPress: () => navigation.goBack()
          }
        ]) 
      } catch (error) {
        // console.log(error.response)
        Alert.alert("Error", "An error occured",[
          {
            text: 'Ok',
            onPress: () => navigation.goBack()
          }
        ]) 
      }
    }

    // console.log(biometric)

  
    function onAuthenticate1 (){
      const auth = LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate with Touch ID',
        fallbackLabel: 'Enter Password'
      });
      auth.then(result => {
        setIsAuthenticated(result.success);
        if(result.success === true){
            Enabled()
            // Enabled()
        }else if (result.error === 'not_enrolled'){
          Alert.alert("", "Device not enrolled, setup up a screen lock to use this feature")
        }
      })
    }

    function onAuthenticate2 (){
      const auth = LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate with Touch ID',
        fallbackLabel: 'Enter Password'
      });
      auth.then(result => {
        setIsAuthenticated(result.success);
        if(result.success === true){
            DisEnabled()
            // Enabled()
        }else if (result.error === 'not_enrolled'){
          Alert.alert("", "Device not enrolled, setup up a screen lock to use this feature")
        }
      })
    }

    if(isloading){
      return <LoadingOverlay message={"..."}/>
    }

    
  return (
    <View style={{flex:1, marginTop: marginStyle.marginTp, marginHorizontal:10}}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.biometrictxt}>Biometric Setup</Text>
    
      <View style={{ flexDirection: 'row', marginTop: '5%', justifyContent:'space-between', marginHorizontal:10 }}>
        <View style={{flexDirection:'row'}}>
          <Text style={styles.text}>Use fingerprint</Text>
        </View>

        <Switch
          trackColor={{ false: 'grey', true: Color.new_color }}
          thumbColor={'white'}
          ios_backgroundColor={'white'}
          onValueChange={check === "N" ? onAuthenticate1 : onAuthenticate2}
          value={check === "N" ? !biometric : biometric}
          // value={!biometric ? false : true}
        />
      </View>
    </View>

  )
}

export default Biometric

const styles = StyleSheet.create({
  biometrictxt:{
    fontSize: 18,
    color: Color.new_color,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
  }, 
  text:{
    top:8,
    fontSize:15,
    fontFamily: 'poppinsRegular'
  },
})