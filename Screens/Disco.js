import { ScrollView, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, Alert, TextInput, Pressable, Keyboard } from 'react-native'
import React, { useContext, useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { Image, ImageBackground } from 'expo-image'
import { Dropdown } from 'react-native-element-dropdown'
import {MaterialIcons, MaterialCommunityIcons, Entypo, AntDesign} from '@expo/vector-icons' 
import * as Notifications from 'expo-notifications'
import Modal from 'react-native-modal'
import styled from 'styled-components'
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { DiscoPayment, HelperBillerCommission, HelperUrl, ValidateDisco, ValidatePin } from '../utils/AuthRoute'
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Border, Color, DIMENSION, FontSize, marginStyle } from '../Component/Ui/GlobalStyle'
import Input from '../Component/Ui/Input'
import SubmitButton from '../Component/Ui/SubmitButton'
import { AuthContext } from '../utils/AuthContext'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'
import OTPFieldInput from '../Component/Ui/OTPFieldInput'
import GoBack from '../Component/Ui/GoBack'
import Flat from '../Component/Ui/Flat'
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


const Disco = ({route, navigation}) => {
  const [category, setcategory] = useState([])
  const [isLoading, setisLoading] = useState(false)
  const [isFocus, setisFocus] = useState(false)
  const [id, setid] = useState()
  const authCtx = useContext(AuthContext)
  const [isModalVisble, setIsModalVisible] = useState(false)
  const [isConfirmModalVisble, setIsConfirmModalVisible] = useState(false)
  const [amount, setAmount] = useState()
  const [username, setUserName] = useState()
  const [useraddress, setUserAddress] = useState()
  const [token, setToken] = useState()
  const [ref, setRef] = useState()
  const [meterno, setMeterNo] = useState()
  const authId = route?.params?.id

  const [commissonvalue, setcommissonvalue] = useState()
  const [responseToken, setresponseToken] = useState()
  const [responseId, setresponseId] = useState()
  const [responseMessage, setresponseMessage] = useState()

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
  const amountCheck = amount >= 1000

  


 

  useEffect(() => {
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
      return;
      })
  }, [])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
    try {
      setisLoading(true)
      const response = await HelperUrl(authCtx.Id, authCtx.token)
      // console.log(response)
      setpincheckifempty(response.transaction_pin_setup)
      setisLoading(false)
    } catch (error) {
      setisLoading(true)
      // console.log(error)
      Alert.alert('Error', "An error occured try again later", [
        {
          text:"Ok",
          onPress: () => navigation.goBack()
        }
      ])
      setisLoading(false)
      // return
    }
    })
    return unsubscribe;
  }, [])

  const updatehandleValue = (inputType, enteredValue) => {
    switch (inputType) {
      case 'meterno':
        setMeterNo(enteredValue)
        break;
      case 'amount':
        setAmount(enteredValue)
        break;
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
  
  const toggleConfirmModal =  () => {
    setIsConfirmModalVisible(!isConfirmModalVisble)
  }

  const toggleModal =  () => {
    setIsModalVisible(!isModalVisble)
  }

  const validatehandle = async () => {
    // console.log(meterno, amount, id)
    try {
      setisLoading(true)
      const response = await ValidateDisco(authCtx.Id, id, meterno, authCtx.token)
      // console.log(response.data)
      if(response.data.status === 'Success'){
        if(Platform.OS === 'ios'){
            return  navigation.navigate('DiscoIos', {data: response.data, meterno: meterno, id: id, amount: amount, commissonvalue: commissonvalue, id:id })
        }else{
          setRef(response.data.requestID)
          setUserAddress(response.data.customerAddress)
          setUserName(response.data.customerName)
          toggleConfirmModal()
        }
      }else{
        Alert.alert("Error", "An error occured while validating meter no. Please  check your meter no and try again later", [
          {
              text: "Ok",
              onPress: () => navigation.goBack()
          },
        ])
      }
    setisLoading(false)
    } catch (error) {
      setisLoading(true)
      Alert.alert("Sorry", "An error occured try again later", [
        {
          text:"Ok",
          onPress: () => navigation.goBack()
        }
      ])
      setisLoading(false)
      return;
      // console.log(error)
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
        makePayment()
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
              onPress:() => navigation.goBack()
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
      console.log(error)
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

  // console.log(responseId, responseToken, responseMessage)

  async function schedulePushNotification(response) {
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
  return (
    <ScrollView style={{marginTop: marginStyle.marginTp, marginHorizontal:10}}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.discotxt}>Disco</Text>

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
        <Image contentFit='contain' source={require("../assets/eedcc.png")} style={[styles.image]}/>
        <Image contentFit='contain' source={require("../assets/ekedc.jpg")} style={styles.image}/>
        <Image contentFit='contain' source={require("../assets/ibedc1.jpg")} style={[styles.image, ]}/>
        <Image contentFit='contain' source={require("../assets/kedco.jpg")} style={[styles.image]}/>
        <Image contentFit='contain' source={require("../assets/phedc.jpg")} style={[styles.image, {position:'absolute',  left:'40%', top:"70%" }]}/>
        </View>
      </ImageBackground>

      <View style={{marginTop:35}}/>
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
            placeholder={!isFocus ? 'Select Distribution Company' : '...'}
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
                <Text style={styles.label}>Meter No</Text>
                <Input placeholder={"Enter Meter No"} value={meterno} keyboardType={"numeric"}  onUpdateValue={updatehandleValue.bind(this, 'meterno')}/>
              </>

            }

            {meterno && 
              <>
                <View style={{ marginBottom:10}}/>

                <Text style={styles.label}>Amount to recharge</Text>
                <Input placeholder={"Amount to fund with"} value={amount} keyboardType={"numeric"} onUpdateValue={updatehandleValue.bind(this, 'amount')}/>
                
                {!amountCheck && 
                   <Text style={{marginBottom:20, color:'red'}}>Amount must be <MaterialCommunityIcons name="currency-ngn" size={14} />1000 and above</Text>
                }
                <View style={{ marginBottom:20}}/>
              </>
            }
             {!meterno || amountCheck &&
              <>
                <View style={{marginHorizontal:20, marginTop:20}}>
                    <SubmitButton message={"Submit"} onPress={validatehandle}/>
                </View>
              </>
            
            }
          </View>
        </>
      }

        <Modal isVisible={isConfirmModalVisble}>
            <SafeAreaView style={styles.centeredView}>

            <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => [toggleConfirmModal(), navigation.goBack()]}>
              <MaterialIcons name="cancel" size={30} color="white" />
            </TouchableOpacity>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Confirm Payment</Text>
                {/* <Text style={{fontFamily:'poppinsRegular'}}>-------------------------------------------</Text> */}

                  <View style={{marginBottom:10, marginTop:10}}>
                      
                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular',  fontSize:10}}>Meter No :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{meterno}</Text>
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
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Amount :</Text>
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
                        
                        <TouchableOpacity style={styles.viewbtn} onPress={() => toggleConfirmModal()}>
                              <Text style={styles.viewtext}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cancelbtn} onPress={() => [toggleConfirmModal(), toggleModal1()]}>
                            <Text style={styles.canceltext}>Confirm</Text>
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

        <Modal isVisible={isModalVisble}>
            <SafeAreaView style={styles.centeredView}>

            <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => [toggleModal(), schedulePushNotification(), navigation.goBack()]}>
              <MaterialIcons name="cancel" size={30} color="white" />
            </TouchableOpacity>
            <View style={styles.modalView} ref={viewRef}>
            <Image source={require("../assets/igoepp_transparent2.png")} style={{height:130, width:130, position:'absolute', alignContent:'center', alignSelf:'center', top:DIMENSION.HEIGHT * 0.141,justifyContent:'center', opacity:0.3, }} contentFit='contain'/>
              <Text style={styles.modalText}>Reciept</Text>
                {/* <Text style={{fontFamily:'poppinsRegular'}}>-------------------------------------------</Text> */}

                {
                  Platform.OS === "android" ? 
                    <View style={{borderBottomWidth:0.5, marginTop:5, borderStyle:"dashed"}}/>
                  :
                   <View style={{borderBottomWidth:0.5, marginTop:5}}/>
                }
                
                
                  <View style={{marginBottom:25, marginTop:15}}>
                        
                      
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

                      {/* <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Bonus Token:</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}></Text>
                      </View> 

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Bonus Unit :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}></Text>
                      </View> 

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Units Purchased :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}></Text>
                      </View> 

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Vat :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}></Text>
                      </View> 

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Units Purchased :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}></Text>
                      </View> 


                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Kct1:</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}></Text>
                      </View> 

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Kct2:</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}></Text>
                      </View> 

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Arrears Remaining :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}></Text>
                      </View>  */}

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
                        
                        <TouchableOpacity style={styles.sharebtn} onPress={() =>  captureAndShare()}>
                              <Entypo name="forward" size={24} color={Color.new_color}/>
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


    </ScrollView>
  )
}

export default Disco

const styles = StyleSheet.create({
  receipt: {
    width: 300,
    height: 400,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
  },
  image:{
    width: 60,
    height: 60,
    borderRadius:100,
  },
  modalView1: {
    backgroundColor: 'white',
    width: DIMENSION.WIDTH  * 0.9,
    borderRadius: 20,
    // flex:1,
    alignItems:'center',
    height: DIMENSION.HEIGHT * 0.4
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
  selectedTextStyle:{
    fontSize:12
  },
  discotxt:{
    fontSize: 18,
    color: Color.new_color,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
  }, 
  dropdown: {
    maxHeight: 100,
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
    padding: 20,
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