import { Pressable,SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert, TextInput, Keyboard } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Image, ImageBackground } from 'expo-image'
import { Dropdown } from 'react-native-element-dropdown'
import Modal from 'react-native-modal'
import {MaterialIcons, MaterialCommunityIcons, Entypo} from '@expo/vector-icons'
import axios from 'axios'
import * as Notification from 'expo-notifications'
import styled from 'styled-components'
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
import { AntDesign } from '@expo/vector-icons';
import { BetPay, HelperBillerCommission, HelperUrl, ValidateBet, ValidatePin } from '../utils/AuthRoute'
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

const Bet = ({route, navigation}) => {
  const [category, setcategory] = useState([])
  const [isFocus, setisFocus] = useState(false)
  const [id, setid] = useState()
  const [betId, setbetId] = useState()
  const [amount, setAmount] = useState()
  const authCtx = useContext(AuthContext)
  const [isloading, setisloading] = useState(false)
  const [ismodalvisible, setismodalvisible] = useState(false)
  const authId = route?.params?.id
  const [ref, setRef] = useState()
  const [commissonvalue, setcommissonvalue] = useState()

  const [pinT, setpinT] = useState()
  const [pinvalid, setpinvalid] = useState(false)
  const [pincheckifempty, setpincheckifempty] = useState([])
  const [isSetpinModalVisible, setisSetpinModalVisible] = useState(false)
  const [pinerrormessage, setPinerrorMessage] = useState('')
  const [ischecking, setischecking] = useState(false)

  const [code, setCode] = useState('')
  const [pinReady, setPinReady] = useState(false)
  const MAX_CODE_LENGTH = 4;


  const maindate = new Date() 
  const date = maindate.toDateString()
  const time = maindate.toLocaleTimeString()

  const amountCheck = amount >= 100

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        setisloading(true)
        const response = await HelperUrl(authCtx.Id, authCtx.token)
        setpincheckifempty(response.transaction_pin_setup)
        setisloading(false)
      } catch (error) {
        setisloading(true)
        Alert.alert('Error', "An error occured try again later", [
          {
            text:"Ok",
            onPress: () => navigation.goBack()
          }
        ])
        setisloading(false)
        // return;
      }
    })
    return unsubscribe;
  }, [])

    const commissionget = async (id) => {
      try {
        const response = await HelperBillerCommission(id, authCtx.token)
        console.log(response)
        setcommissonvalue(response)
      } catch (error) {
        return;
      }
    }
    

  useEffect(() => {
    const url = `https://igoeppms.com/igoepp/public/api/auth/billpayment/getAllBillersByCategory/${authId}`
    const response = axios.get(url, {
        headers:{
          Accept:'application/json',
          Authorization: `Bearer ${authCtx.token}`
        }
    }).then((res) => {
        // console.log(res.data)
        var count = Object.keys(res.data).length;
        let catarray = []
        for (var i = 0; i < count; i++){
            catarray.push({
                label: res.data[i].name,
                value: res.data[i].id,
            })
            // setCityCode(response.data.data[i].lga_code)
        }
        setcategory(catarray)
    }).catch((error) => {
        // console.log(error)
        return;
    })
  }, [])

  const updatehandleValue = (inputType, enteredValue) => {
    switch (inputType) {
      case "betid":
        setbetId(enteredValue)
        break;
      case "amount":
        setAmount(enteredValue)
        break;
    }
  } 


  const toggleModal = () => {
    setismodalvisible(!ismodalvisible)
  }

  const validateBet = async () => {
    try {
      setisloading(true)
      const response = await ValidateBet(authCtx.Id, id, betId, authCtx.token)
      console.log(response.data)
      setRef(response.data.requestID)
      if(response.data.status === "Success"){
        Alert.alert(response.data.status, `Confirm funding to bet Id of ${betId}`, [
          {
            text: "Cancel",
            onPress: () => {}
          },
          {
            text:'Confirm',
            onPress: () => toggleModal1()
          }
        ])
      }else{
        Alert.alert("Error", response.data, [
          {
              text:'Ok',
              onPress: () => {}
          }
        ])
      }
      setisloading(false)
    } catch (error) {
        // console.log(error.response.data)
        setisloading(true)
        Alert.alert("Error", `An Error occured while verifying account try again later`, [
          {
              text:'Ok',
              onPress: () => navigation.goBack()
          }
        ])
        setisloading(false)
        return;
      }
    }

    
    let refT = useRef(0);
  
    function handleClick() {
      refT.current = refT.current + 1;
      // alert('You clicked ' + ref.current + ' times!');
    }

    function toggleModal1(){
      setisSetpinModalVisible(!isSetpinModalVisible)
    }
  

    
    const pinValidateCheck = async () => {
      if(refT.current > 3){
        Alert.alert("", "To many attempt, try again later", [
          {
            text: "Ok",
            onPress: () => navigation.goBack()
          }
        ])
      }else{
        try {
          setischecking(true)
          const response = await ValidatePin(authCtx.Id, code, authCtx.token)
          // console.log(response)
          setCode('')
          betPayment(ref)
          setischecking(false)
        } catch (error) {
          setischecking(true)
          setCode('')
          setPinerrorMessage(error.response.data.message + "\n" + (3 - refT.current + ` trial${3-refT.current > 1 ? 's' : ""} remaining`))
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
  

    const betPayment = async () => {
      toggleModal1()
      try {
        setisloading(true)
        const response = await BetPay(ref, amount, authCtx.token, commissonvalue)
        console.log(response)
        if(response.message === "failed" || response.description === "Failed"  || response.message === "Insufficient Balance"){
          Alert.alert('Failed', response.data.description, [
            {
              text:"Ok",
              onPress:() => navigation.goBack()
            }
          ])
          return;
        }else{
          // schedulePushNotification()
          toggleModal()
        }
        setisloading(false)
    } catch (error) {
      console.log(error.response.data)
      setisloading(true)
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
      setisloading(false)
      return;
    }
    }

    if(isloading){
      return <LoadingOverlay message={"..."}/>
    }

  async function schedulePushNotification() {
    await Notification.scheduleNotificationAsync({
      content: {
        title: `Bet Funding 🔔`,
        body: `You successfully funded your betting account\nBet Id: ${betId}\nAmount: NGN${amount}\nRef: ${ref}\nDate: ${date} ${time}`,
        data: { data: 'goes here' },
      },
      trigger: { seconds: 10 },
    });
  }



  return (
    <ScrollView style={{marginTop:marginStyle.marginTp, marginHorizontal:10}} showsVerticalScrollIndicator={false}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.bettxt}>{route.params.name === "Betting and/or Lottery" ? "Betting and Lottery" : "Betting"}</Text>

      {
        pincheckifempty === "N" ?  Alert.alert("Message", "No transaction pin, set a transaction pin to be able to make transactions", [
          {
            text: "Ok",
            onPress: () => navigation.navigate('TransactionPin')
          },
          {
            text: "Cancel",
            onPress: () => navigation.goBack()
          }
        ]) 
        :
        <>
      <ImageBackground>
        <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center', }}>
        <Image contentFit='contain' source={require("../assets/1xbet-logo.png")} style={[styles.image]}/>
        <Image contentFit='contain' source={require("../assets/nairabet.png")} style={styles.image}/>
        <Image contentFit='contain' source={require("../assets/betkings.png")} style={[styles.image, {top:-8}]}/>
        <Image contentFit='contain' source={require("../assets/livescore.jpg")} style={[styles.image, {top:3}]}/>
        <Image contentFit='contain' source={require("../assets/bet9ja.png")} style={[styles.image, {position:'absolute',  left:'40%', top:"40%" }]}/>
        </View>
      </ImageBackground>
      
      <View style={{marginTop:20}}/>
      <View style={{marginHorizontal:10}}>

            {/* <Text style={styles.label}>Select Distribution Company</Text> */}

            <Dropdown
              style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={category}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Select Betting Platform' : '...'}
              searchPlaceholder="Search..."
              value={id}
              onFocus={() => setisFocus(true)}
              onBlur={() => setisFocus(false)}
              onChange={item => {
                  setid(item.value);
                  setisFocus(false);
                  commissionget(item.value)
              }}
            />
            <View style={{ marginBottom:20}}/>

            {id &&
              <>
                <Text style={styles.label}>Bet ID</Text>
                <Input placeholder={"Enter your Bet Id"} value={betId} onUpdateValue={updatehandleValue.bind(this, 'betid')}/>

                <View style={{ marginBottom:10}}/>
              </>
            }

            {betId && 
              <>
                <Text style={styles.label}>Amount</Text>
                <Input placeholder={"Amount to fund with"} value={amount} onUpdateValue={updatehandleValue.bind(this, 'amount')}/>
                {!amountCheck && 
                    <Text style={{marginBottom:20, color:'red'}}>Amount must be <MaterialCommunityIcons name="currency-ngn" size={14} />100 and above</Text>
                }

                <View style={{ marginBottom:20}}/>
              </>
            }

            {amountCheck && betId &&
              <>
                <View style={{marginHorizontal:20, marginTop:20}}>
                  <SubmitButton message={"Submit"} onPress={validateBet}/>
                </View>
              </>
            }
        </View>
        </>
      }

          <Modal isVisible={ismodalvisible}>
            <SafeAreaView style={styles.centeredView}>

            <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => [toggleModal(), schedulePushNotification(),navigation.goBack()]}>
              <MaterialIcons name="cancel" size={30} color="white" />
            </TouchableOpacity>
            <View style={styles.modalView}  ref={viewRef}>
            <Image source={require("../assets/igoepp_transparent2.png")} style={{height:130, width:130, position:'absolute', alignContent:'center', alignSelf:'center', top:DIMENSION.HEIGHT * 0.1,justifyContent:'center', opacity:0.3, }} contentFit='contain'/>
              <Text style={styles.modalText}>Reciept</Text>
                {
                  Platform.OS === "android" ? 
                    <View style={{borderBottomWidth:0.5, marginTop:5, borderStyle:"dashed"}}/>
                  :
                   <View style={{borderBottomWidth:0.5, marginTop:5}}/>
                }
                
                  <View style={{marginBottom:25, marginTop:25}}>
                      
                    <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                      <Text style={{fontFamily:'poppinsRegular', fontSize: 10}}>Bet Id :</Text>
                      <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{betId}</Text>
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
                      <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Date :</Text>
                      <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{date} {time}</Text>
                    </View>

                      <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center', marginTop: 20,}}>
                      
                        <TouchableOpacity style={{}} onPress={() =>  captureAndShare()}>
                          <Text><Entypo name="forward" size={24} color={Color.new_color} /></Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => captureAndSaveScreen()}>
                          <AntDesign name="download" size={24} color={Color.new_color} />
                        </TouchableOpacity>

                        <TouchableOpacity style={{}} onPress={() => [toggleModal(), schedulePushNotification(), navigation.goBack(),]}>
                          <Text style={{}}>Close</Text>
                        </TouchableOpacity>
                      </View>
                    </View>              
            </View>
            </SafeAreaView>
          </Modal>


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

    </ScrollView>
  )
}

