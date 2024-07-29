import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import {MaterialCommunityIcons} from '@expo/vector-icons'
import { NegotiatePrice } from '../utils/AuthRoute'
import { Border, Color, DIMENSION, FontSize, marginStyle } from '../Component/Ui/GlobalStyle'
import Input from '../Component/Ui/Input'
import SubmitButton from '../Component/Ui/SubmitButton'
import { AuthContext } from '../utils/AuthContext'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'
import OTPFieldInput from '../Component/Ui/OTPFieldInput'
import GoBack from '../Component/Ui/GoBack'
import {Platform} from 'react-native';


const data = [
  {
    id:"Y",
    name: "Negotiable"
  },
  {
    id:"N",
    name: 'Non-negotiable'
  }
]


const ReNegotiate = ({navigation, route}) => {
    const [amount , setamount] = useState()
    const [avail, setavail] = useState()
    const [Isloading, setIsloading] = useState(false)
    const authCtx = useContext(AuthContext)
    const [isInvalid, setIsInvalid] = useState(false)


    // id
    // customersPrice
    // proposed_price
    const bidId = route?.params?.id


    const submithandle = async () => {
      try {
        setIsloading(true)
        const response = await NegotiatePrice(bidId, amount, avail, authCtx.token)
        Alert.alert('Success', `You've successfully renegotiated the bid with request with id ${bidId}`, [
          {
            text:'Ok',
            onPress: () => navigation.navigate('ViewRequest')
          }
        ]);
      setIsloading(false)
    } catch (error) {
      // console.log(error)
      setIsloading(true)
        Alert.alert('Error', error.response.data.message, [
          {
            text:'Ok',
            onPress: () => navigation.navigate('ViewRequest')
          }
        ]);
      setIsloading(false)
      return;
    }
    }

    if(Isloading){
      return <LoadingOverlay message={"..."}/>
    }



  return (
    <ScrollView style={{marginTop:marginStyle.marginTp,}} showsVerticalScrollIndicator={false}>
      <View style={{marginHorizontal:10}}>
        <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
        <Text style={styles.renegotiatetxt}>ReNegotiate</Text>
      </View>

      <View style={{ padding:20}}>
        <View style={{flexDirection:'row', justifyContent:'space-between', marginTop: 20}}>
            <Text style={{fontSize:16, fontFamily:'poppinsBold', color:Color.new_color, }}>Customer's Price</Text>
            <Text style={{fontSize:16, fontFamily:'poppinsBold', color:Color.new_color}}> 
                <MaterialCommunityIcons name="currency-ngn" size={16} color={Color.new_color}/>
                {route?.params?.customersPrice}
            </Text>
        </View>

        <View style={{justifyContent:'space-between', flexDirection:'row', marginTop: 20}}>
            <Text style={{fontSize:16,  fontFamily:'poppinsBold', color:Color.new_color}}>Your Price</Text>
            <Text style={{fontSize:16,  fontFamily:'poppinsBold', color:Color.new_color}}> 
                <MaterialCommunityIcons name="currency-ngn" size={16} color={Color.new_color}/>
                {route?.params?.proposed_price}
            </Text>

        </View>
    </View> 
        

        <View style={styles.amountcontainer}>
          <MaterialCommunityIcons name="currency-ngn" size={34} color={Color.new_color}/>
          <TextInput 
            style={[styles.input, isInvalid && styles.invalid]}  
            value={amount}
            onChangeText={setamount}
            keyboardType='numeric'
            maxLength={6}
          />
        
        </View>
        <View style={{}}>
        <View style={{marginLeft:20, marginRight:20}}>
        <Text style={styles.selectoptiontext}>Select Option</Text>
          
          <>     
            <View>
              {data.map((item, key) => 
                <View key={key}>
                  <TouchableOpacity style={[styles.shadow, {padding: 15, borderRadius:10, flexDirection:'row', justifyContent:'space-between', margin:15}]} onPress={() => setavail(item.id)}>
                  <Text style={styles.availtext}>{item.name}</Text>
                  <TouchableOpacity style={styles.outer} onPress={() => setavail(item.id)}>
                    {avail === item.id && <View style={styles.inner}/>}
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
              )}
            </View>
          </>

        </View>
   
          <View style={{margin:40}}>
            <SubmitButton onPress={() =>  amount === undefined || amount === null  ?  [Alert.alert("No amount", "Please enter an amount to continue"), setIsInvalid(true)  ]: avail === undefined || avail === null ? Alert.alert("No option", "Please select an option to continue") :  submithandle()} message={'Done'}/>
          </View>
        
      </View>
    </ScrollView>
  )
}

export default ReNegotiate

const styles = StyleSheet.create({
  shadow:{
    marginBottom: 20,
    borderRadius: 20, 
    elevation: 7,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    backgroundColor: 'white',
    overflow: Platform.OS === 'andriod' ? 'hidden' : 'visible',
  },
  renegotiatetxt:{
    fontSize: 18,
    color: Color.new_color,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
  }, 
  input:{
    fontSize: 36,
    padding:5,
    maxWidth: DIMENSION.WIDTH ,
    height: DIMENSION.HEIGHT * 0.1,
    color: Color.new_color,
    borderBottomWidth:0.5,
  },
  invalid:{
    backgroundColor: Color.error100
  },
  amountcontainer:{
    paddingTop: 20,
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  outer:{
    width:25,
    height: 25,
    borderWidth: 1,
    borderRadius: 15,
    justifyContent:'center',
    alignItems: 'center'
  },
  inner:{
    width:15,
    height:15,
    backgroundColor: Color.new_color,
    borderRadius:10
  },
})