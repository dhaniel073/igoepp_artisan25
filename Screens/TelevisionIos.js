import { Alert, Pressable, TouchableOpacity, SafeAreaView, StyleSheet, Text, View, Keyboard } from 'react-native'
import React, { useContext, useRef, useState } from 'react'
import { Image, ImageBackground } from 'expo-image'
import Modal  from 'react-native-modal'
import {Entypo, MaterialIcons} from '@expo/vector-icons'
import { TvPayment, TvRenewalPay, ValidatePin } from '../utils/AuthRoute'
import styled from 'styled-components'
import * as Notifications from 'expo-notifications'
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Border, Color, DIMENSION, FontSize, marginStyle } from '../Component/Ui/GlobalStyle'
import Input from '../Component/Ui/Input'
import SubmitButton from '../Component/Ui/SubmitButton'
import { AuthContext } from '../utils/AuthContext'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'
import OTPFieldInput from '../Component/Ui/OTPFieldInput'
import GoBack from '../Component/Ui/GoBack'
import { captureRef } from 'react-native-view-shot';
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


const TelevisionIos = ({route, navigation}) => {
  const [smartcard, setSmartCard] = useState(route.params.smartcard)
  const [isbouquetfocus, setIsBouquetFocus] = useState(false)
  const [id, setid] = useState(route.params.id)
  const [ref, setRef] = useState(route.params.data.requestID)
  const [username, setUserName] = useState(route.params.data.customerName)
  const [bouquetData, setBouquetData] = useState(route.params.bouquetData)
  const [isModalVisble, setIsModalVisible] = useState(false)
  const [isCompleteModalVisble, setIsCompleteModalVisible] = useState(false)
  const [price, setPrice] = useState(route.params.price)
  const [rprice, setRPrice] = useState(route.params.data.dueAmount)

  const [code, setCode] = useState('')
  const [pinReady, setPinReady] = useState(false)
  const MAX_CODE_LENGTH = 4;
  
  const maindate = new Date() 
  const date = maindate.toDateString()
  const time = maindate.toLocaleTimeString()
  const [commissonvalue, setcommissonvalue] = useState(route.params.commissonvalue)
  
  const [pinT, setpinT] = useState()
  const [pinvalid, setpinvalid] = useState(false)
  const [pincheckifempty, setpincheckifempty] = useState([])
  const [isSetpinModalVisible, setisSetpinModalVisible] = useState(false)
  const [pinerrormessage, setPinerrorMessage] = useState('')
  const [ischecking, setischecking] = useState(false)
  const authCtx = useContext(AuthContext)
  const [isLoading, setisLoading] = useState(false)

  const [responseId, setresponseId] = useState()
  const [responseMessage, setresponseMessage] = useState()

  const toggleModal =  () => {
    setIsModalVisible(!isModalVisble)
  }

  const toggleConfirmModal =  () => {
    setIsCompleteModalVisible(!isCompleteModalVisble)
  }

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

  const tvRenewalPayment = async (data) => {
    toggleModal1()
    try {
      setisLoading(true)
      const response = await TvRenewalPay(ref, rprice, authCtx.token, commissonvalue)
      // console.log(response.data)  
      // if(response.data.status){
        if(response.data.message === "failed" || "Failed" && response.data.description === "Insufficient wallet balance"){
          Alert.alert("Failed", response.data.description, [
            {
              text:"Ok",
              onPress:() => navigation.navigate('BillPayment')
            }
          ])
        }else{
          setRef(response.data.requestID)
          setRPrice(response.data.dueAmount)
          setresponseMessage(response.data.message)
          toggleModal()
        }
      setisLoading(false)
    } catch (error) {
      setisLoading(true)
      console.log(error)
      if(error.response.data.message === "Insufficient Balance"){
        Alert.alert("Sorry", error.response.data.message, [
          {
            text:"Ok",
            onPress: () =>  navigation.navigate('BillPayment')
          }
      ])}else{
        Alert.alert("Sorry", "An error occured try again later", [
          {
            text:"Ok",
            onPress: () =>  navigation.navigate('BillPayment')
          }
        ])
      }
      console.log(error.response.data)
      setisLoading(false)
      return;
    }
  }

  const tvPayment = async () => {
    toggleModal1()
    try {
        setisLoading(true)
        const response = await TvPayment(ref, price, bouquetData, authCtx.token, commissonvalue)
        console.log(response.data)
        
        if(response.data.message === "failed" || "Failed" && response.data.description === "Insufficient wallet balance"){
          Alert.alert("Failed", response.data.description, [
            {
              text:"Ok",
              onPress:() =>  navigation.navigate('BillPayment')
            }
          ])
        }else{
          setRef(response.data.requestID)
          setresponseMessage(response.data.message)
          toggleModal()
        }
      setisLoading(false)
    } catch (error) {
      setisLoading(true)
      console.log(error)
      console.log(error.response)
      if(error.response.data.message === "Insufficient Balance"){
        Alert.alert("Sorry", error.response.data.message, [
          {
            text:"Ok",
            onPress: () =>  navigation.navigate('BillPayment')
          }
      ])}else{
        Alert.alert("Error", "An error occured please try again later", [
          {
            text:'Ok',
            onPress: () =>  navigation.navigate('BillPayment')
          }
        ])
      }
      setisLoading(false)
      return;
    }
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
          onPress: () => navigation.navigate('BillPayment')
        }
      ])
    }else{
      try {
        setischecking(true)
        const response = await ValidatePin(authCtx.Id, code, authCtx.token)
        // console.log(response)
        setCode('')
        if(id === "DSTVR" || id === "GOTVR"){
          tvRenewalPayment() 
        }else{
          tvPayment()
        }
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

  async function schedulePushNotification(response) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${id === "DSTVR" ? "Dstv Renewal" : id === "GOTVR" ? "Gotv Renewal" : id} Subscription 🔔`,
        body: `${id === "DSTVR" ? "Dstv Renewal" : id === "GOTVR" ? "Gotv Renewal" : id + "Subscription"}  ${response.data.message}\nAmount: ${id === "DSTVR" || id === "GOTVR" ? rprice : price}\nSmartCard Number: ${smartcard}\nRef: ${response.data.requestID}\nDate: ${date} ${time}`,
        data: { data: 'goes here' },
      },
      trigger: { seconds: 10 },
    });
  }

  if(isLoading){
    return <LoadingOverlay message={"..."}/>
  }

  return (
    <SafeAreaView style={{marginHorizontal: 30, marginTop: -20, justifyContent:'center', flex:1}}>

    <ImageBackground style={{flexDirection:'row', alignItems:'center', justifyContent:'space-evenly',}}>
      <Image contentFit='contain' source={require("../assets/dstv-logo.png")} style={[styles.image]}/>
      <Image source={require("../assets/GOtv.png")} style={styles.image}/>
      <Image contentFit='contain' source={require("../assets/showmax.png")} style={styles.image}/>
      <Image contentFit='contain' source={require("../assets/startimes-logo.jpg")} style={styles.image}/>
    </ImageBackground>
    <Text style={styles.tvtxt}>Confirm Television Details</Text>
    {/* <Button onPress={toggleModal} title='Xlicl'/> */}
    
    <View style={{marginTop:10}}>
   
    <View style={{marginBottom:10, marginTop:25}}>
        
        <View style={{justifyContent:'space-between', flexDirection:'row', marginBottom:10}}>
          <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>SmartCard Pin :</Text>
          <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{smartcard}</Text>
        </View>

        <View style={{justifyContent:'space-between', flexDirection:'row', marginBottom:10}}>
          <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Customer Name:</Text>
          <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{username}</Text>
        </View>


          <View style={{justifyContent:'space-between', flexDirection:'row', marginBottom:10}}>
          <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Amount :</Text>
          <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{id === "DSTVR" || id === "GOTVR" ? rprice : price}</Text>
        </View>

        <View style={{justifyContent:'space-between', flexDirection:'row', marginBottom:10}}>
          <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Ref :</Text>
          <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{ref}</Text>
        </View> 

        <View style={{justifyContent:'space-between', flexDirection:'row', marginBottom:10}}>
          <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Date :</Text>
          <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{date} {time}</Text>
        </View>

          <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center', marginTop: 20,}}>
          
            <TouchableOpacity style={styles.viewbtn} onPress={() => navigation.navigate('BillPayment')}>
                  <Text style={styles.viewtext}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelbtn} onPress={() => [toggleConfirmModal(), toggleModal1()]}>
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

          <View style={styles.modalView}>
          <Image source={require("../assets/igoepp_transparent2.png")} style={{height:100, width:100, position:'absolute', alignContent:'center', alignSelf:'center', top:DIMENSION.HEIGHT * 0.1,justifyContent:'center', opacity:0.3, }} contentFit='contain'/>
            <Text style={styles.modalText}>Reciept</Text>
              {
                Platform.OS === "android" ? 
                  <View style={{borderBottomWidth:0.5, marginTop:5, borderStyle:"dashed"}}/>
                :
                 <View style={{borderBottomWidth:0.5, marginTop:5}}/>
              }
              
                <View style={{marginBottom:10, marginTop:25}}>
                    
                  <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                    <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>SmartCard Pin :</Text>
                    <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{smartcard}</Text>
                  </View>

                  <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                    <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Customer Name:</Text>
                    <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{username}</Text>
                  </View>

                    <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                    <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Amount Funded :</Text>
                    <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{id === "DSTVR" || id === "GOTVR" ? rprice : price}</Text>
                  </View>

                  <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                    <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Ref :</Text>
                    <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{ref}</Text>
                  </View> 

                  <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                    <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Date :</Text>
                    <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{date} {time}</Text>
                  </View>

                    <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center', marginTop: 20,}}>
                    
                    <TouchableOpacity style={styles.sharebtn} onPress={() => captureAndShare()}>
                      <Text><Entypo name="forward" size={24} color={Color.new_color} /></Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => captureAndSaveScreen()}>
                      <AntDesign name="download" size={24} color={Color.new_color} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.sharebtn} onPress={() => [toggleModal(), schedulePushNotification(), navigation.goBack()]}>
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

export default TelevisionIos

const styles = StyleSheet.create({
    modalView1: {
        backgroundColor: 'white',
        width: DIMENSION.WIDTH  * 0.9,
        borderRadius: 20,
        // flex:1,
        alignItems:'center',
        height: Platform.OS === 'ios' ?  DIMENSION.HEIGHT * 0.33 : DIMENSION.HEIGHT * 0.4
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
        marginTop:10,
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
        textAlign: 'center',
        fontSize:18, 
        fontFamily:'poppinsRegular'
      },
})