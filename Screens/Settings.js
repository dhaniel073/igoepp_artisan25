import { Alert, Linking, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Pressable, Keyboard } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import {Ionicons, Feather, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons"
import * as Updates from 'expo-updates'
import { CustomerInfoCheck, DeleteAccount, HelperUrl, ValidatePin } from '../utils/AuthRoute'
import styled from 'styled-components'
import Modal from 'react-native-modal'
import {Border, Color, DIMENSION, FontSize, marginStyle } from '../Component/Ui/GlobalStyle'
import Input from '../Component/Ui/Input'
import SubmitButton from '../Component/Ui/SubmitButton'
import { AuthContext } from '../utils/AuthContext'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'
import OTPFieldInput from '../Component/Ui/OTPFieldInput'
import GoBack from '../Component/Ui/GoBack'
import {Platform} from 'react-native';




const StyledButton = styled.TouchableOpacity`
    padding: 15px;
    background-color: ${Color.new_color};
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    margin-vertical: 5px;
    height: 50px;
    width: 60%
`;

export const ButtonText = styled.Text`
    font-size: 15px;
    color: ${Color.white};
    font-family: poppinsRegular
`;


const Setting = ({navigation}) => {
  const authCtx = useContext(AuthContext)
  const [isloading, setisloading] = useState(false)
  const [check, setCheck] = useState([])
  const [pinerrormessage, setPinerrorMessage] = useState('')
  const [isModalVisible1, setisModalVisible1] = useState(false)
  const [ischecking, setischecking] = useState(false)
  
  const [code, setCode] = useState('')
  const [pinReady, setPinReady] = useState(false)
  const MAX_CODE_LENGTH = 4;

  console.log(code)



  const whatsapp = () => {
     const response =  Linking.openURL('whatsapp://send?text=hello&phone=+2348103902560')
    .then((res) => {
      // console.log(res)
    }).catch((error) => {
      return
    })
  }

  // const triggerUpdateCheck = async () => {
  //   try {
  //     const update = await Updates.checkForUpdateAsync()
  //     if(update.isAvailable){
  //       await Updates.fetchUpdateAsync()
  //       await Updates.reloadAsync()
  //     }else{
  //       Alert.alert("Message", "No updates is available")
  //     }
  //   } catch (error) {
  //     alert(error.message);
  //   }
  // }

  const triggerUpdateCheck = async () => {
    if(Platform.OS === 'android'){
      Linking.openURL("https://play.google.com/store/apps/details?id=com.cdhaniel.igoepp_artisan");
    }else{
      return;
    }
  }


  useEffect(() => {
    const unsuscribe = navigation.addListener('focus', async () => {
      try {
      setisloading(true)
      const response = await HelperUrl(authCtx.Id, authCtx.token)
      // console.log(response)
      setCheck(response.transaction_pin_setup)
      setisloading(false)
      } catch (error) {
      setisloading(true)
      // console.log(error)
      Alert.alert('Error', "An error occured try again later", [
        {
          text:"Ok",
          onPress: () => {}
        }
      ])
      setisloading(false)
      }
    })
    return unsuscribe;
  }, [])

  const deleteAccountpermanently = async () => {
    try {
      setisloading(true)
      const response = await DeleteAccount(authCtx.Id, authCtx.token)
      console.log(response)
      Alert.alert('Success', "Yor account has been deleted successfully", [
        {
          text: "Ok",
          onPress: () => authCtx.logout()
        }
      ])
      setisloading(false)
    } catch (error) {
      setisloading(true)
      Alert.alert('Error', "An error occured while deleting your account", [
        {
          text: "Ok",
          onPress: () => {}
        }
      ])
      console.log(error)
      setisloading(false)
    }
  }

 
 
  const pinvalidate = async () => {
    try {
      setischecking(true)
      const response = await ValidatePin(authCtx.Id, code, authCtx.token )
      // console.log(response)
      setCode('')
      toggleModal1()
      navigation.navigate('TransactionPin')
      setischecking(false)
    } catch (error) {
      setischecking(true)
      console.log(error)
      setCode('')
      setPinerrorMessage(error.response.data.message)
      console.log(error.response)
      Alert.alert("Error", error.response.data.message+ " " + "Try again", [
        {
          text: "Ok",
          onPress: () => [toggleModal1(), setPinerrorMessage(''), navigation.navigate('Welcome')]
        },
      ])
      setischecking(false)
    }
  }

  const toggleModal1 = () => {
    setisModalVisible1(!isModalVisible1)
  }


  if(isloading){
    return <LoadingOverlay message={"..."}/>
  }


  return (
    <View style={{ flex:1, marginTop:marginStyle.marginTp, marginHorizontal: 10, }}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.settingstxt}>Settings</Text>

      <ScrollView style={{ padding:15, flex:1}} showsVerticalScrollIndicator={false}>

        <TouchableOpacity style={{ alignItems: 'flex-start', borderBottomWidth:1,}} onPress={() => navigation.navigate("Compliance")}>
          <View style={{ flexDirection: 'row',   paddingBottom: 15, marginTop: 15 }}>
          <Ionicons name="document-attach-outline" size={24} color='black' />
            <Text style={styles.textStyle}>Compliance Docs</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={{ alignItems: 'flex-start', borderBottomWidth:1,}} onPress={() => navigation.navigate("NotificationSetup")}>
          <View style={{ flexDirection: 'row',   paddingBottom: 15, marginTop: 15 }}>
            <Ionicons name='notifications-outline' size={24}/>
            <Text style={styles.textStyle}>Notification Setup</Text>
          </View>
        </TouchableOpacity>


        <TouchableOpacity style={{ alignItems: 'flex-start', borderBottomWidth:1,}} onPress={whatsapp}>
          <View style={{ flexDirection: 'row',   paddingBottom: 15, marginTop: 15 }}>
            <Ionicons name='headset' size={24}/>
            <Text style={styles.textStyle}>Help And Support</Text>
          </View>
        </TouchableOpacity>

          {
            check === "N" ?  
            <TouchableOpacity style={{ alignItems: 'flex-start', borderBottomWidth:1,}} onPress={() => navigation.navigate("TransactionPin")}>
              <View style={{ flexDirection: 'row',   paddingBottom: 15, marginTop: 15 }}>
              <Feather name="lock" size={24} color="black" />
               <Text style={styles.textStyle}>Set Transaction Pin</Text>
              </View>
            </TouchableOpacity>

            : check === 'Y' && Platform.OS === 'ios' ?

              <TouchableOpacity style={{ alignItems: 'flex-start', borderBottomWidth:1,}} onPress={() => toggleModal1()}>
                <View style={{ flexDirection: 'row',   paddingBottom: 15, marginTop: 15 }}>
                <Feather name="lock" size={24} color="black" />
                <Text style={styles.textStyle}>Reset Transaction Pin</Text>
                </View>
              </TouchableOpacity>

            : 

            <TouchableOpacity style={{ alignItems: 'flex-start', borderBottomWidth:1,}} onPress={() => navigation.navigate("TransactionPin")}>
                <View style={{ flexDirection: 'row',   paddingBottom: 15, marginTop: 15 }}>
                <Feather name="lock" size={24} color="black" />
                <Text style={styles.textStyle}>Reset Transaction Pin </Text>

                </View>
              </TouchableOpacity> 
          }

        <TouchableOpacity style={{ alignItems: 'flex-start', borderBottomWidth:1,}} onPress={() => navigation.navigate("Biometric")}>
          <View style={{ flexDirection: 'row',   paddingBottom: 15, marginTop: 15 }}>
          <Ionicons name="finger-print" size={24} color="black" />
            <Text style={styles.textStyle}>Biometric Setup</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={{ alignItems: 'flex-start', borderBottomWidth:1,}} onPress={() => navigation.navigate("PasswordReset")}>
          <View style={{ flexDirection: 'row',   paddingBottom: 15, marginTop: 15 }}>
          <MaterialCommunityIcons name="account-lock-outline" size={24} color="black" />
            <Text style={styles.textStyle}>Change Login Password</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={{ alignItems: 'flex-start', borderBottomWidth:1,}} onPress={() => triggerUpdateCheck()}>
          <View style={{ flexDirection: 'row',   paddingBottom: 15, marginTop: 15 }}>
          <MaterialIcons name="update" size={24} color="black" />
            <Text style={styles.textStyle}>Check for Update</Text>
          </View>
        </TouchableOpacity>

        {/* <TouchableOpacity style={{ alignItems: 'flex-start', borderBottomWidth:1,}} onPress={() => navigation.navigate("ReceiptTest")}>
          <View style={{ flexDirection: 'row',   paddingBottom: 15, marginTop: 15 }}>
          <MaterialIcons name="update" size={24} color="black" />
            <Text style={styles.textStyle}>ReceiptTest</Text>
          </View>
        </TouchableOpacity> */}

        <TouchableOpacity style={{ alignItems: '', justifyContent:'space-between', borderBottomWidth:1, width: '100%'}} onPress={() => Alert.alert("Logout", "Are you sure you want to logout", [
          {
            text:"No",
            onPress: () => {}
          },
          {
            text:"Yes",
            onPress:() => authCtx.logout()
          }
        ])}>
        <View style={{ flexDirection: 'row',  paddingBottom: 15, marginTop: 15 }}>
            <Ionicons name='exit-outline' size={24}/>
            <Text style={styles.textStyle}>LogOut</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={{ alignItems: 'flex-start', borderBottomWidth:1,}} onPress={() => 
          Alert.alert("Warning", "Are you sure you want to delete your account permanently from Igoepp", [
            {
              text: "No",
              onPress: () => {}
            },
            {
              text: "Yes",
              onPress: () => deleteAccountpermanently()
            }
          ])
          }>
          <View style={{ flexDirection: 'row',   paddingBottom: 15, marginTop: 15 }}>
          {/* <MaterialIcons name="update" size={24} color="black" /> */}
          <MaterialIcons name="delete" size={24} color="red" />
            <Text style={styles.textStyle1}>Delete Account</Text>
          </View>
        </TouchableOpacity>
      <View style={{marginBottom:40}}/>
    </ScrollView>

    <Modal isVisible={isModalVisible1}>
            <Pressable  onPress={Keyboard.dismiss} style={styles.centeredView}>
            <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => [toggleModal1(), setCode('')]}>
                <MaterialIcons name="cancel" size={30} color="white" />
            </TouchableOpacity>
                
            <View style={styles.modalView}>
              {
                ischecking ? 
                <View style={{flex:1, marginTop: 30, marginBottom: 70}}>
                  <LoadingOverlay/>  
                </View>

                :
              <>
              <View style={{marginTop: '13%'}}/>
              <Text style={{fontFamily:'poppinsRegular'}}>Validate Pin</Text>

              <OTPFieldInput
                setPinReady={setPinReady}
                code={code}
                setCode={setCode}
                maxLength={MAX_CODE_LENGTH}
                secureTextEntry={true}
              />
              
              {
                pinerrormessage.length !== 0 && <Text  style={{fontSize:11, textAlign:'center', color:Color.tomato}}>{pinerrormessage}</Text>
              }

            <StyledButton disabled={!pinReady} 
            onPress={() => pinvalidate()}
            style={{
                backgroundColor: !pinReady ? Color.grey : Color.new_color
            }}>
                <ButtonText
                style={{
                  color: !pinReady ? Color.black : Color.white
                }}
                >Submit</ButtonText>
            </StyledButton>
            </>
            }
            </View>
            </Pressable>
        </Modal>

  </View>
  )
}

export default Setting

const styles = StyleSheet.create({
  addtowalletpaymentxt:{
    fontSize: 18,
    color: Color.new_color,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
  },
  container: {
    marginTop: 20
  },
  textStyle:{
    fontFamily: 'poppinsMedium',
    fontSize: 12,
    marginLeft: 10,
    top: 8
  },
  textStyle1:{
    fontFamily: 'poppinsMedium',
    fontSize: 12,
    marginLeft: 10,
    top: 8,
    color: 'red'
  } ,
  settingstxt:{
    fontSize: 18,
    color: Color.new_color,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
  },
  centeredView: {
    flex: 1,
    // backgroundColor: Color.light_black,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
  },
  modalView: {
    backgroundColor: 'white',
    width: DIMENSION.WIDTH  * 0.9,
    borderRadius: 20,
    // flex:1,
    alignItems:'center',
    height: DIMENSION.HEIGHT * 0.4
  },
})