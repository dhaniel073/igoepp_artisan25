import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Alert, Platform, Modal } from 'react-native'
import React, { useContext, useState } from 'react'
import { Image } from 'expo-image'
import {Ionicons} from '@expo/vector-icons'
import * as LocalAuthentication from 'expo-local-authentication'
import * as Device from 'expo-device'
import { ConvertPassword, LoginHandyman, LoginWithBiometric } from '../utils/AuthRoute'
import SubmitButton from '../Components/Ui/SubmitButton'
import Flat from '../Components/Ui/Flat'
import { Color } from '../Components/Ui/GlobalStyle'
import { AuthContext } from '../utils/AuthContext'
import Input from '../Components/Ui/Input'
import LoadingOverlay from '../Components/Ui/LoadingOverlay'
import { Base64 } from 'js-base64'
  

const Login = ({navigation}) => {
    const [enteredEmail, setEnteredEmail] = useState('')
    const [enteredPassword, setEnteredPassword] = useState('')
    const [emailIsInvalid, setEmailIsInvalid] = useState(true)
    const [passwordIsInvalid, setPasswordIsInvalid] = useState(true)
    const [isloading, setIsloading] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const log = Device.osInternalBuildId
    const authCtx = useContext(AuthContext)
    const timestamp = new Date();

    const cleardata = () => {
      setEnteredEmail('')
      setEnteredPassword('')
    }
  
    const updateInputValueHandler = (inputType, enteredValue) => {
      switch (inputType) {
        case 'email':
          setEnteredEmail(enteredValue)
          break;

        case 'password':
          setEnteredPassword(enteredValue)
          break;
      }
    }

    const convertpasswordget = async () => {
      const emailcheck = enteredEmail.includes('@') && enteredEmail.includes(".com")
      const passwordcheck = enteredPassword.length > 6
    
      if(!emailcheck || !passwordcheck){
        Alert.alert('Invalid details', 'Please check your entered credentials.')
        setEmailIsInvalid(emailcheck)
        setPasswordIsInvalid(passwordcheck)  
      }else{
      try {
        setIsloading(true)
        const response = await ConvertPassword(enteredPassword)
        console.log(response)
        const password = response
        loginhandler(password)
      } catch (error) {
        setIsloading(true)
        console.log(error.response)
        Alert.alert("Error", "An error occured")
        setIsloading(false)
      }
      }
    }

    const loginhandler = async (conpass) => {
      try {
        setIsloading(true)
        const response = await LoginHandyman(enteredEmail, conpass)
        console.log(response)
        authCtx.authenticated(response.access_token)  
        authCtx.helperId(response.helper_id)
        authCtx.helperEmail(response.email)
        authCtx.helperFirstName(response.first_name)
        authCtx.helperLastName(response.last_name)
        authCtx.helperBalance(response.wallet_balance)
        authCtx.helperPhone(response.phone)
        authCtx.helperPicture(response.photo)
        authCtx.helperSubCatId(response.subcategory)
        authCtx.helperCatId(response.category)
        authCtx.helperShowAmount('show')
        authCtx.helperuserid(response.user_id)
        authCtx.helperlastLoginTimestamp(new Date().toString())
        setIsloading(false)
      } catch (error) {
        setIsloading(true)
        Alert.alert('Login Failed', error.response.data.message)
        console.log(error.response)
        setIsloading(false)
      }
    }

    function onAuthenticate (spec){
      const auth = LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate with Touch ID',
        fallbackLabel: 'Enter Password'
      });
      auth.then(result => {
        setIsAuthenticated(result.success);
        if(result.success === true){
          BiometricSignUp()
        }else if(result.error === 'not_enrolled'){
          Alert.alert("", result.error)
          console.log(result)
        }else{
          Alert.alert("Error", "Try again later")
        }
      })
    }

    const BiometricSignUp = async () => {
      try {
        setIsloading(true)
        const response = await LoginWithBiometric(log)
        console.log(response.data)
        authCtx.authenticated(response.data.access_token)  
        authCtx.helperId(response.data.helper_id)
        authCtx.helperEmail(response.data.email)
        authCtx.helperFirstName(response.data.first_name)
        authCtx.helperLastName(response.data.last_name)
        authCtx.helperBalance(response.data.wallet_balance)
        authCtx.helperPhone(response.data.phone)
        authCtx.helperPicture(response.data.photo)
        authCtx.helperSubCatId(response.data.subcategory)
        authCtx.helperCatId(response.data.category)
        authCtx.helperShowAmount('show')
        authCtx.helperuserid(response.data.user_id)
        authCtx.helpersumtot("0.00")
        authCtx.helperlastLoginTimestamp(new Date().toString())
        setIsloading(false)
      } catch (error) {
        setIsloading(true)
        Alert.alert('Login Failed', error.response.data.message)
        setIsloading(false)   
        console.log(error.response)     
      }
    }


    if(isloading){
      return <LoadingOverlay message={"Logging in"}/>
    }

    

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{justifyContent:'center', flex:1, marginTop:'40%', marginHorizontal:20}}>
        <Image style={{ width:100, height:100, alignSelf:'center'}} source={require("../assets/igoepp_transparent2.png")}   placeholder={'blurhash'} contentFit="contain"/>
        <Text style={styles.Title}>Login</Text>
       
        <Input
          placeholder="Email Address"
          onUpdateValue={updateInputValueHandler.bind(this, 'email')}
          value={enteredEmail}
          autoCapitalize={'none'}
          keyboardType="email-address"
          isInvalid={!emailIsInvalid}
          onFocus={() => setEmailIsInvalid(true)}
        />
        
        <Input
          placeholder="Password"
          onUpdateValue={updateInputValueHandler.bind(this, 'password')}
          secure
          value={enteredPassword}
          isInvalid={!passwordIsInvalid}
          autoCapitalize={'none'}
          onFocus={() => setPasswordIsInvalid(true)}
          />
            {/* <>
              {
                enteredPassword.length <= 7 ? <Text style={{color:Color.tomato, fontSize:12}}>Password must be more than 7 characters</Text> : null
                
              }
            </> */}
        </View>

          <SubmitButton style={{marginHorizontal:50, marginTop:10}} message={"Login"} onPress={() => convertpasswordget()}/>

        <TouchableOpacity style={{alignItems:'center', justifyContent:'center', marginTop: 10}} onPress={() => onAuthenticate()}>
          {
            Platform.OS === 'android' ? 
            <Ionicons name="finger-print" size={35} color={Color.new_color} />
            :
            <Image source={require("../assets/faceid.jpg")} style={{width:50, height:50}} contentFit='cover'/>

          }
        </TouchableOpacity>

        {/* <TouchableOpacity style={{alignItems:'center', justifyContent:'center', marginTop: 10}} onPress={() => onAuthenticate()}>
        <Image source={require("../assets/faceid.jpg")} style={{width:50, height:50}} contentFit='cover'/>

        </TouchableOpacity> */}

        <View style={styles.button}>
          <Flat onPress={() => [navigation.navigate("ForgotPassword"), cleardata()]}>
            Forgot Password
          </Flat>
        </View>
      <View style={{flexDirection:'row', alignItem:'center', justifyContent:'center', }}>
        <Text style={styles.newuser}>Dont have an account? </Text>
        <TouchableOpacity onPress={() => [navigation.navigate('SignUp'), cleardata()]}>
          <Text style={styles.backtext}> SignUp</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>

      
    
    </SafeAreaView>
  )
}

export default Login

const styles = StyleSheet.create({
  newuser:{
    fontSize:14,
    fontFamily: 'poppinsMedium'
  },
  Title:{
    marginTop: 10, 
    marginBottom: 10,
    fontSize: 25,
    fontFamily: 'poppinsMedium',
    color: Color.new_color
  },
  backtext:{
    fontSize:14,
    color: Color.new_color,
    textAlign:'center',
    fontFamily: 'poppinsMedium'

  },
 button:{
    // marginTop: 10
  },
})