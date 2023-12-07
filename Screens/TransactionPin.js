import { Platform, SafeAreaView, StyleSheet, Text, TextInput, View, ScrollView, Switch, Alert, TouchableOpacity } from 'react-native'
import React, { useContext, useRef, useState, useEffect } from 'react'
import Modal from 'react-native-modal'
import * as LocalAuthentication from 'expo-local-authentication'
import {MaterialIcons} from '@expo/vector-icons'
import { AuthContext } from '../utils/AuthContext'
import { HelperUrl, SetupPin, UpdatePin, ValidatePin } from '../utils/AuthRoute'
import { Color, DIMENSION, marginStyle } from '../Components/Ui/GlobalStyle'
import GoBack from '../Components/Ui/GoBack'
import Input from '../Components/Ui/Input'
import LoadingOverlay from '../Components/Ui/LoadingOverlay'
import SubmitButton from '../Components/Ui/SubmitButton'


const TransactionPin = ({navigation, route}) => {
  // const length = 4
  // const disabled = false
  // const inputRefs = useRef([])
  // const value = []
  const  [pin, setpin] = useState()
  const  [pin2, setpin2] = useState()
  const  [pinupdate, setpinupdate] = useState()
  const [pinvalid, setpinvalid] = useState(false)
  const [pinvalid2, setpinvalid2] = useState(false)
  const [updatepinvalid, setupdatepinvalid] = useState(false)
  const authCtx = useContext(AuthContext)
  const [isloading, setisloading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pinset, setPinSet] = useState(true)
  const [isSetpinModalVisible, setisSetpinModalVisible] = useState(false)
  const [isSetpinModalVisible2, setisSetpinModalVisible2] = useState(false)
  const [isUpdatepinModalVisible, setisUpdatepinModalVisible] = useState(false)
  const [ischecking, setischecking] = useState(false)
  const [pinerrormessage, setPinerrorMessage] = useState('')



  const [check, setCheck] = useState([])
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
      Alert.alert("Error", "Error fetching data", [
        {
          text:'Ok',
          onPress: () => navigation.goBack()
        }
      ])
      setisloading(false)
      }
    })
    return unsuscribe;
  }, [])
   
  function toggleTransactionpin(){
    if(check === "N"){
      setisSetpinModalVisible(!isSetpinModalVisible)
      togglepin()
    }else{
      setisSetpinModalVisible(!isSetpinModalVisible)
    }
  }

  function toggleTransactionpin2 (){
    setisSetpinModalVisible2(!isSetpinModalVisible2)
  }

  

  function togglepin(){
    setPinSet(previous => !previous)
  }

  function togglepin2() {
    return 
  }

  function toggleUpdatePin(){
    setisUpdatepinModalVisible(!isUpdatepinModalVisible)
  }

 
  const pinhandler = async () => {
    try {
      setisloading(true)
      const response = await SetupPin(authCtx.Id, pin, authCtx.token )
      // console.log(response)
      toggleTransactionpin()
      setpin()
      if(check === "N"){
        setPinSet(previous => !previous)
      }else{
        return;
      }
      setisloading(false)
      Alert.alert("Success", "Pin set successfully", [
        {
          text: "Ok",
          onPress: () => navigation.goBack()
        }
      ])
    } catch (error) {
      setisloading(true)
      // console.log(error)
      setpin()
      Alert.alert("Error", "An error occured while setting up your transaction pin")
      setisloading(false)
    }
  }

  const pinvalidate = async () => {
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
        const response = await ValidatePin(authCtx.Id, pin2, authCtx.token )
        console.log(response)
        setpin2()
        toggleTransactionpin2()
        toggleUpdatePin()
        setischecking(false)
      } catch (error) {
        setischecking(true)
        console.log(error)
        setpin2()
        setPinerrorMessage(error.response.data.message + "\n" + (3 - refT.current + " attempts remaining"))
        console.log(error.response)
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

  let refT = useRef(0);
  
  function handleClick() {
    refT.current = refT.current + 1;
    // alert('You clicked ' + ref.current + ' times!');
  }


  const updatepinhandler = async () => {
    try {
      setischecking(true)
      const response = await UpdatePin(authCtx.Id, pinupdate, authCtx.token)
      console.log(response)
      setpinupdate()
      toggleTransactionpin2()
      Alert.alert("Success", "Pin set successfully", [
        {
          text: "Ok",
          onPress: () => navigation.goBack()
        }
      ])
      setischecking(false)
    } catch (error) {
      setischecking(true)
      setpinupdate()
      setischecking(false)
    }
  }


  if(isloading){
    return <LoadingOverlay message={"..."}/>
  }

  return (
    <ScrollView style={{marginTop:marginStyle.marginTp, marginHorizontal:10, flex:1}}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.transactiontxt}>Transaction Pin</Text>

      <View style={{ flexDirection: 'row', marginTop: '5%', justifyContent:'space-between', marginHorizontal:10 }}>
        <View style={{flexDirection:'row'}}>
          <Text style={styles.text}>Set Pin</Text>
        </View>

        <Switch
          trackColor={{ false: 'grey', true: Color.new_color }}
          thumbColor={'white'}
          ios_backgroundColor={'white'}
          onValueChange={check === "N" ? toggleTransactionpin : togglepin2}
          value={check === "N" ? !pinset : pinset}
        />
      </View>

      {
        check !== "N" && 
        <SubmitButton message={"Reset Pin"} style={{marginHorizontal: 30, marginTop:20}} onPress={toggleUpdatePin}/> 
      }

      {/* 09161523335: */}

      <Modal
      isVisible={isSetpinModalVisible}
      animationInTiming={500}
      >
        <SafeAreaView style={styles.centeredView}>
        <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => toggleTransactionpin()}>
          <MaterialIcons name="cancel" size={30} color="white" />
        </TouchableOpacity>
          <View style={styles.modalView}>
            <View>
            <Text style={styles.modalText}>{check === "N" ? "Enter Pin" : "Enter new pin" }</Text>

            <SafeAreaView style={{marginHorizontal:40}}>
            <TextInput
                keyboardType={"numeric"}
                maxLength={4}
                style={{fontSize:25, textAlign:'center',width:150, margin:5, borderBottomWidth:1, padding:5}}
                onChangeText={setpin}
                value={pin}
                isInvalid={pinvalid}
                onFocus={() => setpinvalid(false)}
                secureTextEntry
              />
              {
                pinvalid &&
                <Text style={{fontSize:11, textAlign:'center', color:Color.tomato}}>Pin must be 4 characters</Text>
              }
            </SafeAreaView>
            <View style={{marginBottom:'5%'}}/>
            </View>
            {/* <View style={styles.buttonView}> */}
            <View style={{flexDirection:'row', justifyContent:'center'}}>
              <TouchableOpacity style={styles.viewbtn} onPress={() => [ pin === null || pin === undefined || pin === "" || pin.length < 4  ? setpinvalid(true) : pinhandler()]} >
                <Text style={styles.viewtext}>Continue</Text>
              </TouchableOpacity>
            </View>             
              {/* </View> */}
          </View>
          </SafeAreaView>
      </Modal>

      <Modal
      isVisible={isSetpinModalVisible2}
      animationInTiming={500}
      >
        <SafeAreaView style={styles.centeredView}>
        <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => toggleTransactionpin2()}>
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
            <View>
            <Text style={styles.modalText}>Enter new pin</Text>

            <SafeAreaView style={{marginHorizontal:40}}>
              <TextInput
                keyboardType={"numeric"}
                maxLength={4}
                style={{fontSize:25, textAlign:'center',width:150, margin:5, borderBottomWidth:1, padding:5}}
                onChangeText={setpinupdate}
                value={pinupdate}
                isInvalid={updatepinvalid}
                onFocus={() => setupdatepinvalid(false)}
                secureTextEntry
              />
              {
                pinvalid &&
                <Text style={{fontSize:11, textAlign:'center', color:Color.tomato}}>Pin must be 4 characters</Text>
              }
            </SafeAreaView>
            <View style={{marginBottom:'5%'}}/>
            </View>
            {/* <View style={styles.buttonView}> */}
            <View style={{flexDirection:'row', justifyContent:'center'}}>
              <TouchableOpacity style={styles.viewbtn} onPress={() => [ pinupdate === null || pinupdate === undefined || pinupdate === "" || pinupdate.length < 4  ? setpinvalid2(true) : updatepinhandler()]} >
                <Text style={styles.viewtext}>Continue</Text>
              </TouchableOpacity>
            </View>             
              {/* </View> */}
              </>
            }
          </View>
          </SafeAreaView>
      </Modal>

      <Modal  isVisible={isUpdatepinModalVisible} animationInTiming={500} >
        <SafeAreaView style={styles.centeredView}>
        <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => toggleUpdatePin()}>
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
            <View>
            <Text style={styles.modalText}>Enter Old Pin</Text>

            <SafeAreaView style={{marginHorizontal:40}}>
            <TextInput
                keyboardType={"numeric"}
                maxLength={4}
                style={{fontSize:25, textAlign:'center',width:150, margin:5, borderBottomWidth:1, padding:5}}
                onChangeText={setpin2}
                value={pin2}
                isInvalid={pinvalid2}
                onFocus={() => [setpinvalid2(false), setPinerrorMessage('')]}
                secureTextEntry
              />
              {
                pinvalid2 &&
                <Text style={{fontSize:11, textAlign:'center', color:Color.tomato}}>Pin must be 4 characters</Text>
              }
              {
                pinerrormessage.length !== 0 && <Text  style={{fontSize:11, textAlign:'center', color:Color.tomato}}>{pinerrormessage}</Text>
              }
            </SafeAreaView>
            <View style={{marginBottom:'5%'}}/>
            </View>
            {/* <View style={styles.buttonView}> */}

            <View style={{flexDirection:'row', justifyContent:'center'}}>
              <TouchableOpacity style={styles.viewbtn} onPress={() => pin2 === null || pin2 === undefined || pin2 === "" || pin2.length < 4  ? setupdatepinvalid(true) : [handleClick(), pinvalidate()]} >
                <Text style={styles.viewtext}>Continue</Text>
              </TouchableOpacity>
            </View>             
              {/* </View> */}
              </>
            }
          </View>
          </SafeAreaView>
      </Modal>
    </ScrollView>
  )
}

