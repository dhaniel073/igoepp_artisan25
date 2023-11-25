import { useState } from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity, Text, View, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AuthForm from './AuthForm'
import { Dimensions } from 'react-native';
import { Color } from '../Ui/GlobalStyle';
import Flat from '../Ui/Flat';

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

function AuthContent({ isLogin, onAuthenticate }) {
  const navigation = useNavigation();

  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
    confirmEmail: false,
    confirmPassword: false,
  });

  function switchAuthModeHandler() {
    if (isLogin) {
      navigation.replace('SignUp');
    } else {
      navigation.replace('Login');
    }
  }

  function ForgetPasswordHandler(){
    navigation.navigate('ForgotPassword')
  }

  function submitHandler(credentials) {
    let { email,password} = credentials;

    email = email.trim();
    password = password.trim();
   
    const emailIsValid = email.includes('@');
    const passwordIsValid = password.length >= 6;
    if (
      !emailIsValid ||
      !passwordIsValid ||
      (!isLogin && (!passwordsAreEqual))
    ) {
      Alert.alert('Invalid input', 'Please check your entered credentials.');
      setCredentialsInvalid({
        email: !emailIsValid,
        password: !passwordIsValid,
      });
      return;
    }
    onAuthenticate({ email, password});
  }

  return (
    <SafeAreaView style={styles.authContent}> 
      <AuthForm
        isLogin={isLogin}
        onSubmit={submitHandler}
        credentialsInvalid={credentialsInvalid}
      />
      <View style={styles.button}>
        {isLogin && (
          <Flat onPress={() => navigation.replace("ForgotPassword")}>
            Forgot Password
          </Flat>
        )}
      </View>
      <View style={{flexDirection:'row', alignItem:'center', justifyContent:'center', }}>
        <Text style={styles.newuser}>New User? </Text>
        <TouchableOpacity onPress={switchAuthModeHandler}>
            <Text style={styles.backtext}>{isLogin ? 'SignUp' : 'Back'}</Text>
        </TouchableOpacity>
      </View>
      
      
    </SafeAreaView>
  );
}

export default AuthContent;

const styles = StyleSheet.create({
  newuser:{
    fontSize:14,
    textAlign:'center',
    fontFamily: 'poppinsRegular'

  },
  backtext:{
    fontSize:14,
    color: Color.new_color,
    textAlign:'center',
    fontFamily: 'poppinsMedium'

  },
  authContent: {
    marginHorizontal: 10,
    // padding: 10,
  },
  button:{
    marginTop: 25
  },
  buttons: {
    color: 'white'
  },
  image4: {
    position: 'absolute',
    width: 10,
    height: 80,
    marginLeft: "34%",
  },
});
