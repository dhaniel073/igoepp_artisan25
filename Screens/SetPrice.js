import { Alert, Dimensions, SafeAreaView, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import {MaterialCommunityIcons} from '@expo/vector-icons'
import Modal from 'react-native-modal'
import { BidRequest } from '../utils/AuthRoute'
import {Border, Color, DIMENSION, FontSize, marginStyle} from '../Component/Ui/GlobalStyle'
import Input from '../Component/Ui/Input'
import SubmitButton from '../Component/Ui/SubmitButton'
import { AuthContext } from '../utils/AuthContext'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'
import OTPFieldInput from '../Component/Ui/OTPFieldInput'
import GoBack from '../Component/Ui/GoBack'
import {Platform} from 'react-native';



const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

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

const data1 = [
  {
    id:"N",
    name: 'Non-negotiable'
  }
]


const SetPrice = ({navigation, route}) => {
  const bidId = route?.params.id
    const preassessment_flg = route?.params?.preassessment
    const preassessmentAmt = route?.params?.preassessmentamt.toString()
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isInvalid, setIsInvalid] = useState(false)
    const [amount , setamount] = useState()
    const [avail, setavail] = useState()
    const [reason, setreason] = useState()
    const authCtx = useContext(AuthContext)
    const [Isloading, setIsloading] = useState(false)


    const toggleModal = () => {
      setIsModalVisible(!isModalVisible)
      // console.log(avail)
    }

    // console.log(preassessment_flg)
    const submithandler = async () => {
      if(preassessment_flg === "N"){
        try {
            setIsloading(true)
            const response = await BidRequest(bidId, authCtx.Id, amount, reason, avail, authCtx.token)
            // console.log(response)
            Alert.alert('Success', `You've successfully placed a bid on the request with id ${bidId}`, [
              {
                text:'Ok',
                onPress: () => navigation.navigate('ViewRequest')
              }
            ]);
            setIsloading(false)
        } catch (error) {
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
      }else{
        // console.log(avail)
          try {
            setIsloading(true)
            const response = await BidRequest(bidId, authCtx.Id, preassessmentAmt, reason, avail, authCtx.token)
            // console.log(response)
            Alert.alert('Success', `You've successfully placed a bid on the request with id ${bidId}`, [
              {
                text:'Ok',
                onPress: () => navigation.navigate('ViewRequest')
              }
            ]);
            setIsloading(false)
        } catch (error) {
            setIsloading(true)
            // console.log(error)
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
    }

    if(Isloading){
      return <LoadingOverlay message={"..."}/>
    }

  return (
    <ScrollView style={{marginTop:marginStyle.marginTp,}} showsVerticalScrollIndicator={false}>
      <View style={{marginHorizontal:10}}>
        <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
        <Text style={styles.setpricetxt}>SetPrice</Text>
      </View>

      <View style={{alignSelf:'center'}}>
      <Text style={styles.text}>Set your price here for the customer</Text>
    </View>
        

    <View style={styles.amountcontainer}>
          <MaterialCommunityIcons name="currency-ngn" size={34} color={Color.new_color}/>


        {preassessment_flg === "N" &&

        <TextInput 
          style={[styles.input, isInvalid && styles.invalid]}  
          onFocus={() => setIsInvalid(false)}
          value={amount}
          onChangeText={setamount}
          keyboardType='numeric'
          maxLength={6}
        />
        }

        {preassessment_flg === "Y" &&

          <TextInput 
            style={[styles.input]}  
            value={preassessmentAmt}
            editable={false}
            maxLength={6}
          />
        }
        </View>
    <View style={{}}>
        <View style={{marginLeft:20, marginRight:20}}>
        <Text style={styles.selectoptiontext}>Select Option</Text>
          

        {preassessment_flg === "Y" ? 
          <View>
          {data1.map((item, key) => 
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
        :
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
        }


        </View>

        {
          preassessment_flg === "Y" ?

          <View style={{margin:40}}>
            <SubmitButton onPress={() =>  avail === undefined || avail === null ? Alert.alert("No option", "Please select an option to continue") :  toggleModal()} message={'Done'}/>
          </View>
        :    
          <View style={{margin:40}}>
            <SubmitButton onPress={() =>  amount === undefined || amount === null  ?  [Alert.alert("No amount", "Please enter an amount to continue"), setIsInvalid(true)  ]: avail === undefined || avail === null ? Alert.alert("No option", "Please select an option to continue") :  toggleModal()} message={'Done'}/>
          </View>
        }
      </View>

      <Modal isVisible={isModalVisible}  
        animationType="slide"
        onBackButtonPress={() => {
          toggleModal();
        }}>
        <SafeAreaView style={styles.centeredView}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >

          <View style={styles.modalView}>
            <Text style={styles.modalText}>Reason</Text>

                <TextInput value={reason} onChangeText={setreason} style={styles.modalinput} placeholder='Reason for bid'/>
                <View style={{ marginBottom:20}}/>



            <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
                <TouchableOpacity style={styles.viewbtn} onPress={toggleModal} >
                      <Text style={styles.viewtext}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelbtn} onPress={() => !reason ? Alert.alert('Reason', 'No reason for bid found, write a reason to continue')  : [submithandler(), toggleModal()]}>
                    <Text style={styles.canceltext}>Continue</Text>
                </TouchableOpacity>
            </View>
            <View style={{marginBottom:'2%'}}/>
            
          </View>
        </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </ScrollView>
  )
}

export default SetPrice

const styles = StyleSheet.create({
  modalinput: {
    paddingVertical: 10,
    paddingHorizontal: 2,
    borderBottomColor:  Color.gray_100,
    borderBottomWidth: 1,
    fontFamily: 'poppinsRegular',
    fontSize: 15,
  },
  viewbtn:{
    backgroundColor:Color.white,
    borderColor: Color.brown,
    borderWidth: 1,
    justifyContent:'center',
    borderRadius: 3,
    width: WIDTH * 0.36,
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
    width: WIDTH * 0.36,
    padding: 5
  },
  canceltext:{
    fontFamily: 'poppinsMedium',
    fontSize: 12,
    color: Color.white,
    textAlign: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    width: WIDTH  * 0.9,
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
  modalText: {
    textAlign: 'center',
    fontSize:18, 
    fontFamily:'poppinsRegular'
  },
  invalid:{
    backgroundColor: Color.error100
  },
amountcontainer:{
  paddingTop: 20,
  flexDirection: 'row',
  marginTop: 70,
  marginBottom: 70,
  justifyContent: 'center',
  alignItems: 'center'
},
input:{
  fontSize: 36,
  padding:5,
  maxWidth: WIDTH ,
  height: HEIGHT * 0.1,
  color: Color.new_color,
  borderBottomWidth:0.5,
},
  selectoptiontext: {
    fontFamily: 'interMedium',
    letterSpacing: 0,
  },
  setpricetxt:{
    fontSize: 18,
    color: Color.new_color,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
  }, 
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
  availtext:{
    fontSize:15,
    fontFamily:'poppinsSemiBold',
    color: Color.new_color
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
  availabilitytxt:{
    fontSize: 18,
    color: Color.new_color,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
  }
})