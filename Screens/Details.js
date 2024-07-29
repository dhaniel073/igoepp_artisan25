import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Border, Color, DIMENSION, FontSize, marginStyle } from '../Component/Ui/GlobalStyle'
import Input from '../Component/Ui/Input'
import SubmitButton from '../Component/Ui/SubmitButton'
import { AuthContext } from '../utils/AuthContext'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'
import OTPFieldInput from '../Component/Ui/OTPFieldInput'
import GoBack from '../Component/Ui/GoBack'
import Flat from '../Component/Ui/Flat'
import {Platform} from 'react-native';



const Details = () => {
  return (
    <View style={{marginTop:marginStyle.marginTp}}>
      <Text>Details</Text>
    </View>
  )
}

export default Details

const styles = StyleSheet.create({})