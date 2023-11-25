import { Alert, Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { marginStyle } from '../Components/Ui/GlobalStyle'
import Input from '../Components/Ui/Input'
import AuthContent from '../Components/Auth/AuthContent'
import LoadingOverlay from '../Components/Ui/LoadingOverlay'
import { LoginHandyman } from '../utils/AuthRoute'
import { AuthContext } from '../utils/AuthContext'



const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height



const Login = ({navigation}) => {
  
  const [IsLoading, setIsLoading] = useState(false)
  const authCtx = useContext(AuthContext)


  
  const loginHandler = async ({email, password}) => {
    try {
      setIsLoading(true)
      const response = await LoginHandyman(email, password)
      // console.log(response)
      authCtx.authenticated(response.access_token)  
      authCtx.helperId(response.helper_id)
      authCtx.helperEmail(response.email)
      authCtx.helperFirstName(response.first_name)
      authCtx.helperLastName(response.last_name)
      authCtx.helperCatId(response.category)
      authCtx.helperSubCatId(response.subcategory)
      authCtx.helperPhone(response.phone)
      authCtx.helperPicture(response.photo)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(true)
      // console.log(error)
      Alert.alert('Login Failed', error.response.data.message)
      setIsLoading(false)
      return;
    }
  }


  if(IsLoading){
    return <LoadingOverlay message={"Logging in"}/>
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{justifyContent:'center', flex:1, marginTop:'40%'}}>
          <AuthContent isLogin onAuthenticate={loginHandler}/>
        </View>
      </ScrollView>
    
    </SafeAreaView>
  )
}

export default Login

const styles = StyleSheet.create({})