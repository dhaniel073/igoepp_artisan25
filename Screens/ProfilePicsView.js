import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import {AntDesign} from '@expo/vector-icons'
import { Image } from 'expo-image'
import { HelperUrl } from '../utils/AuthRoute'
import { Border, Color, DIMENSION, FontSize, marginStyle } from '../Component/Ui/GlobalStyle'
import Input from '../Component/Ui/Input'
import SubmitButton from '../Component/Ui/SubmitButton'
import { AuthContext } from '../utils/AuthContext'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'
import OTPFieldInput from '../Component/Ui/OTPFieldInput'
import GoBack from '../Component/Ui/GoBack'
import {Platform} from 'react-native';



const ProfilePicsView = ({navigation, route}) => {
  const authCtx = useContext(AuthContext)
  const [photo, setphoto] = useState('')
  const [isloading, setisloading] = useState(false)

  useEffect(() => {
    helperget()
  }, [])

  const helperget = async () => {
    try {
      setisloading(true)
      const response = await HelperUrl(authCtx.Id, authCtx.token)
      // console.log(response)
      setphoto(response.photo)
      authCtx.helperPicture(response.photo)
      setisloading(false)
    } catch (error) {
      setisloading(true)
      setisloading(false)
      return;
    }
  }

  if(isloading){
    return <LoadingOverlay message={"..."}/>
  }


  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack() } style={{marginHorizontal:10}}>
          {/* <Entypo name="" size={18} color={Color.darkolivegreen_100} />      */}
          <AntDesign name="arrowleft" size={24} color={Color.orange_100} />  
      </TouchableOpacity>

          <View style={styles.imageContainer}>
            {
               photo === null || photo === undefined || photo === "null" || photo === "" ? 
              <Image style={[styles.image, ]} source={require("../assets/person-4.png")} contentFit='contain'/>
              :
              <Image style={[styles.image, ]} source={{uri: `https://igoeppms.com/igoepp/public/handyman/${photo}`}}  contentFit='contain'/>

            }
          </View>
  </SafeAreaView>

  )
}

export default ProfilePicsView

const styles = StyleSheet.create({
  imageContainer:{
    flex:1,
    marginBottom:'20%'
},
container: {
    flex: 1,
    marginTop:marginStyle.marginTp
},
pressed:{
    opacity: 0.55
},
image:{
    flex:1,
    width: "100%",
},
backParent:{
    marginTop: '12%',
    left: 10,
    flexDirection: 'row',
},
image2:{
    width: 15,
    height: 15,
    marginHorizontal: 15,
    marginTop: "10%"
  }
})