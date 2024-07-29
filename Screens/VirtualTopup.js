import { SafeAreaView, ScrollView, StyleSheet, Text, Alert, TouchableOpacity, View, TextInput, Pressable, Keyboard } from 'react-native'
import React, {useEffect, useState, useContext} from 'react'
import { Dropdown } from 'react-native-element-dropdown'
import {Platform} from 'react-native';
import { Image, ImageBackground } from 'expo-image'
import Modal from 'react-native-modal'
import {MaterialCommunityIcons, MaterialIcons, Entypo, AntDesign} from '@expo/vector-icons'
import * as Notifications from 'expo-notifications'
import axios from 'axios'
import { useRef } from 'react'
import styled from 'styled-components'
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { HelperBillerCommission, HelperSelf, HelperThirdParty, HelperUrl, HelperVtuAirtime, HelperVtuData, ValidatePin } from '../utils/AuthRoute'
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Border, Color, DIMENSION, FontSize, marginStyle } from '../Component/Ui/GlobalStyle'
import Input from '../Component/Ui/Input'
import SubmitButton from '../Component/Ui/SubmitButton'
import { AuthContext } from '../utils/AuthContext'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'
import OTPFieldInput from '../Component/Ui/OTPFieldInput'
import GoBack from '../Component/Ui/GoBack'

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


const data = [
  { label: 'Self', value: 'self' },
  { label: 'Third Party', value: 'thirdparty' },
]



const VirtualTopUp = ({navigation, route}) => {
  const [category, setcategory] = useState([])
  const [isloading, setisloading] = useState(false)
  const [id, setid] = useState('')
  const [isFocus, setisFocus] = useState(false)
  const [isSelfFocus, setIsSelfFocus] = useState(false)
    
    const [requestId, setRequestId] = useState()
    const [bosquet, setBosquet] = useState([])
    const [bosquetData, setBosquetData] = useState()
    const [bosquetPrice, setBosquetPrice] = useState()
    
    
    const [IsbosquetFocus, setIsBosquetFocus] = useState(false)
    const [self, setSelf] = useState('')
    const [phoneValidation, setPhoneValidation] = useState('')
    const [ref, setRef] = useState()
    const [amount, setAmount] = useState()
    const [isModalVisble, setModalVisible] = useState(false)
    const [ischecking, setischecking] = useState(false)
    const [pinerrormessage, setPinerrorMessage] = useState('')
    const [commissonvalue, setcommissonvalue] = useState()

    const [responseMessage, setresponseMessage] = useState()
    
    const [code, setCode] = useState('')
    const [pinReady, setPinReady] = useState(false)
    const MAX_CODE_LENGTH = 4;


    const maindate = new Date() 
    const date = maindate.toLocaleDateString()
    const time = maindate.toLocaleTimeString()

    
  const [pinT, setpinT] = useState()
  const [pinvalid, setpinvalid] = useState(false)
  const [pincheckifempty, setpincheckifempty] = useState([])
  const [isSetpinModalVisible, setisSetpinModalVisible] = useState(false)
    
    // const phone = self === "self" && authCtx.phone 
    const DATACHECK = id.includes('DATA')
    const AIRTIMECHECK = id.includes('AIRTIME')
    const amountCheck = amount >= 100
    const phonecheck = phoneValidation.length === 11
    const authCtx = useContext(AuthContext)
    const authId = route?.params?.id
    let reqId;

    // console.log(authCtx.phone)

    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', async () => {
        try {
          setisloading(true)
          const response = await HelperUrl(authCtx.Id, authCtx.token)
          setpincheckifempty(response.transaction_pin_setup)
          setisloading(false)
        } catch (error) {
          setisloading(true)
          setisloading(false)
          return;
        }
      })
      return unsubscribe;
    }, [])

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

  useEffect(() => {
    setisloading(true)
    const url = `https://igoeppms.com/igoepp/public/api/auth/billpayment/getAllBillersByCategory/${authId}`
    const response = axios.get(url, {
        headers:{
            Accept:'application/json',
            Authorization: `Bearer ${authCtx.token}`
        }
    }).then((res) => {
        // console.log(res.data)dx
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
      })
      setisloading(false)
  }, [])

  const updatevalue = (inputType, enteredValue) => {
    switch(inputType){
        case 'phonevalidation':
            setPhoneValidation(enteredValue);
            break;
        case 'amount':
            setAmount(enteredValue);
            break;
    }
}

