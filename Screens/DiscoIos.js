import { Alert, Keyboard, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useRef, useState } from 'react'
import { DiscoPayment, ValidatePin } from '../utils/AuthRoute'
import * as Notifications from 'expo-notifications'
import { Image, ImageBackground } from 'expo-image'
import styled from 'styled-components'
import {Entypo, MaterialIcons, AntDesign} from '@expo/vector-icons'
import Modal from 'react-native-modal'
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { Border, Color, DIMENSION, FontSize, marginStyle } from '../Component/Ui/GlobalStyle'
import Input from '../Component/Ui/Input'
import SubmitButton from '../Component/Ui/SubmitButton'
import { AuthContext } from '../utils/AuthContext'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'
import OTPFieldInput from '../Component/Ui/OTPFieldInput'
import GoBack from '../Component/Ui/GoBack'
import Flat from '../Component/Ui/Flat'
import {Platform} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

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


const DiscoIos = ({route, navigation}) => {
    const [isLoading, setisLoading] = useState(false)
  const [id, setid] = useState(route?.params?.id)
  const authCtx = useContext(AuthContext)
  const [isModalVisble, setIsModalVisible] = useState(false)
  const [amount, setAmount] = useState(route?.params?.amount)
  const [username, setUserName] = useState(route?.params?.data?.customerName)
  const [useraddress, setUserAddress] = useState(route?.params?.data?.customerAddress)
  const [token, setToken] = useState()
  const [ref, setRef] = useState(route?.params?.data?.requestID)
  const [meterno, setMeterNo] = useState(route?.params?.meterno)
  
  const [responseToken, setresponseToken] = useState()
  const [responseId, setresponseId] = useState()
  const [responseMessage, setresponseMessage] = useState()

  const [code, setCode] = useState('')
  const [pinReady, setPinReady] = useState(false)
  const MAX_CODE_LENGTH = 4;

  const [isSetpinModalVisible, setisSetpinModalVisible] = useState(false)
  const [pinerrormessage, setPinerrorMessage] = useState('')
  const [ischecking, setischecking] = useState(false)
  const [commissonvalue, setcommissonvalue] = useState()

  const maindate = new Date() 
  const date = maindate.toDateString()
  const time = maindate.toLocaleTimeString()

  const viewRef = useRef();

  const captureAndShare = async () => {
    try {
      // Capture the screenshot
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 1,
      });

      // Share the screenshot
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error('Error capturing and sharing screenshot:', error);
    }
  };

  const captureAndSaveScreen = async () => {
    try {
      // Capture the screen
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 1.0,
      });

      // Get permission to access media library
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access media library is required!');
        return;
      }

      // Define the custom file name
      const fileName = `receipt_${new Date().getTime()}.png`;
      const downloadDir = FileSystem.documentDirectory + 'Download/';
      const fileUri = downloadDir + fileName;

      // Ensure the download directory exists
      await FileSystem.makeDirectoryAsync(downloadDir, { intermediates: true });

      // Move the captured image to the download directory with the custom name
      await FileSystem.moveAsync({
        from: uri,
        to: fileUri,
      });

      // Save the file to the device's download folder
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      const album = await MediaLibrary.getAlbumAsync('Download');
      if (album == null) {
        await MediaLibrary.createAlbumAsync('Download', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }

      Alert.alert('Receipt saved successfully!');
    } catch (error) {
      console.error('Failed to capture and save screen:', error);
      Alert.alert('Failed to save receipt!');
    }
  };
  

  const toggleModal =  () => {
    setIsModalVisible(!isModalVisble)
  }

  let refT = useRef(0);
  
  function handleClick() {
    refT.current = refT.current + 1;
    // alert('You clicked ' + ref.current + ' times!');
  }

  const toggleModal1 = () => {
    setisSetpinModalVisible(!isSetpinModalVisible)
  }
  
  const pinValidateCheck = async () => {
   
    if(refT.current > 3){
      Alert.alert("", "To many attempt, try again later", [
        {
          text: "Ok",
          onPress: () =>  navigation.navigate('BillPayment')
        }
      ])
    }else{
      try {
        setischecking(true)
        const response = await ValidatePin(authCtx.Id, code, authCtx.token)
        // console.log(response)
        setCode('')
        makePayment()
      } catch (error) {
        setischecking(true)
        setCode('')
        setPinerrorMessage(error.response.data.message + "\n" + (3 - refT.current + " trials remaining"))
        // console.log(error.response)
        Alert.alert("Error", error.response.data.message+ " " + "Try again", [
          {
            text: "Ok",
            onPress: () => {}
          },
        ])
        setischecking(false)

      }
    }
  }

  const makePayment = async () => {
    toggleModal1()
    try {
        setisLoading(true)
        const response = await DiscoPayment(ref, amount, authCtx.token, commissonvalue)
        // console.log(response)
        if(response.message === "failed" || "Failed" && response.description === "Insufficient wallet balance"){
          Alert.alert("Failed", response.description, [
            {
              text:"Ok",
              onPress:() => navigation.navigate('BillPayment')
            }
          ])
        }else{
          // console.log(response)
          setresponseToken(response.token)
          setresponseId(response.requestID)
          setresponseMessage(response.message)
          setToken(response.token)
          toggleModal()
        }
       
        setisLoading(false)
    } catch (error) {
      console.log(error.response.data)
      setisLoading(true)
      if(error.response.data.message === "Insufficient Balance"){
        Alert.alert("Sorry", error.response.data.message, [
          {
            text:"Ok",
            onPress: () =>  navigation.navigate('BillPayment')
          }
        ])
      }else{
        Alert.alert("Sorry", "An error occured", [
          {
            text:"Ok",
            onPress: () =>  navigation.navigate('BillPayment')
          }
        ])
      }
      setisLoading(false)
      return;
    }
  }

  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Electricity Bill 🔔`,
        body: `${responseMessage}.\nElectricity Token:${responseToken}\nRef:${responseId}\nAmount:${amount}\nDate: ${date} ${time}`,
        data: { data: 'goes here' },
      },
      trigger: { seconds: 10 },
    });
  }


  if(isLoading){
    return <LoadingOverlay message={"..."}/>
  }


  if(isLoading){
    return <LoadingOverlay message={"..."}/>
  }

  return (
    <SafeAreaView style={{marginHorizontal: 25, justifyContent:'center', flex:1, marginTop: -15}}>

    <ImageBackground style={{flexDirection:'row', alignItems:'center', justifyContent:'space-evenly',}}>
    <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center', }}>
      <Image contentFit='contain' source={require("../assets/eedcc.png")} style={[styles.image]}/>
      <Image contentFit='contain' source={require("../assets/ekedc.jpg")} style={styles.image}/>
      <Image contentFit='contain' source={require("../assets/ibedc1.jpg")} style={[styles.image, ]}/>
      <Image contentFit='contain' source={require("../assets/kedco.jpg")} style={[styles.image]}/>
      <Image contentFit='contain' source={require("../assets/phedc.jpg")} style={[styles.image, {position:'absolute',  left:'40%', top:"70%" }]}/>
      </View>
    </ImageBackground>

    <Text style={styles.tvtxt}>Confirm Electricity Details</Text>
    {/* <Button onPress={toggleModal} title='Xlicl'/> */}
    
    <View style={{marginTop:5}}>
      <View style={{marginBottom:10, marginTop:20}}>
        <View style={{justifyContent:'space-between', flexDirection:'row', marginBottom: 3}}>
          <Text style={{fontFamily:'poppinsRegular',  fontSize:12}}>Meter No :</Text>
          <Text  style={{fontFamily:'poppinsRegular', fontSize:12}}>{meterno}</Text>
        </View>

        <View style={{justifyContent:'space-between', flexDirection:'row',  marginBottom: 3}}>
          <Text style={{fontFamily:'poppinsRegular', fontSize:12}}>User Name :</Text>
          <Text  style={{fontFamily:'poppinsRegular', fontSize:12}}>{username}</Text>
        </View> 

        <View style={{justifyContent:'space-between', flexDirection:'row', marginBottom: 3}}>
          <View>
            <Text style={{fontFamily:'poppinsRegular', fontSize:12}}>User Address :</Text>
          </View>
          <View style={{maxWidth:DIMENSION.WIDTH * 0.6, }}>
            <Text  style={{fontFamily:'poppinsRegular', textAlign:'right', fontSize:12}}>{useraddress}</Text>
          </View>
        </View> 

          <View style={{justifyContent:'space-between', flexDirection:'row',  marginBottom: 3}}>
          <Text style={{fontFamily:'poppinsRegular', fontSize:12}}>Amount :</Text>
          <Text  style={{fontFamily:'poppinsRegular', fontSize:12}}>{amount}</Text>
        </View>

        <View style={{justifyContent:'space-between', flexDirection:'row',  marginBottom: 3}}>
          <Text style={{fontFamily:'poppinsRegular', fontSize:12}}>Ref :</Text>
          <Text  style={{fontFamily:'poppinsRegular', fontSize:12}}>{ref}</Text>
        </View> 


        <View style={{justifyContent:'space-between', flexDirection:'row',  marginBottom: 3}}>
          <Text style={{fontFamily:'poppinsRegular', fontSize:12}}>Date :</Text>
          <Text  style={{fontFamily:'poppinsRegular', fontSize:12}}>{date} {time}</Text>
        </View>

        
          <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center', marginTop: 20,}}>
          
          <TouchableOpacity style={styles.viewbtn} onPress={() => navigation.goBack()}>
            <Text style={styles.viewtext}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelbtn} onPress={() => [toggleModal1()]}>
            <Text style={styles.canceltext}>Confirm</Text>
          </TouchableOpacity>

        </View>
    
      </View>              
    </View>

    <Modal isVisible={isSetpinModalVisible}>
          <Pressable  onPress={Keyboard.dismiss} style={styles.centeredView}>
          <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => [toggleModal1(), setCode('')]}>
              <MaterialIcons name="cancel" size={30} color="white" />
          </TouchableOpacity>

          <View style={styles.modalView1}>
            {
              ischecking ? 
              <View style={{flex:1, marginTop: 30, marginBottom: 70}}>
                  <LoadingOverlay/>  
              </View>
              :
            <>
          <View style={{marginTop: '13%'}}/>
              <Text style={{fontFamily:'poppinsRegular'}}>Enter Transaction Pin</Text>

              <OTPFieldInput
                setPinReady={setPinReady}
                code={code}
                setCode={setCode}
                maxLength={MAX_CODE_LENGTH}
              />
              {
                pinerrormessage.length !== 0 && <Text  style={{fontSize:11, textAlign:'center', color:Color.tomato}}>{pinerrormessage}</Text>
              }
          <StyledButton disabled={!pinReady} 
          onPress={() => [handleClick(), pinValidateCheck()]}
          style={{
              backgroundColor: !pinReady ? Color.gray_100 : Color.new_color
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

    <Modal isVisible={isModalVisble}>
      <SafeAreaView style={styles.centeredView}>

        <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => [toggleModal(), schedulePushNotification(), navigation.navigate('BillPayment')]}>
          <MaterialIcons name="cancel" size={30} color="white" />
          </TouchableOpacity>

          <View style={styles.modalView} ref={viewRef}>
          <Image source={require("../assets/igoepp_transparent2.png")} style={{height:100, width:100, position:'absolute', alignContent:'center', alignSelf:'center', top:DIMENSION.HEIGHT * 0.13,justifyContent:'center', opacity:0.3, }} contentFit='contain'/>
            <Text style={[styles.modalText, {textAlign:'center'}]}>Reciept</Text>
              {
                Platform.OS === "android" ? 
                  <View style={{borderBottomWidth:0.5, marginTop:5, borderStyle:"dashed"}}/>
                :
                 <View style={{borderBottomWidth:0.5, marginTop:5}}/>
              }
              
                <View style={{marginBottom:10, marginTop:25}}>
                     
                <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                      <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Meter No :</Text>
                      <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{meterno}</Text>
                    </View>

                    <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                      <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Distribution Company :</Text>
                      <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{id}</Text>
                    </View> 

                    <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                      <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>User Name :</Text>
                      <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{username}</Text>
                    </View> 

                    <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                      <View>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>User Address :</Text>
                      </View>
                      <View style={{maxWidth:DIMENSION.WIDTH * 0.6, }}>
                        <Text  style={{fontFamily:'poppinsRegular', textAlign:'right', fontSize:10}}>{useraddress}</Text>
                      </View>
                    </View> 

                     <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                      <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Amount Funded :</Text>
                      <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{amount}</Text>
                    </View>

                    <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                      <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Ref :</Text>
                      <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{ref}</Text>
                    </View> 

                    <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                      <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Token :</Text>
                      <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{token}</Text>
                    </View> 

                    <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                      <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Date :</Text>
                      <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{date} {time}</Text>
                    </View>

                     {/* <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center', marginTop: 20,}}>
                      
                        <TouchableOpacity style={styles.cancelbtn} onPress={() => {}}>
                              <Text><Entypo name="share" size={24} color="black" /></Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.viewbtn} onPress={() => [toggleBidModal(), navigation.goBack()]}>
                            <Text style={styles.viewtext}>Back</Text>
                        </TouchableOpacity>
                        
                      </View> 
                      */}
                      <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center', marginTop: 20,}}>
                      
                      <TouchableOpacity style={styles.sharebtn} onPress={() => captureAndShare()}>
                            <Entypo name="forward" size={24} color={Color.new_color} />
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => captureAndSaveScreen()}>
                          <AntDesign name="download" size={24} color={Color.new_color} />
                        </TouchableOpacity>

                      <TouchableOpacity style={styles.sharebtn} onPress={() => [toggleModal(), schedulePushNotification(),navigation.navigate('BillPayment')]}>
                          <Text>Close</Text>
                      </TouchableOpacity>
                    </View>
                 
                </View>              
          </View>
          </SafeAreaView>
        </Modal>
  </SafeAreaView>
  )
}

export default DiscoIos

const styles = StyleSheet.create({
  receipt: {
    width: 300,
    height: 400,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
  },
  modalView1: {
    backgroundColor: 'white',
    width: DIMENSION.WIDTH  * 0.9,
    borderRadius: 20,
    // flex:1,
    alignItems:'center',
    height: Platform.OS === 'ios' ? DIMENSION.HEIGHT * 0.35 : DIMENSION.HEIGHT * 0.4 
  },
  sharebtn:{
    justifyContent:'center',
    alignItems:'center',
    borderRadius: 3,
    width: DIMENSION.WIDTH * 0.36,
    padding: 5
  },
  viewbtn:{
    backgroundColor:Color.white,
    borderColor: Color.brown,
    borderWidth: 1,
    justifyContent:'center',
    borderRadius: 3,
    width: DIMENSION.WIDTH * 0.36,
    padding: 5
  },
  viewtext:{
    textAlign:'center',
    alignSelf:'center',
    fontFamily: 'poppinsMedium',
    fontSize: 12,
    color: Color.brown
  },
  cancelbtn: {
    backgroundColor: Color.new_color,
    borderRadius: 3,
    justifyContent:'center',
    width: DIMENSION.WIDTH * 0.36,
    padding: 5
  },
  canceltext:{
    fontFamily: 'poppinsMedium',
    fontSize: 12,
    color: Color.white,
    textAlign: "center",
  },
  image:{
    width: 60,
    height: 60,
    borderRadius:100,
    padding:10,
  },
  tvtxt:{
    fontSize: 18,
    color: Color.new_color,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:'10%',
    marginBottom:15,
    textAlign: 'center',
    fontSize:18, 
    fontFamily:'poppinsRegular'
  }, 
  centeredView: {
    flex: 1,
    // backgroundColor: Color.light_black,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    width: DIMENSION.WIDTH  * 0.9,
    borderRadius: 20,
    padding: 25,
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    // marginBottom: 15,
  }
})