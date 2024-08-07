import { StyleSheet, View, Text, SafeAreaView, Button, Pressable,TouchableOpacity, Dimensions} from "react-native";
import {Image} from "expo-image"
import { StatusBar } from "expo-status-bar";
import Swiper from "react-native-swiper";
import { Border, Color, DIMENSION, FontSize, marginStyle } from '../Component/Ui/GlobalStyle'
import Input from '../Component/Ui/Input'
import SubmitButton from '../Component/Ui/SubmitButton'
import { AuthContext } from '../utils/AuthContext'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'
import OTPFieldInput from '../Component/Ui/OTPFieldInput'
import GoBack from '../Component/Ui/GoBack'
import Flat from '../Component/Ui/Flat'
import {Platform} from 'react-native';



const width = Dimensions.get('window').width
const height = Dimensions.get('window').height


function FirstDisplayScreen({navigation}){

  const Down = ({...props}) => (
     <TouchableOpacity {...props} style={[styles.press]}>
       <Text style={styles.presstext}>Done</Text>
      </TouchableOpacity>
    )

    const Next = ({...props}) => (
      <TouchableOpacity {...props} style={[styles.press]}>
        <Text style={styles.presstext}>Next</Text>
       </TouchableOpacity>
     )

     const Skip = ({...props}) => (
      <TouchableOpacity {...props} style={[styles.skip]}>
        <Text style={styles.presstext}>Skip</Text>
       </TouchableOpacity>
     )

    return (
     <View style={styles.container}>
      {/* <StatusBar hidden={true}/> */}
      <Text></Text>
      <Swiper autoplay={true}>
        <View style={styles.slide}>
          <Image source={require('../assets/artboard3.jpg')} style={styles.image}/>
        </View>

        <View style={styles.slide}>
          <Image source={require('../assets/artboard2.jpg')} style={styles.image}/>
        </View>

        <View style={styles.slide}>
          <Image source={require('../assets/artboard1.jpg')} style={styles.image}/>
        </View>

      </Swiper>
      <View style={styles.textContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={{paddingLeft: 20, fontFamily: 'poppinsSemiBold', color: Color.new_color}}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={ () => navigation.navigate('SignUp')}>
          <Text  style={{paddingRight: 20, fontFamily: 'poppinsSemiBold', color: Color.new_color}}>SignUp</Text>
        </TouchableOpacity>
      </View>
     </View>
    )
}

export default FirstDisplayScreen;
const styles = StyleSheet.create({
  container:{
    flex:1
  },
  slide:{
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  image: {
    width: width,
    height: height
  },
  textContainer:{
    // position: 'absolute',
    bottom: 30,
    // height:15,
    flexDirection:'row',
    justifyContent:'space-between'
  }
});
