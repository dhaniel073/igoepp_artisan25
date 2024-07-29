import { Alert, Keyboard, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { ImageBackground, Image } from 'expo-image'
import { Dropdown } from 'react-native-element-dropdown'
import axios from 'axios'
import { HelperBillerCommission, HelperUrl, ValidatePin, WaecCard } from '../utils/AuthRoute'
import * as Notifications from 'expo-notifications'
import Modal from 'react-native-modal'
import {MaterialIcons, MaterialCommunityIcons, Entypo, AntDesign} from '@expo/vector-icons'
import { useRef } from 'react'
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



const Education = ({route, navigation}) => {
  const [category, setcategory] = useState([])
  const [isLoading, setisLoading] = useState(false)
  const [isFocus, setisFocus] = useState(false)
  const [id, setid] = useState()
  const [isEduFocus, setIsEduFocus] = useState(false)
  const [edu, setEdu] = useState('')
  const [bouquest, setBosquet] = useState([])
  const [pin, setPin] = useState()
  const [ref, setRef] = useState()
  const [price, setPrice] = useState('')
  const [isModalVisble, setIsModalVisible] = useState(false)
  const authId = route?.params?.id
  const authCtx = useContext(AuthContext)
  const [pinT, setpinT] = useState()
  const [pinvalid, setpinvalid] = useState(false)
  const [pincheckifempty, setpincheckifempty] = useState([])
  const [isSetpinModalVisible, setisSetpinModalVisible] = useState(false)
  const [pinerrormessage, setPinerrorMessage] = useState('')
  const [ischecking, setischecking] = useState(false)
  const [commissonvalue, setcommissonvalue] = useState()

  const [responseToken, setresponseToken] = useState()
  const [responseId, setresponseId] = useState()
  const [responseMessage, setresponseMessage] = useState()

  const [code, setCode] = useState('')
  const [pinReady, setPinReady] = useState(false)
  const MAX_CODE_LENGTH = 4;

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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        setisLoading(true)
        const response = await HelperUrl(authCtx.Id, authCtx.token)
        setpincheckifempty(response.transaction_pin_setup)
        setisLoading(false)
      } catch (error) {
        setisLoading(true)
        Alert.alert('Error', "An error occured try again later", [
          {
            text:"Ok",
            onPress: () => navigation.goBack()
          }
        ])
        setisLoading(false)
        // return;
      }
    })
    return unsubscribe;
  }, [])

  useEffect(() => {
    setisLoading(true)
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
      setisLoading(false)
  }, [])

  const toggleModal =  (value) => {
    setIsModalVisible(!isModalVisble)
    reqId = value
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
        validate()
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


  const validate = async () => {
    toggleModal1()
    try{
      setisLoading(true)
      const response = await WaecCard(authCtx.Id, id, edu, price, authCtx.token, commissonvalue)
      // console.log(response)
      if(response.data.message === "failed" || "Failed" && response.data.description === "Insufficient wallet balance"){
        Alert.alert("Failed", response.data.description, [
          {
            text:"Ok",
            onPress:() => navigation.goBack()
          }
        ])
      }else{
        setresponseToken(response.data.PIN)
        setresponseId(response.data.requestID)
        setresponseMessage(response.data.status)
        setRef(response.data.requestID)
        setPin(response.data.PIN)
        toggleModal()
      }
      setisLoading(false)
  }catch(error) {
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

  if(isLoading){
      return <LoadingOverlay message={"..."}/>
  }


  async function schedulePushNotification(response) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `WAEC Pin 🔔`,
        body: `${responseMessage}\nWaec Pin: ${pin}\nAmount: ${price}\nRef: ${responseId}\nDate: ${date} ${time}`,
        data: { data: 'goes here' },
      },
      trigger: { seconds: 10 },
    });
  }


  return (
    <ScrollView style={{marginTop:marginStyle.marginTp, marginHorizontal:10}} showsVerticalScrollIndicator={false}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.educationtxt}>Education</Text>

     
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
          <Image contentFit='contain' source={require("../assets/waec.png")} style={[styles.image]}/>
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
            placeholder={!isFocus ? 'Select Option' : '...'}
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
              {/* <Text style={styles.label}>Buy {id} Pin</Text> */}

                  <Dropdown
                  style={[styles.dropdown, isEduFocus && { borderColor: 'blue' }]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={bouquest}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isEduFocus ? 'Select Scratch Card Plan' : '...'}
                  searchPlaceholder="Search..."
                  value={edu}
                  onFocus={() => setIsEduFocus(true)}
                  onBlur={() => setIsEduFocus(false)}
                  onChange={item => {
                      setEdu(item.value);
                      setIsEduFocus(false);
                      setPrice(item.price)
                  }} 
                  />
                  <View style={{ marginBottom:20}}/>  
              </>

              }

              {
              price &&
              <>
              <Text style={styles.label}>Price</Text>
              <Input placeholder={"Amount to fund with"} value={price} editable={false}/>
              </>
              }

              {/* <View style={{ marginBottom:20}}/> */}

              {edu && 
              <View style={{marginHorizontal:20, marginTop:20}}>
              <SubmitButton message={"Submit"} onPress={toggleModal1}/>
              </View>
              }
            </View>
          </>
        }
        



          <Modal isVisible={isModalVisble}>
            <SafeAreaView style={styles.centeredView}>

            <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => [toggleModal(), schedulePushNotification(), navigation.goBack()]}>
              <MaterialIcons name="cancel" size={30} color="white" />
            </TouchableOpacity>

            <View style={styles.modalView} ref={viewRef}>
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
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Ref :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{ref}</Text>
                      </View>

                       <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Amount Funded :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{price}</Text>
                      </View>


                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Waec Pin :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{pin}</Text>
                      </View> 

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Date :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:10}}>{date} {time}</Text>
                      </View>

                       <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center', marginTop: 20,}}>
                        
                          <TouchableOpacity style={{}} onPress={() => captureAndShare()}>
                            <Entypo name="forward" size={24} color={Color.new_color}  />
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

export default Education

const styles = StyleSheet.create({
  receipt: {
    width: 300,
    height: 400,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
  },
  educationtxt:{
    fontSize: 18,
    color: Color.new_color,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
  }, 
  modalView1: {
    backgroundColor: 'white',
    width: DIMENSION.WIDTH  * 0.9,
    borderRadius: 20,
    // flex:1,
    alignItems:'center',
    height: DIMENSION.HEIGHT * 0.4
  },
  image:{
    width: 60,
    height: 60,
    borderRadius:100,
    padding:10
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
  dropdown: {
    maxHeight: 70,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    padding:8,
    // marginTop: 10,
    // paddingVertical:10
  },
  selectedTextStyle:{
    fontSize:12
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
    fontSize: 13,
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