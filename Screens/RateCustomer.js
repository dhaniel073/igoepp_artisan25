import { SafeAreaView, ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Color, marginStyle } from '../Components/Ui/GlobalStyle'
import GoBack from '../Components/Ui/GoBack'
import { AuthContext } from '../utils/AuthContext'
import { Image } from 'expo-image'
import {MaterialIcons, Ionicons} from '@expo/vector-icons'
import LoadingOverlay from '../Components/Ui/LoadingOverlay'
import { CustomerRating, GetCustomer, ViewCustomerRatingonRequest } from '../utils/AuthRoute'
import SubmitButton from '../Components/Ui/SubmitButton'

const RateCustomer = ({navigation, route}) => {
  const [defaultRating, setdefaultRating] = useState(2)
  const [maxRating, setMaxRating] = useState([1,2,3,4,5])
  const [helpershowrating, sethelpershowrating] = useState()
  const [customerdetails, setcustomerdetails] = useState([])
  const [isloading, setisloading] = useState(false)
  const customerID = route?.params?.customerId
  const ID = route?.params?.id
  const authCtx = useContext(AuthContext)
  const [ratecomment, setRateComment] = useState()


  useEffect(() => {
    customerGetProfile()
    helperrating()
  }, [])

const helperrating = async  () => {
    // console.log(ID)
    try {
      const response = await ViewCustomerRatingonRequest(ID, authCtx.token)
      // console.log(response.data)
      sethelpershowrating(response.data)
    } catch (error) {
      // console.log(error)
      return;
    }
}


const customerGetProfile = async () => {
    try {
      setisloading(true)
      const response = await GetCustomer(customerID, authCtx.token) 
      // console.log(response.data.data)
      setcustomerdetails(response.data.data)
      setisloading(false)
    } catch (error) {
      setisloading(true)
      // console.log(error.response.data.message)
      setisloading(false)
      return;
    }
}

const rateCustomer = async () => {
  // console.log(defaultRating, customerID, ratecomment)
  try {
    setisloading(true)
      const response = await CustomerRating(ID, defaultRating, ratecomment, authCtx.token) 
      // console.log(response.data)
      Alert.alert("Success", `You've successfully rated the handyman with id: ${customerID}`, [
          {
              text: "Ok",
              onPress: () => navigation.goBack()
          }
      ])
     setisloading(false)
  } catch (error) {
    setisloading(true)
      if(error.response.data.message === "You can only rate a Completed Request"){
        Alert.alert("Error", `${error.response.data.message}`, [
          {
              text:"Ok",
              onPress: () => navigation.goBack()
          }
        ])
      }
      // console.log(error.response.data)
      setisloading(false)
      return;
  }
}

 

const startImgFilled = `https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png`
const startImgCorner = `https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png`

const CustomerRatingBar = () => {
    return (
    <View style={styles.customerRatingBarStyle}>
      {
        maxRating.map((item, key) => {
          return (
          <TouchableOpacity
            activeOpacity={0.7}
            key={item}
            onPress={() => setdefaultRating(item)}
          >

          <Image
            contentFit='cover'
            style={styles. startImgStyle}
            source={
              item <= defaultRating
              ? {uri: startImgFilled}
              : {uri: startImgCorner}
            }
          />

          </TouchableOpacity>
          )
        })
      }
    </View>
    )
}

if(isloading){
  return <LoadingOverlay message={"..."}/>
}


return (
  <ScrollView  showsVerticalScrollIndicator={false} style={{marginTop:marginStyle.marginTp, marginHorizontal:10}}>
    <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
    <Text style={styles.ratecustomertxt}>RateCustomer</Text>
    <SafeAreaView style={styles.container}>
        <Image style={styles.profile} source={customerdetails.picture === null ? require("../assets/person-4.png")  : {uri: `https://igoeppms.com/igoepp/public/customers/${customerdetails.picture}`}}/>
            
            <View style={{flexDirection:'row', alignContent:'center', alignSelf:'center'}}>
                <Text style={[styles.title , {marginTop: 15, marginBottom: 5, textAlign:'center'}]}>{customerdetails.first_name}</Text>
                <Text style={[styles.title , {marginTop: 15, marginBottom: 5, textAlign:'center'}]}> {customerdetails.last_name}</Text>
            </View>

            <View style={styles.customerbox}>
                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                        <MaterialIcons name="email" size={24} color="#777777" />
                    <Text style=    {{ color: '#777777', marginLeft: 20, fontFamily:'poppinsRegular' }}>{customerdetails.email}</Text>
                </View>

                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                    <Ionicons name="location" color="#777777" size={20}/>
                    <Text style=    {{ color: '#777777', marginLeft: 20, fontFamily:'poppinsRegular' }}>{customerdetails.Country} {customerdetails.State} {customerdetails.lga}</Text>
                </View>

        </View>

       <View style={{padding: 10, marginTop:10}}>
            
            <View style={{flexDirection:'row', justifyContent:'center'}}>
                <Text  style={{ color: '#777777', fontFamily:'poppinsRegular' }}>Customer's Rating: </Text>
                <View style={{flexDirection:'row'}}>
                <Text style={{ color: '#777777', fontFamily:'poppinsRegular' }}> {route?.params?.rating === undefined || route?.params?.rating === null ?  "No Rating" : route?.params?.rating }</Text><Image contentFit='contain' style={{  width: 18, height: 18}} source={require("../assets/group-723.png")}/>
                </View>
            </View>
       {/* <ScrollView style={{padding: 10, marginTop:'10%'}}> */}
            <Text style={styles.textStyle}>Rate the Customer </Text>
            <CustomerRatingBar />
            <Text style={styles.textStyle}>
                {/* {defaultRating + " /" + maxRating.length} */}
                {
                    defaultRating === 1 ?
                        <Text style={{fontSize:30}}>😡</Text>
                    :
                    defaultRating === 2?
                        <Text style={{fontSize:30}}>😥</Text>
                    :
                    defaultRating === 3 ?
                    <Text style={{fontSize:30}}>🤨</Text>
                    : 
                    defaultRating === 4 ?
                        <Text style={{fontSize:30}}>😃</Text>
                    :
                    defaultRating === 5 &&
                        <Text style={{fontSize:30}}>😎</Text>
                }
            </Text>
            <TextInput multiline style={{backgroundColor: Color.gray6, padding:10, height:70, borderRadius:10}} placeholder='Add comment' value={ratecomment} onChangeText={setRateComment}/>
            <SubmitButton message={"Submit"} onPress={() => ratecomment === null || ratecomment === undefined || ratecomment === ""  ? Alert.alert("Empty Field", "Write a comment about the customer to continue") : rateCustomer()} style={{marginTop:20}}/>
        {/* </ScrollView>  */}
       </View>

    </SafeAreaView>
  </ScrollView>
)
}





export default RateCustomer

const styles = StyleSheet.create({
  textStyle:{
    textAlign:'center',
    fontFamily:'poppinsRegular',
    marginTop:5
  },
  customerRatingBarStyle:{
    justifyContent:'center',
    flexDirection:'row',
  },
  startImgStyle:{
    width:30,
    height:30,
    margin:8
  },
  customerbox:{
    marginTop:20,
    alignItems:'center'
  },
  ratecustomertxt:{
    fontSize: 18,
    color: Color.new_color,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
  },
  container:{
    flex:1,
    padding:20,
  },
  profile:{
    height:100,
    width:100,
    borderRadius: 100,
    alignSelf:'center'
},
})