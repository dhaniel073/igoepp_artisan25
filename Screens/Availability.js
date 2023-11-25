import { Alert, Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Color, DIMENSION, marginStyle } from '../Components/Ui/GlobalStyle'
import GoBack from '../Components/Ui/GoBack'
import { AvailableStore, HelperUrl, UnavailableStore } from '../utils/AuthRoute'
import { AuthContext } from '../utils/AuthContext'
import LoadingOverlay from '../Components/Ui/LoadingOverlay'
import SubmitButton from "../Components/Ui/SubmitButton"

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

const data = [
  {
    id:"Y",
    name: "Available"
  },
  {
    id:"N",
    name: 'Unavailable'
  }
]
const Availability = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false)
  // const [isAvailable, setIsAvailable] = useState(false)
  // const [isNotAvailable, setNotIsAvailable] = useState(false)
  const [avail, setavail] = useState()
  const authCtx = useContext(AuthContext)

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async() => {
  
      try {
        setIsLoading(true)
        const response = await HelperUrl(authCtx.Id, authCtx.token)
        if(response.available === "Y" ){
          // console.log(response)
          setavail(response.available)
          // setNotIsAvailable(false)
        }else if(response.available === 'N'){
          setavail(response.available)
          // console.log(response)
          // setNotIsAvailable(true)
          // authCtx.helperavailable(response.available)
        }else{
          return
        }
        setIsLoading(false)
      } catch (error) {
        // console.log(error)
          Alert.alert("Sorry", "An error occured try again later", [
            {
              text:"Ok",
              onPress: () => navigation.goBack()
            }
          ])
          return;
      }
    })
    return unsubscribe;
  }, [])

  // console.log(avail)


  const submit = async () => {
    try {
      if(avail === "Y"){
        setIsLoading(true)
        const response = await AvailableStore(authCtx.Id, authCtx.token)
        // console.log(response)
        Alert.alert("Success", "You've successfully set your status to available", [
          {
            text:"Ok",
            onPress: () => {}
          }
        ])
        setIsLoading(false)
      }else{
        setIsLoading(true)
        const response = await UnavailableStore(authCtx.Id, authCtx.token)
        // console.log(response)
        Alert.alert("Success", "You've successfully set your status to unavailable", [
          {
            text:"Ok",
            onPress: () => {}
          }
        ])
        setIsLoading(false)
      }
    } catch (error) {
      // console.log(error.response)
      setIsLoading(true)
        Alert.alert("Sorry", "An error occured try again later", [
          {
            text:"Ok",
            onPress: () => navigation.goBack()
          }
        ])
        setIsLoading(false)
        return;
    }
  }

  if(isLoading){
    return <LoadingOverlay message={"..."}/>
  }
  return (
    <View style={{marginTop:marginStyle.marginTp}}>
      <View style={{marginHorizontal:10}}>
        <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
        <Text style={styles.availabilitytxt}>Availability</Text>
      </View>
     
        <View style={styles.containerBoard}>

          <View style={{marginTop:'30%'}}>
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

            <View style={{margin:30}}>
              <SubmitButton onPress={submit} message={'Submit'}/>
            </View>
        </View>
      </View>
  )
}

export default Availability

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
  containerBoard:{
    borderTopLeftRadius: 30,
    borderTopRightRadius:30,
    width:DIMENSION.WIDTH, 
    height:DIMENSION.HEIGHT, 
    padding: 10, 
    marginTop:20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
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
  }, 
})