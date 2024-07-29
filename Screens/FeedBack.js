import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { Dropdown } from 'react-native-element-dropdown';
import { SendFeedBack } from '../utils/AuthRoute';
import {MaterialIcons} from '@expo/vector-icons'
import { Border, Color, DIMENSION, FontSize, marginStyle } from '../Component/Ui/GlobalStyle'
import Input from '../Component/Ui/Input'
import SubmitButton from '../Component/Ui/SubmitButton'
import { AuthContext } from '../utils/AuthContext'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'
import OTPFieldInput from '../Component/Ui/OTPFieldInput'
import GoBack from '../Component/Ui/GoBack'
import Flat from '../Component/Ui/Flat'
import {Platform} from 'react-native';




const feedbackfield = [
    { label: "What's your experience while using the app", value: "What's your experience while using the app" },
    { label: 'Thoughts concerning the app', value: 'What are your thoughts concerning the app' },
    { label: 'How can we improve the app', value: 'How can we improve the application' },
]

const FeedBack = ({navigation}) => {
  const [feedback, setfeedback] = useState('')
  const [feedbackfocus, setfeedbackfocus] = useState('')
  const [feedbackdetails, setFeedBackDetails] = useState('')

  const [feedbackinvalid, setfeedbackInvalid] = useState(false)
  const [feedbackdetailsinvalid, setFeedBackDetailsInvalid] = useState(false)
  const [isAvailable, setisAvailable] = useState(false)
  const [isloding, setisloding] = useState(false)
  const authCtx = useContext(AuthContext)

 

  const openEmail = async () => {
    const detailsinvalid = feedbackdetails === null || feedbackdetails === undefined || feedbackdetails === ""
    const invalid = feedback === null || feedback === undefined || feedback === "" 

    if(invalid || detailsinvalid ){
      Alert.alert('Empty Field', 'Write a feedback complain to continue')
      setFeedBackDetailsInvalid(detailsinvalid)
      setfeedbackInvalid(invalid)
    }else{
      try {
        setisloding(true)
        const response = await SendFeedBack(authCtx.Id, feedback, feedbackdetails, authCtx.token)
        Alert.alert('Successful', "Feedback sent successfully", [
          {
            text: "Ok",
            onPress: () => navigation.goBack()
          }
        ])
        setisloding(false)
      } catch (error) {
        setisloding(true)
        setisloding(false)
        Alert.alert("Error", "An error occured while sending  feedback", [
          {
            text: "Ok",
            onPress: () => navigation.goBack()
          }
        ])
      }
    }  
  }

  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case'setFeedback':
      setFeedBackDetails(enteredValue)
      break;
    }
  }

  if(isloding){
    return <LoadingOverlay message={"..."}/>
  }

  return (
    <ScrollView style={{marginTop: marginStyle.marginTp, marginHorizontal:10}} showsVerticalScrollIndicator={false}>
    <View>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.feedbacktxt}>FeedBack</Text>

        <View style={{ marginHorizontal: 10, marginTop: '8%' }}>
        <Text style={{ fontSize: 18, fontFamily: 'poppinsSemiBold' }}>Whats Your Feedback</Text>
          <Dropdown
            style={[styles.dropdown, feedbackfocus && { borderColor: 'blue' }, feedbackinvalid && styles.invalid]}
            placeholderStyle={[styles.placeholderStyle,{fontFamily: 'poppinsRegular'}]}
            selectedTextStyle={[styles.selectedTextStyle, {fontFamily: 'poppinsRegular'}]}
            inputSearchStyle={[styles.inputSearchStyle, {fontFamily: 'poppinsRegular'}]}
            iconStyle={styles.iconStyle}
            data={feedbackfield}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!feedbackfocus ? 'Select Message' : '...'}
            searchPlaceholder="Search..."
            value={feedback}
            onFocus={() => [setfeedbackfocus(true), setfeedbackInvalid(false)]}
            onBlur={() => setfeedbackfocus(false)}
            onChange={item => {
            setfeedback(item.value);
            setfeedbackfocus(false);
            }}
            renderLeftIcon={() => (
                <MaterialIcons name="feedback" size={24} color="black" />
            )}
          />
          <TextInput
            style={[styles.textInput, feedbackdetailsinvalid && styles.invalid]}
            numberOfLines={10}
            onFocus={() => setFeedBackDetailsInvalid(false)}
            multiline={true}
            editable={true}
            value={feedbackdetails}
            placeholder="Type Message Here"
            placeholderTextColor='grey'
            onChangeText={updateInputValueHandler.bind(this, 'setFeedback')}
          />

         <View>
            <SubmitButton message={"Send Message"} onPress={openEmail}/>
         </View>
        </View>

    </View>
      </ScrollView>
  )
}

export default FeedBack

const styles = StyleSheet.create({
    invalid:{
        backgroundColor: Color.error100,
      },
      feedbacktxt:{
        fontSize: 18,
        color: Color.new_color,
        fontFamily: 'poppinsSemiBold',
        left: 10,
        marginTop:10,
        marginBottom:15,
      }, 
      dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        marginBottom: 10,
        paddingHorizontal: 10,
        marginTop: 8,
        marginBottom: '10%'
      },
      selectedTextStyle: {
        fontSize: 11,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
      },
      placeholderStyle: {
        fontSize: 14,
      },
      textInput:{
        borderColor: 'grey',
        borderWidth: 1,
        padding:10,
        borderRadius: 10,
        marginBottom: '8%',
        fontSize: 13,
        fontFamily: 'poppinsSemiBold'
    },
})