export default Bet

const styles = StyleSheet.create({
  receipt: {
    width: 300,
    height: 400,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
  },
  bettxt:{
    fontSize: 18,
    color: Color.new_color,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
  }, 
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    width: DIMENSION.WIDTH  * 0.9,
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalView1: {
    backgroundColor: 'white',
    width: DIMENSION.WIDTH  * 0.9,
    borderRadius: 20,
    // flex:1,
    alignItems:'center',
    height: DIMENSION.HEIGHT * 0.4
  },
  modalText: {
    textAlign: 'center',
    fontSize:18, 
    fontFamily:'poppinsRegular'
  },
  image:{
    width: 60,
    height: 60,
    borderRadius:100,
  },
  dropdown: {
    maxHeight: 70,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    padding:10,
    // marginTop: 10,
    // paddingVertical:10
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  }, 
  placeholderStyle: {
    fontSize: 12,
  },
  selectedTextStyle:{
    fontSize:12
  },
  cancelbtn:{
    backgroundColor:Color.new_color,
    borderColor: Color.new_color,
    borderWidth: 1,
    justifyContent:'center',
    borderRadius: 3,
    width: DIMENSION.WIDTH * 0.36,
    padding: 5
  },
  canceltxt:{
    textAlign:'center',
    alignSelf:'center',
    fontFamily: 'poppinsMedium',
    fontSize: 12,
    color: Color.white
  },
})