import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Color, marginStyle } from '../Components/Ui/GlobalStyle'
import { Image } from 'expo-image'
import Input from '../Components/Ui/Input'
import SubmitButton from '../Components/Ui/SubmitButton'
import Flat from '../Components/Ui/Flat'
import { ForgotHelperPassword } from '../utils/AuthRoute'
import LoadingOverlay from '../Components/Ui/LoadingOverlay'

const ForgotPassword = ({navigation}) => {
    
  const [email, setemail] = useState('')
  const [emailinvalid, setemailinvalid] = useState(false)
  const [isLoading, setisLoading] = useState(false)
 
  const submitHandler = async () => {
    
    const emailIsValid = email.includes('@')
    console.log(email, emailIsValid)

    if(!emailIsValid){
      setemailinvalid(!emailIsValid)
      Alert.alert("Invalid Email", "Please enter a valid email")
    }else{
      try {
        setisLoading(true)
        const response = await ForgotHelperPassword(email)
        Alert.alert("Successful", `A mail has been sent to \n${email}`, [
          {
            text:"Ok",
            onPress: () => navigation.navigate("Login")
          }
        ])  
        setisLoading(false)
      } catch (error) {
        setisLoading(true)
        Alert.alert("Error", `${error.response.data.message}`, [
          {
            text:"Ok",
            onPress: () => navigation.navigate("Login")
          }
        ])  
        setisLoading(false)
      }
    }
  }

  if(isLoading){
    return <LoadingOverlay message={"..."}/>
  }

  return (
    <ScrollView style={styles.authContent} showsVerticalScrollIndicator={false}>
      <Image style={{ width:100, height:100, alignSelf:'center'}} source={require("../assets/igoepp_transparent2.png")}   placeholder={'blurhash'} contentFit="contain"/>

      <Text style={styles.Title}>Forgot Password</Text>
    <Input
      placeholder={"Email"}
      value={email}
      onUpdateValue={setemail}
      isInvalid={emailinvalid}
      onFocus={() => setemailinvalid(false)}
    />
      <View style={styles.buttons}>
        <SubmitButton onPress={() => submitHandler()} message={'Submit'}/>

        <View style={styles.space}></View>
        <Flat onPress={() => navigation.navigate('Login')}>
          Login Instead
        </Flat>
      </View>
    </ScrollView>
  )
}

export default ForgotPassword

const styles = StyleSheet.create({
  authContent: {
    flex: 1,
    marginTop: 130,
    marginHorizontal: 10,
    padding: 16,
    borderRadius: 8,
    // alignItems: 'center'
  },
  buttons: {
    marginTop: 15,
  },
  Title:{
    marginTop: 30, 
    marginBottom: 50,
    // marginHorizontal: 50,
    fontSize: 25,
    // fontWeight: 'bold',
    color: Color.new_color,
    fontFamily: 'poppinsMedium'
  },
  space:{
    marginTop: 10
  },
})