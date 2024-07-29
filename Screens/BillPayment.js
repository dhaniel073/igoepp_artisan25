import { Dimensions, SafeAreaView, StyleSheet, Pressable, Text, View, TouchableOpacity, FlatList,  Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import {MaterialCommunityIcons, AntDesign, Entypo} from '@expo/vector-icons'
import { Dropdown } from 'react-native-element-dropdown'
import Modal from "react-native-modal";
import axios from 'axios'
import {Image} from 'expo-image'
import { SubCategory, Walletbal } from '../utils/AuthRoute'
import * as LocalAuthentication from 'expo-local-authentication'
import { Border, Color, DIMENSION, FontSize, marginStyle } from '../Component/Ui/GlobalStyle'
import Input from '../Component/Ui/Input'
import SubmitButton from '../Component/Ui/SubmitButton'
import { AuthContext } from '../utils/AuthContext'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'
import OTPFieldInput from '../Component/Ui/OTPFieldInput'
import GoBack from '../Component/Ui/GoBack'
import Flat from '../Component/Ui/Flat'
import {Platform} from 'react-native';



const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const methodtype = [
  { label: 'Card', value: 'C' },
  { label: 'Transfer', value: 'TF' },
]




const BillPayment = ({navigation}) => {

  const [ismodalVisible, setModalVisible] = useState(false);
  const [method, setMethod] = useState()
  const [isFocus, setIsFocus] = useState(false)
  const [category, setcategory] = useState()
  const [isLoading, setisLoading] = useState(false)
  const authCtx = useContext(AuthContext)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [subcatname, setSubCatName] = useState([])



  useEffect(() => {
   const unsubscribe =  navigation.addListener('focus', async() => {
       try {
        setisLoading(true)
        const response = await Walletbal(authCtx.Id, authCtx.token)
        authCtx.helperBalance(response.wallet_balance)
        setisLoading(false)
       } catch (error) {
        setisLoading(true)      
        setisLoading(false)
        // console.log(error.response)
        return;
       }
     });
     return unsubscribe;
   }, [navigation, authCtx.Id, authCtx.token]);

  useEffect(() => {
    Billers()
  }, [])

  useEffect(() => {
    navigation.addListener('focus', async () => {
      return SubCatGet()
    })
  }, [subcatname])

  const SubCatGet = async () => {
    try {
      const response = await SubCategory(authCtx.subCatId, authCtx.token)
      // console.log(response)
      setSubCatName(response)
    } catch (error) {
      // console.log(error.response.data)
      return;
      
    }
  }

  const Billers = async() => {
    try {
      setisLoading(true)
      const url = `https://igoeppms.com/igoepp/public/api/auth/billpayment/getBillCategory`
      const response = await axios.get(url, {
        headers:{
          Accept: 'application/json',
          Authorization: `Bearer ${authCtx.token}`
        }
      })
      setcategory(response.data)
      // console.log(response)
      setisLoading(false)
    } catch (error) {
      console.log(error.response)
      setisLoading(true)
      Alert.alert("Error", "An error occured try plaese again later", [
        {
          text: "Ok",
          onPress: () => navigation.goBack()
        }
      ])
      setisLoading(false)
      return;
      
    }
  }

  // console.log(method)
  const toggleModal = () => {
    setModalVisible(!ismodalVisible)
  }

 const check = () => {
  if(method === 'TF'){
    Alert.alert("", "Payment method not available")
  }else{
    navigation.navigate("AddToWallet") 
    setMethod(null)
    toggleModal()
  }
 }

 function onAuthenticate (spec){
  const auth = LocalAuthentication.authenticateAsync({
    promptMessage: 'Authenticate with Touch ID',
    fallbackLabel: 'Enter Password'
  });
    auth.then(result => {
      setIsAuthenticated(result.success);
      if(result.success === true){
          if(spec === 'hide'){
            HideAmount()
          }else{
            ShowAmount()
          }
      }else if (result.error === 'not_enrolled'){
        Alert.alert("", "Device not enrolled, setup up a screen lock to use this feature")
      }
    })
  }

  const ShowAmount = () => {
    authCtx.helperShowAmount('show')
  }
  
  const HideAmount = () => {
    authCtx.helperShowAmount('hide')
  }


 if(isLoading){
  return <LoadingOverlay message={"..."}/>
 }
  
  return (
    <SafeAreaView style={styles.container}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.billpaymentxt}>Bill Payment</Text>


      <View style={styles.slide2}>
        <View style={{flexDirection:'row', marginBottom:5}}>
          <Text style={styles.text}>
            <MaterialCommunityIcons name="currency-ngn" size={25} color="white" />
            {authCtx.showAmount === 'show'  ? authCtx.balance : <Text>******</Text>}
          </Text>

          {authCtx.showAmount === 'show' ?
            <TouchableOpacity style={{alignSelf:'center', marginLeft:10}} onPress={() => onAuthenticate('hide')}>
              <Entypo name="eye-with-line" size={24} color="white" />
            </TouchableOpacity>
          :
            <TouchableOpacity style={{alignSelf:'center', marginLeft:10}} onPress={() => onAuthenticate('show')}>
              <Entypo name="eye" size={24} color="white" />
            </TouchableOpacity>
          }
        </View>
        <View style={{flexDirection:'row', justifyContent:'space-between', left:2}}>
          <Text style={{fontSize: 15, fontFamily: 'interBold', color: Color.white}}>Wallet Balance</Text>
          <View style={{justifyContent:'center', alignItems: 'center',}}>
            <TouchableOpacity 
              onPress={() => setModalVisible(true)}
            >
              <AntDesign name="pluscircle" size={36} color="white" />
            </TouchableOpacity>
            <Text style={{fontSize: 15, fontFamily: 'interRegular', color: Color.white}}>Add Money</Text>  
          </View>
        </View>  
      </View>
      <View style={{marginTop:20}}>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={category}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <View style={styles.billscontainer}>
            <TouchableOpacity style={styles.pressables} onPress={() => {
              item.id === "vtu" && navigation.navigate('VirtualTopup', {name:item.name,id:item.id  })
              item.id === "disco" && navigation.navigate('Disco', {name:item.name,id:item.id})
              item.id === "bet" && navigation.navigate('Bet', {name:item.name,id:item.id  })
              item.id === "internet" && navigation.navigate('Internet', {name:item.name,id:item.id  })
              item.id === "education" && navigation.navigate('Education', {name:item.name,id:item.id  })
              item.id === "tv" && navigation.navigate('Television', {name:item.name,id:item.id  })
            }
            }>

              <Image style={styles.image} source={{uri: item.imagePath}}/>

                  <Text style={styles.item}>
                    {item.id === 'vtu' ? "Airtime" 
                    :  item.id === 'bet' ? "Bet" 
                    :  item.id === 'disco' ? "Electricity" 
                    :  item.id === 'tv' ? "MultiChoice" 
                    :  item.id === 'education' ? "WAEC Card" 
                    :  item.id === 'internet' ? "Internet" 
                    :""
                    }
                  </Text>
            </TouchableOpacity>
          </View>
        )}
      />
      </View>

      <Modal
        animationType="slide"
        isVisible={ismodalVisible}>

        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Payment Method</Text>

            <Dropdown
              style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={methodtype}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Select Payment Method' : '...'}
              searchPlaceholder="Search..."
              value={method}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                  setMethod(item.value);
                  setIsFocus(false);
              }}
            />
            <View style={{flexDirection:'row', justifyContent:'space-around', marginTop:20}}>
              <TouchableOpacity
                style={styles.viewbtn}
                onPress={toggleModal}>
                <Text style={styles.viewtext}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.startservicebtn} onPress={() => !method ? Alert.alert('No Payment Method', 'Please Select Payment Method To Continue') : check()}>
                <Text style={styles.startservicetext}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default BillPayment