const getBouquets = (value) => {
    // console.log(authId, id)
    
    const url = `https://igoeppms.com/igoepp/public/api/auth/billpayment/getAllBouquetByBillerID/${authId}/${value}`
    const response = axios.get(url, {
      headers:{
        Accept:'application/json',
        Authorization: `Bearer ${authCtx.token}`
      }
    }).then((res) => {
      // console.log(res.data.data.bouquets)
      var count = Object.keys(res.data.data.bouquets).length;
      let catarray = []
      for (var i = 0; i < count; i++){
        catarray.push({
          label: res.data.data.bouquets[i].name,
          value: res.data.data.bouquets[i].code,
          price: res.data.data.bouquets[i].price
        })
        // setCityCode(response.data.data[i].lga_code)
      }
      setBosquet(catarray)
    }).catch((error) => {
      // console.log(error.response)
      return;
    })
  }
  const toggleModal = () => {
    setModalVisible(!isModalVisble)
  }

  const TopupAirtime = () => {
    if(self === 'self'){
        // alert(self + " self")
      if(AIRTIMECHECK){
        if(amountCheck && authCtx.phone){
          // alert(amount + " " + authCtx.phone + " " + self)
          mobilevalidationSelf()
        }else{
          Alert.alert("Error", "invalid details")
        }
      }else if(DATACHECK){
        if(bosquetData){
          mobilevalidationSelf()
          // alert("DATA" + " "+ bosquetData + " " +self)
        }else{

        }
      }
    }else{
      if(AIRTIMECHECK){
        if(amountCheck && phonecheck){
          mobilevalidationThirdparty()
        }else{
          Alert.alert("Error", "invalid details")
        }
      }else if(DATACHECK){
        if(bosquetData && phonecheck){
          mobilevalidationThirdparty()
        }else{
          Alert.alert("Error", "invalid details")
        }
      }
    }
  }

    // console.log(requestId)
    
    const mobilevalidationThirdparty = async () => {
      try {
        setisloading(true)
          const response = await HelperThirdParty(authCtx.Id, phoneValidation, authCtx.token)
          // console.log(response)
          setRequestId(response.requestID)
          if(response.status === "Success"){
              if(DATACHECK){
                  Alert.alert("Confirm Purchase", `Confirm Data Topup for ${phoneValidation} `, [
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
                if(AIRTIMECHECK){
                  Alert.alert("Confirm Purchase", `Confirm Airtime Purchase for ${phoneValidation}`, [
                    {
                      text: "Cancel",
                      onPress: () => []
                    },
                    {
                      text:'Confirm',
                      onPress: () => toggleModal1()
                    }
                  ])
                }
              }
              setisloading(false)
          }else{
              Alert.alert("Error", response, [
                  {
                      text:"Ok",
                      onPress: () => {}
                  }
              ])
          }
          setisloading(false)
      } catch (error) {
          // console.log(error)
          setisloading(true)
          Alert.alert("Error", "An error occured please try again later", [
            {
              text:'Ok',
              onPress: () => navigation.goBack()
            }
          ])
          setisloading(false)


      }
  }

    const mobilevalidationSelf = async () => {
      try {
        setisloading(true)
        const response = await HelperSelf(authCtx.Id, authCtx.token)
        // console.log(response)
        setRequestId(response.requestID)
        if(response.status === "Success"){
          if(DATACHECK){
            Alert.alert("Confirm Purchase", `Confirm Data Topup for ${authCtx.phone}`, [
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
            if(AIRTIMECHECK){
              Alert.alert("Confirm Purchase", `Confirm Airtime Purchase for ${authCtx.phone}`, [
                {
                  text: "Cancel",
                  onPress: () => []
                },
                {
                  text:'Confirm',
                  onPress: () => toggleModal1()
                }
              ])
            }
          }
          setisloading(false)
          }else{
            Alert.alert("Error", response, [
              {
                text:"Ok",
                onPress: () => {}
              }
            ])
          }
          setisloading(false)
      } catch (error) {
          // console.log(error)
          setisloading(true)
          Alert.alert("Error", "An error occured please try again later", [
            {
              text:'Ok',
              onPress: () => navigation.goBack()
            }
          ])
          setisloading(false)

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
          onPress: () => navigation.goBack()
        }
      ])
    }else{
      try {
        setischecking(true)
        const response = await ValidatePin(authCtx.Id, code, authCtx.token)
        // console.log(response)
        setCode('')
        if(DATACHECK){
          datatoptup() 
        }else{
          airtimetopup()
        }
        setischecking(false)
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

  const commissionget = async (id) => {
     try {
       const response = await HelperBillerCommission(id, authCtx.token)
       console.log(response)
       setcommissonvalue(response)
     } catch (error) {
       return;
     }
   }


  
  const airtimetopup = async () => {
    toggleModal1()
    try {
      setisloading(true)
        const response = await HelperVtuAirtime(requestId, id, amount, authCtx.token, commissonvalue)
        // console.log(response)

        if(response.message === "failed" || "Failed" && response.description === "Insufficient wallet balance"){
            Alert.alert("Failed", response.description, [
              {
                text:"Ok",
                onPress:() => navigation.goBack()
              }
            ])
          }else{
            // schedulePushNotification(response)
            setRef(response.requestID)
            setresponseMessage(response.message)
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

const datatoptup = async() => {
    toggleModal1()
    // console.log(requestID, id, bosquetPrice, bosquetData, authCtx.token)
    try {
      setisloading(true)
        const response = await HelperVtuData(requestId, id, bosquetPrice, bosquetData, authCtx.token, commissonvalue)
        // console.log(response)

        if(response.message === "failed" || "Failed" && response.description === "Insufficient wallet balance"){
            Alert.alert("Failed", response.description, [
              {
                text:"Ok",
                onPress:() => navigation.goBack()
              }
            ])
          }else{
            // schedulePushNotification(response)
            setresponseMessage(response.message)
            setRef(response.requestID)
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

  async function schedulePushNotification(response) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${id} Purchase 🔔`,
        body: `${id} ${responseMessage}.\nAmount: ${DATACHECK ? bosquetPrice : amount} \nPhone Number ${self === "self" ? authCtx.phone : phoneValidation} \nReference: ${ref} \nDate: ${date} ${time}`,
        data: { data: 'goes here' },
      },
      trigger: { seconds: 10 },
    });
  }


  if(isloading){
    return <LoadingOverlay message={"..."}/>
  }
  return (
    <ScrollView style={{marginTop:marginStyle.marginTp, marginHorizontal:10}}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.virtualtopuptxt}>Virtual Top Up</Text>

      
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
      <ImageBackground style={{flexDirection:'row', alignItems:'center', justifyContent:'space-evenly',}}>
        <Image source={require("../assets/Glo_Limited.png")} style={[styles.image, {height:60}]}/>
        <Image source={require("../assets/mtn.png")} contentFit='contain' style={styles.image}/>
        <Image source={require("../assets/9Mobile.jpg")} contentFit='contain' style={styles.image}/>
        <Image contentFit='contain' source={require("../assets/airtel.png")} style={styles.image}/>
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
            placeholder={!isFocus ? 'Select Network' : '...'}
            searchPlaceholder="Search..."
            value={id}
            onFocus={() => setisFocus(true)}
            onBlur={() => setisFocus(false)}
            onChange={item => {
                setid(item.value);
                setisFocus(false);
                getBouquets(item.value)
                commissionget(item.value)
            }}
            />
            <View style={{ marginBottom:20}}/>

            {id && 
                <>
                {/* <Text style={styles.label}>Buy {id} For</Text> */}

                <Dropdown
                style={[styles.dropdown, isSelfFocus && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isSelfFocus ? 'Self or Third Party' : '...'}
                searchPlaceholder="Search..."
                value={self}
                onFocus={() => setIsSelfFocus(true)}
                onBlur={() => setIsSelfFocus(false)}
                onChange={item => {
                    setSelf(item.value);
                    setIsSelfFocus(false);
                    
                    
                }}
                />
            <View style={{ marginBottom:30}}/>
                </>
            }

            {DATACHECK && 
                <>
                {/* <Text style={styles.label}>Select Data Plan</Text> */}

                <Dropdown
                style={[styles.dropdown, IsbosquetFocus && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={bosquet}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!IsbosquetFocus ? 'Select Data Plan' : '...'}
                searchPlaceholder="Search..."
                value={bosquetData}
                onFocus={() => setIsBosquetFocus(true)}
                onBlur={() => setIsBosquetFocus(false)}
                onChange={item => {
                    setBosquetData(item.value);
                    setBosquetPrice(item.price)
                    setIsBosquetFocus(false);
                }}
                />
            <View style={{ marginBottom:20}}/>
                </>
            }

            {AIRTIMECHECK &&
                <>
                <Text style={styles.label}>Amount</Text>
                <Input placeholder={"Enter Amount"} maxLength={11} value={amount} onUpdateValue={updatevalue.bind(this, 'amount')}  keyboardType={'numeric'}/>
                {!amountCheck && 
                    <Text style={{marginBottom:20, color:'red'}}>Amount must be <MaterialCommunityIcons name="currency-ngn" size={14} />100 and above</Text>
                }
                </>
            }

            {self && 
            <>
            <Text style={styles.label}>Phone Number</Text>
            <Input placeholder={"Phone Number"} maxLength={11} value={self === "self" ? authCtx.phone : phoneValidation} onUpdateValue={updatevalue.bind(this, 'phonevalidation')}  keyboardType={'numeric'} editable={self === "self" ? false : true}/>
            </>
            }

            {!id || !self   ? "" : 
              <View style={{marginHorizontal:20, marginTop:20}}>
                <SubmitButton message={"Submit"} onPress={TopupAirtime}/>
              </View>
            }
          </View>
          </>

        }

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



            <Modal isVisible={isModalVisble}>
            <SafeAreaView style={styles.centeredView}>

            <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => [toggleModal(), schedulePushNotification(), navigation.goBack()]}>
              <MaterialIcons name="cancel" size={30} color="white" />
            </TouchableOpacity>
            <View style={styles.modalView} ref={viewRef}>
            <Image source={require("../assets/igoepp_transparent2.png")} style={{height:130, width:130, position:'absolute', alignContent:'center', alignSelf:'center', top:DIMENSION.HEIGHT * 0.1,justifyContent:'center', opacity:0.3, }} contentFit='contain'/>
              <Text style={styles.modalText}>Reciept</Text>
                {/* <Text style={{fontFamily:'poppinsRegular'}}>------------------------------</Text> */}
                {
                  Platform.OS === "android" ? 
                    <View style={{borderBottomWidth:0.5, marginTop:5, borderStyle:"dashed"}}/>
                  :
                   <View style={{borderBottomWidth:0.5, marginTop:5}}/>
                }
                
                  <View style={{marginBottom:25, marginTop:25}}>
                      
                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Phone Number</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{self === "self"  ? authCtx.phone : phoneValidation}</Text>
                      </View>

                       <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>{DATACHECK ? "Data Price" : "Airtime Price"} :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{DATACHECK ? bosquetPrice : amount }</Text>
                      </View>

                      {DATACHECK &&
                         <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                         <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Data Plan :</Text>
                         <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{bosquetData}</Text>
                       </View> 
                      }


                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Ref :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{requestId}</Text>
                      </View> 

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Date :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{date} {time}</Text>
                      </View>

                       <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center', marginTop: 20,}}>
                        
                          <TouchableOpacity style={{}} onPress={() => captureAndShare()}>
                                <Text><Entypo name="forward" size={24} color={Color.new_color} /></Text>
                          </TouchableOpacity>

                          <TouchableOpacity onPress={() => captureAndSaveScreen()}>
                            <AntDesign name="download" size={24} color={Color.new_color} />
                          </TouchableOpacity>

                          <TouchableOpacity style={{}} onPress={() => [toggleModal(), schedulePushNotification(), navigation.goBack()]}>
                              <Text style={{}}>Close</Text>
                          </TouchableOpacity>
                        </View>
                    </View>              
            </View>
            </SafeAreaView>
          </Modal>
    </ScrollView>
  )
}

export default VirtualTopUp

const styles = StyleSheet.create({
  virtualtopuptxt:{
    fontSize: 16,
    color: Color.new_color,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
  },
  cancel:{
    backgroundColor:Color.new_color,
    borderColor: Color.new_color,
    borderWidth: 1,
    justifyContent:'center',
    borderRadius: 3,
    width: DIMENSION.WIDTH * 0.36,
    padding: 5
  },
  modalView1: {
    backgroundColor: 'white',
    width: DIMENSION.WIDTH  * 0.9,
    borderRadius: 20,
    // flex:1,
    alignItems:'center',
    height: DIMENSION.HEIGHT * 0.4
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
  image:{
    width: 40,
    height: 40,
    borderRadius:100,
    padding:10,
  },
  internettxt:{
    fontSize: 18,
    color: Color.new_color,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
  }, 
  dropdown: {
    maxHeight: 70,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    padding:10,
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
  }
})