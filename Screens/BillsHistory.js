import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect,useState } from 'react'
import { GetBillsHistoryHelper } from '../utils/AuthRoute'
import { Border, Color, DIMENSION, FontSize, marginStyle } from '../Component/Ui/GlobalStyle'
import Input from '../Component/Ui/Input'
import SubmitButton from '../Component/Ui/SubmitButton'
import { AuthContext } from '../utils/AuthContext'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'
import OTPFieldInput from '../Component/Ui/OTPFieldInput'
import GoBack from '../Component/Ui/GoBack'
import Flat from '../Component/Ui/Flat'
import {Platform} from 'react-native';



const BillsHistory = ({navigation}) => {
    const [request, setRequest] = useState([])
    const authCtx = useContext(AuthContext)
    const [isloading, setisloading] = useState(false)

    useEffect(() => {
        const unsubscribe =  navigation.addListener('focus', async () => {
            try {
                setisloading(true)
                const response = GetBillsHistoryHelper(authCtx.Id, authCtx.token)
                console.log(response)
                setisloading(true)
            } catch (error) {
                setisloading(true)
                console.log(response.error)
                Alert.alert('Error', 'An error occured', {
                    text: 'Ok',
                    onPress: () => navigation.goBack()
                })
                setisloading(true)

            }
        })
      return unsubscribe;
    }, [])


  return (
    <View>
      <Text>Bills History</Text>

      <FlatList

        showsVerticalScrollIndicator={false}
        data={category}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
            <Pressable>
                
            </Pressable>
        )}
      />
    </View>
  )
}

export default BillsHistory

const styles = StyleSheet.create({})