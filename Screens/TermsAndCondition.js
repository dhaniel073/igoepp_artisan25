import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import {MaterialIcons} from '@expo/vector-icons'
import { SignUpHandyman } from '../utils/AuthRoute'
import * as Location from 'expo-location';
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
      name: "Accept"
    },
  ]

  
const TermsAndCondition = ({route, navigation}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [isAcceptTermsModalBisible, setisAcceptTermsModalBisible] = useState(false)
    const [avail, setavail] = useState()
    const authCtx = useContext(AuthContext)
    
    
    const toggleAcceptTermsModal = () => {
      setisAcceptTermsModalBisible(!isAcceptTermsModalBisible)
    }

    // console.log(route.params.convertedPassword)

    const signupSend = async () => {  
        try {
          setIsLoading(true)
          const response = await SignUpHandyman(route.params.enteredLastName, route.params.enteredFirstname, route.params.enteredEmail, route.params.helpdate, route.params.enteredPhone, route.params.category, route.params.subcategory, route.params.convertedPassword, route.params.enteredGender, route.params.country, route.params.state, route.params.city, route.params.address, route.params.latitude, route.params.longitude, route.params.idtype, route.params.idnum, route.params.referral_code)
          console.log(response)
          authCtx.authenticated(response.access_token)
          authCtx.helperId(response.helper_id)
          authCtx.helperEmail(response.email)
          authCtx.helperFirstName(response.first_name)
          authCtx.helperLastName(response.last_name)
          authCtx.helperCatId(response.category)
          authCtx.helperSubCatId(response.subcategory) 
          authCtx.helperPhone(response.phone)
          authCtx.helperPicture(response.photo)
          authCtx.helperuserid(response.userid)
          authCtx.helperShowAmount('show')
          authCtx.helperlastLoginTimestamp(new Date().toString())
          authCtx.helpersumtot("0.00")
          setIsLoading(false)
        } catch (error) {
          setIsLoading(true)
          console.log(error.response)
          const myObj = error.response.data.email;
          console.log(error.response)
          console.log(myObj)
          Alert.alert('SignUp Failed', myObj)
          setIsLoading(false)
          return;
        }
      }
  


    if(isLoading){
        return <LoadingOverlay message={"..."}/>
    }

  return (
    <ScrollView style={styles.centeredView}>

<TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => toggleAcceptTermsModal()}>
  <MaterialIcons name="cancel" size={30} color="white" />
</TouchableOpacity>

<View style={styles.modalView}>
<Text style={styles.modalText}>Accept Terms and Condition</Text>

<View style={{marginBottom:'2%'}}/>
<ScrollView showsVerticalScrollIndicator={false}>
<View style={{alignItems:'center'}}>
  <Text style={{textAlign:'center'}}>SUPPLIER SERVICE LEVEL AGREEMENT</Text> 
</View>

<Text> A.	SERVICE LEVEL AGREEMENT(SLA)</Text>

<Text style={styles.textsty}> 
  1.	Services to be Performed
</Text>
<Text style={styles.textsty2}>
  I have agreed to work in the capacity of <Text style={{fontFamily:'poppinsBold'}}> {route.params.enteredFirstname} { route.params.enteredLastName}</Text> as an Artisan 
</Text>
  

<Text style={styles.textsty}>
2.	Payment </Text>
<Text style={styles.textsty2}>
IGOEPP pays the artisan 36hrs after the customer has confirmed that the service has been executed satisfactory. IGOEPP would deduct 10% commission from the total amount collected from the customer.
</Text>

<Text style={styles.textsty}>
3.	Expenses</Text>
<Text style={styles.textsty2}>
Artisan is to ensure that all expenditure is considered in the bidding process with the customer. The customer can only buy replacement parts from IGOEPP designated suppliers.
</Text>

<Text style={styles.textsty}>
4.	Materials for Work </Text>
<Text style={styles.textsty2}>
All parts and materials that would be used to work for a customer must be purchased from IGOEPP designated suppliers by the customer in the IGOEPP Market Place on the APP. Artisan must not replace faulty parts or materials with personal materials or materials purchased from unauthorized supplier. IGOEPP Suppliers would deliver the part not the customer for the artisan to work with.
</Text>

<Text style={styles.textsty}>
5.	Terminating the Agreement</Text>
<Text style={styles.textsty2}>
With reasonable cause, either IGOEPP or Artisan may terminate the Agreement, effective immediately upon giving written notice.
Reasonable cause includes:
•	A material violation of this Agreement, or
•	Any act exposing the other party of liability to others for the personal injury or property damage.
OR
Either party may terminate this Agreement at any time by giving 30 days written notice to the other party of the intention to terminate. However, Artisan cannot terminate this agreement when there is a pending dispute with one of IGOEPP’s customers involving him.
</Text>

<Text style={styles.textsty}>
6.	Modifying the  Agreement </Text>
<Text style={styles.textsty2}>
This Agreement may be modified on mutual consent of both parties. (Ratification can be done via oral, written, email or other digital agreement).
</Text>

<Text style={styles.textsty}>
7.	Confidentiality</Text>
<Text style={styles.textsty2}>
Artisans acknowledge that it will be necessary for IGOEPP to disclose certain confidential and proprietary information about the client to them in order for artisan to perform duties under this Agreement. Artisan acknowledges that disclosure to the third party or misuse of this proprietary or confidential information would irreparably harm the Client. Accordingly, Artisan will not disclose or use, either during or after the term of this Agreement, any proprietary or confidential information of the Client without the Client’s prior written permission except to the extent necessary to perform the agreed service on the Client’s behalf.
Upon termination of Artisan’s service to company or at Client’s request, Artisan shall deliver to client all materials in Artisan’s possession relating to Client’s business.

Artisan acknowledges that any branch or threatened breach of this Agreement will result in irreparable harm to Client for which damages would be an adequate remedy. Therefore, Client shall be entitled to equitable relief, including an injunction, in the event of such breach or threatened breach of this Agreement. Such equitable relief shall be in addition to Client’s right’s and remedies otherwise available at law.
</Text>

<Text style={styles.textsty}>
8.	No Partnership</Text>
<Text style={styles.textsty2}>
This Agreement does not create a partnership relationship. Artisan does not have authority to enter contracts on IGOEPP’s behalf.
</Text>

<View style={{flexDirection:'row', justifyContent:'center', flex:1, marginTop:10, paddingLeft:15 }}>
  
<View style={{marginTop:'1%', marginBottom:"1%"}}>
  {data.map((item, key) => 
    <Pressable key={key} style={{flexDirection:'row', justifyContent:'center', marginTop:5}} onPress={() => setavail(item.id)}>
      <TouchableOpacity style={[styles.outer, ]} >
        {avail === item.id && <View style={styles.inner}/>} 
      </TouchableOpacity>
      <Text style={{marginTop:5}}> Accept</Text>
  </Pressable>
  )}
</View>
    <View style={{marginBottom:10}}/>
{
  avail  && 
    <SubmitButton style={{flex:1, marginLeft:10, marginHorizontal:20}} message={"Continue"} onPress={() => signupSend()}/>
}
</View>
  <View style={{marginBottom:20}}/>

</ScrollView>

  </View>


  </ScrollView>

  )
}

export default TermsAndCondition

const styles = StyleSheet.create({
    textsty:{
        fontFamily:'poppinsBold'
      },
      textsty2:{
        fontFamily:'poppinsRegular'
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
    modalView: {
        margin: 5,
        backgroundColor: 'white',
        padding: 10,
        // alignItems: 'center',
      },
      modalText: {
        // marginBottom: 15,
        textAlign: 'center',
        fontSize:16, 
        fontFamily:'poppinsRegular'
      },
})