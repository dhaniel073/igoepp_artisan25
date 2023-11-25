import { ScrollView, StyleSheet, View, Text, SafeAreaView, Dimensions,  } from 'react-native';
import { Color, marginStyle } from '../Ui/GlobalStyle';
import { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import Input from '../Ui/Input';
import SubmitButton from '../Ui/SubmitButton'
import { useNavigation } from '@react-navigation/native';

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height


function AuthForm({ isLogin, onSubmit, credentialsInvalid }) {
  const navigation = useNavigation();
  const [enteredEmail, setEnteredEmail] = useState('')
  const [enteredPassword, setEnteredPassword] = useState('');



  const {
    email: emailIsInvalid,
    password: passwordIsInvalid,
  } = credentialsInvalid;

  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case 'email':
        setEnteredEmail(enteredValue);
        break;
      case 'password':
        setEnteredPassword(enteredValue);
        break;
    }
  }

  async function submitHandler() {
    
    onSubmit({
      email: enteredEmail,
      password: enteredPassword,
    });
  }

  return (
    <SafeAreaView>

    <ScrollView style={{marginHorizontal:15}} showHorizontalScrollIndicator={false}>
    <View style={{alignSelf:'center'}}>
      <Image style={{ width:100, height:100,}} source={require("../../assets/igoepp_transparent2.png")}   placeholder={'blurhash'}
            contentFit="contain"
            transition={1000}
      />
      </View>
    <Text style={styles.Title}>{isLogin ? "Artisan Log In" : "Artisan Sign Up"}</Text>
    
      <View> 
             
        <Input
          placeholder="Email Address"
          onUpdateValue={updateInputValueHandler.bind(this, 'email')}
          value={enteredEmail}
          keyboardType="email-address"
          isInvalid={emailIsInvalid}
          autoCapitalize='none'
          // label={"Email"}
        />         

        <Input
          placeholder="Password"
          onUpdateValue={updateInputValueHandler.bind(this, 'password')}
          secure
          value={enteredPassword}
          isInvalid={passwordIsInvalid}
          autoCapitalize='none'
          // label={"Password"}

        />        

        <View style={styles.buttons}>   
          <SubmitButton onPress={submitHandler} message={isLogin ? 'Log In' : 'Sign Up'}/>
        </View>
       
      </View>
    </ScrollView>
    </SafeAreaView>

  );
}
// submitHandler

export default AuthForm;

const styles = StyleSheet.create({
  inputInvalid: {
    backgroundColor: Color.error100,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 10
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  }, 
  placeholderStyle: {
    fontSize: 16,
  },
  buttons: {
    marginTop: 25,
    marginBottom:20,
    marginLeft:20,
    marginRight:20
  },
  nameContainer:{
    flex: 1,
    flexDirection: "row",
  },
  firstname:{
    width: "50%"
  },
  lastname:{
    marginHorizontal: 10,
    width: "50%"

  },
  Title:{
    marginTop: 10, 
    // marginBottom: 10,
    fontSize: 25,
    fontFamily: 'poppinsMedium',
    color: Color.orange_100
  },

  
});
