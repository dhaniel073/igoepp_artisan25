import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { ViewSubCategory } from '../utils/AuthRoute'
import { Border, Color, DIMENSION, FontSize, marginStyle } from '../Component/Ui/GlobalStyle'
import Input from '../Component/Ui/Input'
import SubmitButton from '../Component/Ui/SubmitButton'
import { AuthContext } from '../utils/AuthContext'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'
import OTPFieldInput from '../Component/Ui/OTPFieldInput'
import GoBack from '../Component/Ui/GoBack'
import {Platform} from 'react-native';



const ViewRequestWithId = ({navigation, route}) => {
    const authCtx = useContext(AuthContext)
    const [preassessmentamt, setPreassessmentAmt] = useState('')
    const id = route?.params?.id
    const name = route?.params?.name
    const date = route?.params?.date
    const customerName = route?.params?.customerName
    const address = route?.params?.address
    const instruction = route?.params?.instruction  
    const status = route?.params?.status
    const size = route?.params?.helpSize
    const frequency = route?.params?.helpFrequency
    const preassessment = route?.params?.preassessment
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        preassessmentAmount()
    }, [])

    const preassessmentAmount = async() => {
        try {
            setIsLoading(true)
            const response = await ViewSubCategory(authCtx.subCatId, authCtx.token)
            // console.log(response)
            setPreassessmentAmt(response.preassessment_amount)
            setIsLoading(false)
        } catch (error) {
            setIsLoading(true)
            // console.log(error)
            setIsLoading(false)
        }
    }


    const confirmSetPrice = () => {
        Alert.alert('Set Price', 'Are you sure you want to set a price',[
            {
                text: 'No',
                onPress: () => {}
            },
            {
                text: 'Yes',
                onPress: () => navigation.navigate('SetPrice',{
                    id,
                    name,
                    date,
                    customerName,
                    address,
                    instruction,
                    size,
                    frequency,
                    preassessment,
                    preassessmentamt: preassessmentamt
                })
            },
        ])
    }


    if(isLoading){
        return <LoadingOverlay message={"..."}/>
    }



  return (    
  <ScrollView style={{marginTop:marginStyle.marginTp, marginHorizontal:10}} showsVerticalScrollIndicator={false}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.viewrequestwithidtxt}>Customer Information</Text>

      <View style={{marginHorizontal:10}}>

        <View style={{marginBottom:10}}>
            <Text style={[styles.label]}>
                Customer Name
            </Text>
            <TextInput
                style={[styles.input]}
                value={customerName}
                editable={false}
                
            />
        </View>

        <View style={{marginBottom:10}}>
            <Text style={[styles.label]}>
                Help Category Name
            </Text>
            <TextInput
                style={[styles.input]}
                value={name}
                editable={false}
            />
        </View>

        <View style={{marginBottom:10}}>
            <Text style={[styles.label]}>
                Customer address
            </Text>
            <TextInput
                style={[styles.input]}
                value={address}
                editable={false}
                multiline={true}
            />
        </View>

        <View style={{marginBottom:10}}>
            <Text style={[styles.label]}>
                Date for Service
            </Text>
            <TextInput
                style={[styles.input]}
                value={date}
                editable={false}
            />
        </View>

        <View style={{marginBottom:10}}>
            <Text style={[styles.label]}>
                Instruction To Helper 
            </Text>
            <TextInput

                style={[styles.input]}
                value={instruction}
                editable={false}
                multiline={true}
                // numberofLines={10}
            />
        </View>


        <View style={{marginBottom:10}}>
            <Text style={[styles.label]}>
               Size of Help
            </Text>
            <TextInput

                style={[styles.input]}
                value={size}
                editable={false}
                
            />
        </View>

        <View style={{marginBottom:10}}>
            <Text style={[styles.label]}>
                Help Interverals
            </Text>
            <TextInput

                style={[styles.input]}
                value={frequency}
                editable={false}
                
            />
        </View>
        <View style={{marginBottom:10}}>
            <Text style={[styles.label]}>
                Request Type
            </Text>
            <TextInput
                style={[styles.input]}
                value={preassessment === "N" ? "Normal Request" : "Preassessment Request"}
                editable={false}
                
            />
        </View>

      </View>
        {status === 'X' ? "" : 
            <View style={{marginHorizontal:30, marginTop:10, marginBottom:10}}>
                <SubmitButton onPress={confirmSetPrice} message={'Set Price'}/>
            </View>
        }

        <View style={{margin:20}}/>
    </ScrollView>

  )
}

export default ViewRequestWithId

const styles = StyleSheet.create({
  input: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomColor:  Color.gray_100,
    borderBottomWidth: 2,
    fontFamily: 'poppinsRegular',
    fontSize: 14,
    color: Color.gray_100
  },
  viewrequestwithidtxt:{
    fontSize: 18,
    color: Color.new_color,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:10,
  }, 
  label:{
    color: 'black',
    fontSize: 14,
    fontFamily: 'poppinsMedium'
  }
})