export default TransactionPin

const styles = StyleSheet.create({
  text:{
    top:8,
    fontSize:15,
    fontFamily: 'poppinsRegular'
  },
  viewbtn:{
    backgroundColor:Color.new_color,
    borderWidth: 1,
    borderColor: Color.new_color,
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
    color: Color.white
  },
  container:{
    width: '100%',
    flexDirection:'row',
    justifyContent:'space-evenly',
    marginTop:'30%'
  },
  transactiontxt:{
    fontSize: 18,
    color: Color.darkolivegreen_100,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
  },
  input:{
    fontSize:24,
    color: Color.limegreen,
    textAlign:'center',
    width:45,
    height:55,
    backgroundColor: Color.white,
    borderRadius: 10,
    borderWidth:1
  },
  shadowProps:{
    marginBottom: 30,
    // borderRadius: 20, 
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    backgroundColor: 'white',
    overflow: Platform.OS === 'andriod' ? 'hidden' : 'visible',
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
    width: DIMENSION.WIDTH  * 0.7,
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
    fontSize:14, 
    fontFamily:'poppinsRegular'
  },
  
})


{/* <SafeAreaView>
<View style={{alignItems:'center'}}>
    <Text>Input your transaction pin</Text>

<View style={styles.container}>
    {[...new Array(length)].map((item, index) => (
        
        <TextInput
        ref={ref => {
          if(ref && !inputRefs.current.includes(ref)){
            inputRefs.current = [...inputRefs.current, ref]
          }
        }}
        key={index}
        style={[styles.input, styles.shadowProps]}
        maxLength={1}
        contextMenuHidden
        selectTextOnFocus
        editable={!disabled}
        keyboardType='decimal-pad'
        testID={`TransactionPin-${index}`}
        onChangeText={text => handleChange(text, index)}
        onKeyPress={event => handleBackSpace(event, index)}
        // value={}
        />
        ))}
</View>
</View>

<View style={{marginHorizontal:50, marginTop:'30%'}}>
<SubmitButton message={"Submit"}/>
</View>
</SafeAreaView> 

  const handleChange = (text, index) => {
    onChangeValue(text, index)
    if(text.length !== 0){
      return inputRefs?.current[index + 1]?.focus()
    }
    return inputRefs?.current[index -1]?.focus()
  } 

  const handleBackSpace = (event, index) => {
    const {nativeEvent} = event
    if(nativeEvent.key === 'Backspace'){
      handleChange('', index)
    }
  }

  const onChangeValue =(text, index) => {
    let value = []
    value.push(text)
    console.log(value)
  } 

*/}