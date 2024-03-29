import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import { Color, marginStyle } from '../Components/Ui/GlobalStyle'
import GoBack from '../Components/Ui/GoBack'
import { AuthContext } from '../utils/AuthContext'
import {Ionicons, Feather, MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons'
import * as Updates from 'expo-updates'
import { DeleteAccount } from '../utils/AuthRoute'
import { useState } from 'react'
import LoadingOverlay from '../Components/Ui/LoadingOverlay'

const Settings = ({navigation}) => {
  const authCtx = useContext(AuthContext)
  const [isloading, setisloading] = useState(false)

  const triggerUpdateCheck = async () => {
    try {
      const update = await Updates.checkForUpdateAsync()
      if(update.isAvailable){
        // Alert.alert("Message", "No updates is available", )
        await Updates.fetchUpdateAsync()
        await Updates.reloadAsync()
      }else{
        Alert.alert("Message", "No updates is available")
      }
    } catch (error) {
      alert(error.message);
    }
  }

  const deleteAccountpermanently = async () => {
    try {
      setisloading(true)
      const response = await DeleteAccount(authCtx.Id, authCtx.token)
      console.log(response)
      Alert.alert('Success', "Your account has been deleted successfully", [
        {
          text: "Ok",
          onPress: () => authCtx.logout()
        }
      ])
      setisloading(false)
    } catch (error) {
      setisloading(true)
      Alert.alert('Error', "An error occured while deleting your account", [
        {
          text: "Ok",
          onPress: () => {}
        }
      ])
      console.log(error.response)
      setisloading(false)
    }
  }

  if(isloading){
    return <LoadingOverlay message={"..."}/>
  }

  return (
    <View style={{flex:1, marginTop:marginStyle.marginTp, marginHorizontal:10}}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.settingstxt}>Settings</Text>


      <ScrollView style={{ padding:15, flex:1 }} showsVerticalScrollIndicator={false}>
      
        <TouchableOpacity style={{ alignItems: 'flex-start', borderBottomWidth:1,}} onPress={() => navigation.navigate("Compliance")}>
          <View style={{ flexDirection: 'row',   paddingBottom: 15, marginTop: 15 }}>
          <Ionicons name="document-attach-outline" size={24} color='black' />
              <Text style={styles.textStyle}>Compliance Docs</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={{ alignItems: 'flex-start', borderBottomWidth:1,}} onPress={() => navigation.navigate("NotificationSetup")}>
          <View style={{ flexDirection: 'row',   paddingBottom: 15, marginTop: 15 }}>
            <Ionicons name='notifications-outline' size={30}/>
            <Text style={styles.textStyle}>Notification Setup</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={{ alignItems: 'flex-start', borderBottomWidth:1,}} onPress={() => navigation.navigate("FeedBack")}>
          <View style={{ flexDirection: 'row',   paddingBottom: 15, marginTop: 15 }}>
          {/* <Ionicons name="finger-print" size={24} color="black" /> */}
          <MaterialIcons name="feedback" size={24} color="black" />
            <Text style={styles.textStyle}>FeedBack</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={{ alignItems: 'flex-start', borderBottomWidth:1,}} onPress={() => navigation.navigate("TransactionPin")}>
          <View style={{ flexDirection: 'row',   paddingBottom: 15, marginTop: 15 }}>
          <Feather name="lock" size={24} color="black" />
            <Text style={styles.textStyle}>Set Transaction Pin</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={{ alignItems: 'flex-start', borderBottomWidth:1,}} onPress={() => navigation.navigate("Biometric")}>
          <View style={{ flexDirection: 'row',   paddingBottom: 15, marginTop: 15 }}>
          <Ionicons name="finger-print" size={24} color="black" />
            <Text style={styles.textStyle}>Biometric Setup</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={{ alignItems: 'flex-start', borderBottomWidth:1,}} onPress={() => navigation.navigate("PasswordReset")}>
          <View style={{ flexDirection: 'row',   paddingBottom: 15, marginTop: 15 }}>
          <MaterialCommunityIcons name="account-lock-outline" size={24} color="black" />
            <Text style={styles.textStyle}>Change Login Password</Text>
          </View>
        </TouchableOpacity>


        <TouchableOpacity style={{ alignItems: 'flex-start', borderBottomWidth:1,}} onPress={() => triggerUpdateCheck()}>
            <View style={{ flexDirection: 'row',   paddingBottom: 15, marginTop: 15 }}>
            <MaterialIcons name="update" size={24} color="black" />
              <Text style={styles.textStyle}>Check for Update</Text>
            </View>
          </TouchableOpacity>
      
        <TouchableOpacity style={{ alignItems: '', justifyContent:'space-between', borderBottomWidth:1, width: '100%'}} onPress={() => Alert.alert("Logout", "Are you sure you want to logout", [
          {
            text:"No",
            onPress: () => {}
          },
          {
            text:"Yes",
            onPress:() => authCtx.logout()
          }
        ])}>
          <View style={{ flexDirection: 'row',  paddingBottom: 15, marginTop: 15 }}>
            <Ionicons name='exit-outline' size={30}/>
            <Text style={styles.textStyle}>LogOut</Text>
          </View>
        </TouchableOpacity>

        
        <TouchableOpacity style={{ alignItems: 'flex-start', borderBottomWidth:1,}} onPress={() => 
          Alert.alert("Warning", "Are you sure you want to delete your account permanently from Igoepp", [
            {
              text: "No",
              onPress: () => {}
            },
            {
              text: "Yes",
              onPress: () => deleteAccountpermanently()
            }
          ])
          }>
          <View style={{ flexDirection: 'row',   paddingBottom: 15, marginTop: 15 }}>
          {/* <MaterialIcons name="update" size={24} color="black" /> */}
          <MaterialIcons name="delete" size={24} color="black" />
            <Text style={styles.textStyle}>Delete Account</Text>
          </View>
        </TouchableOpacity>
        <View style={{marginBottom:40}}/>
      </ScrollView>
    </View>
  )
}

export default Settings

const styles = StyleSheet.create({
  textStyle:{
    fontFamily: 'poppinsMedium',
    fontSize: 12,
    marginLeft: 10,
    top: 5
  },
  settingstxt:{
    fontSize: 18,
    color: Color.new_color,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
  },
})