const styles = StyleSheet.create({
  item:{
    fontSize:12
  },
  container:{
    marginTop:marginStyle.marginTp,
    marginHorizontal:10
  },
  image:{
    width: 60,
    height: 60,
    marginHorizontal: 10,
    marginTop: 10,
    alignSelf:'center'
    // marginBottom: 30
  },
  dropdown: {
  height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 10
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
  startservicebtn: {
    backgroundColor: Color.new_color,
    borderRadius: 3,
    justifyContent:'center',
    width: DIMENSION.WIDTH * 0.36,
    padding: 5
  },
  startservicetext:{
    fontFamily: 'poppinsMedium',
    fontSize: 12,
    color: Color.white,
    textAlign: "center",
  },
  viewbtn:{
    backgroundColor:Color.white,
    borderColor: "#f7a10d",
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
    color: Color.orange_200
  },
  pressables:{
    padding:20,
    width: WIDTH *0.43,
    margin:5,
    height:HEIGHT *0.17,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    elevation: 2,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    // backgroundColor: Color.mintcream,
    backgroundColor:'white',
    overflow: Platform.OS === 'andriod' ? 'hidden' : 'visible',
  },
  billscontainer:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  text: {
    color: '#fff',
    fontSize: 25,
    fontFamily:'poppinsSemiBold',
  },
  slide2: {
    // flex: 1,
    padding:20,
    paddingTop:30,
    marginHorizontal:5,
    backgroundColor: Color.new_color,
    borderRadius: 10,
    height: HEIGHT * 0.22,
    elevation: 4,
  },
  billpaymentxt:{
    fontSize: 18,
    color: Color.new_color,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
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
    width: WIDTH  * 0.9,
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
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
})