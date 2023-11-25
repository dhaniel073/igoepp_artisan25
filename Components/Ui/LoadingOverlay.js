import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React from 'react'
import { Color } from './GlobalStyle'

const LoadingOverlay = ({message}) => {
  return (
    <View style={[styles.container, styles.horizontal]}>
      <Text style={styles.message}>{message}</Text>
     <ActivityIndicator size="large" color={Color.new_color} />
    </View>
  )
}

export default LoadingOverlay

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center',
    padding: 10,

  },
  message: {
    fontSize: 16,
    marginBottom: 12,
    // fontFamily:'poppinsRegular'
  },
})