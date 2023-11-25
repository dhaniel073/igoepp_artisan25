import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Color, marginStyle } from '../Components/Ui/GlobalStyle'
import GoBack from '../Components/Ui/GoBack'
import * as Notification from 'expo-notifications';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import * as Device from 'expo-device';







const Notifications = ({navigation}) => {
  return (
    <>
     <View style={{marginTop:marginStyle.marginTp, marginHorizontal:10}}>
       <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
       <Text style={styles.notificationtxt}>Notifications</Text>

       
    </View>
    
    </>
  )
}

export default Notifications

const styles = StyleSheet.create({
  notificationtxt:{
    fontSize: 18,
    color: Color.new_color,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
  }, 
})

