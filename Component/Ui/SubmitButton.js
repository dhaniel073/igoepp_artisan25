import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Color } from './GlobalStyle'

const SubmitButton = ({style, onPress, message}) => {
  return (
    <TouchableOpacity style={[styles.commandButton, style]} onPress={onPress}>
        <View style={{ flexDirection:'row' }}>
            <Text style={styles.panelBottomTitle}>{message}</Text>
        </View>
    </TouchableOpacity>
  )
}


export default SubmitButton

const styles = StyleSheet.create({
    commandButton:{
        padding: 12,
        borderRadius: 6,
        backgroundColor: Color.new_color,
        alignItems: 'center',
    },
    panelBottomTitle: {
        fontSize: 14,
        fontFamily: 'poppinsRegular',
        color: Color.white,
    }
})