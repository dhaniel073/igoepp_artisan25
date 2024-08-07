import { Alert, AppState, Dimensions, FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import {Platform} from 'react-native';
import { Image, ImageBackground } from 'expo-image'
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import Swiper from 'react-native-swiper'
import * as LocalAuthentication from 'expo-local-authentication'
import { GetNews, HelperUrl, NotificationUnread, RequestByHelperid, RequestSumTotal, SliderImage, SubCategory, TrendingService, ViewSubCategory } from '../utils/AuthRoute';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications'
import axios from 'axios';
import { Border, Color, DIMENSION, FontSize, marginStyle } from '../Component/Ui/GlobalStyle'
import Input from '../Component/Ui/Input'
import SubmitButton from '../Component/Ui/SubmitButton'
import { AuthContext } from '../utils/AuthContext'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'
import OTPFieldInput from '../Component/Ui/OTPFieldInput'
import GoBack from '../Component/Ui/GoBack'



const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

const data = [
  {
    id:1,
    name: 25,
    description: 'services made'
  },

  {
    id:2,
    name: 'NGN' + 27,
    description: 'OutStanding Payment'

  }

]



const WelcomeScreen = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isBiometricSupported, setIsBiometricSupported] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [subcatname, setSubCatName] = useState([])
  const [appState, setAppState] = useState(AppState.currentState)
  const [appStateVisible, setAppStateVisible] = useState(appState.current)
  const [count, setCount] = useState(0);
  const [trend, setTrend] = useState([])
  const [sumtot, setsumtot] = useState([])
  const [photo, setPhoto] = useState()
  const authCtx = useContext(AuthContext)
  const [sliimage, setsliimage] = useState([])
  const [request, setRequest] = useState([])
  const [notificationnumber, setnotificationnumber] = useState('')
  const [thenews, setNews] = useState()

  useEffect(() => {
    const unsuscribe = async () => {
      const token = (await Notifications.getExpoPushTokenAsync({ projectId: '0e18ffeb-cbc7-439c-8348-da5e8ba93af1' })).data;
      // console.log(token)
    }
    unsuscribe()
  }, [])

 
  



  useEffect(() => {
    (async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    setIsBiometricSupported(compatible)
  })
  }, [])

  const ShowAmount = () => {
    authCtx.helperShowAmount('show')
  }
  
  const HideAmount = () => {
    authCtx.helperShowAmount('hide')
  }

  function onAuthenticate (spec){
    const auth = LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate with Touch ID',
      fallbackLabel: 'Enter Password'
    });
    auth.then(result => {
      setIsAuthenticated(result.success);
      if(result.success === true){
        if(spec === 'hide'){
          HideAmount()
        }else{
          ShowAmount()
        }
      }else if (result.error === 'not_enrolled'){
        Alert.alert("", "Device not enrolled, setup up a screen lock to use this feature")
      }
    })   
  }

  


    useEffect(() => {
      TrendsArray()
      HelperGet()
      Slider()
      // news()
      // checkLastLoginTimestamp()
    }, [])

    const NotifiationNumber = async () => {
      try {
        const response  = await NotificationUnread(authCtx.userid, authCtx.token)
        // console.log(response)
        setnotificationnumber(response)
      } catch (error) {
        return
      }
    }


    useEffect(() => {
      navigation.addListener('focus', async () => {
        return Sumtotal()
      })
    }, [sumtot])

    useEffect(() => {
      navigation.addListener('focus', async () => {
        return reqLength()
      })
    }, [request])

    useEffect(() => {
        navigation.addListener('focus', async () => {
          NotifiationNumber()
        })
    }, [notificationnumber])


    useEffect(() => {
      navigation.addListener('focus', async () => {
        return unavailable()
      })
    }, [subcatname])

    
      const reqLength = async() => {
        // do something
        try {
          const response = await RequestByHelperid(authCtx.Id , authCtx.token)
          const length = response.length
          setRequest(length)
        } catch (error) {
          // console.log(error)
        return;
        }
      };


    if(isLoading){
      return <LoadingOverlay message={"..."}/>
    }

    const HelperGet = async () => {
      try {
        const response = await HelperUrl(authCtx.Id, authCtx.token)
        // console.log(response)
        setPhoto(response.photo)
        authCtx.helperPicture(response.photo)
      } catch (error) {
        return;
      }
    }

    async function Sumtotal(){
      try {
        const response = await RequestSumTotal(authCtx.Id , authCtx.token)
        setsumtot(response)
        // console.log(response)
        if(response === 0){
          authCtx.helpersumtot("0.00")
        }else{
          authCtx.helpersumtot(response)
        }
      } catch (error) {
        return;
      }
    };

    const TrendsArray = async() => {
      try {
      const response = await TrendingService(authCtx.token) 
      setTrend(response.data)
      } catch (error) {
        // console.log(error.response)
      }
    }

    const Slider = async () => {
      try {
        setIsLoading(true)
        const response = await SliderImage(authCtx.token)
        setsliimage(response)
        setIsLoading(false)
      } catch (error) {
        setIsLoading(true)
        // console.log(error.response)
        setIsLoading(false)
        return;
      }
    }

      const unavailable = async () => {
        try {
          const response = await axios.get(`https://igoeppms.com/igoepp/public/api/showsubcategorybycatid/${authCtx.catId}`)
          // console.log(response.data.data)
          // console.log(response.data)
          // console.log(response)
          setSubCatName(response.data.data)
        } catch (error) {
          // console.log(error)
          // console.log(error)
        }
      }

      const news = async () => {
        try {
          const response = await GetNews(authCtx.token)
          console.log(response)
          setNews(response.data.data)
        } catch (error) {
          // console.log(error)
          // console.log(error)
        }
      }

    


  return (
    <SafeAreaView style={{marginHorizontal:10, maxHeight: HEIGHT, marginTop: marginStyle.marginTp}}>
      
      <View style={styles.nameContainer}>
        <View style={{flexDirection:'row', justifyContent:'space-between', width:'100%'}}>
          {/* <FontAwesome name="reorder" size={24} color={Color.orange_200} /> */}
          <View style={{flexDirection:'row', marginHorizontal:10}}>
            {/* <Foundation name="list" size={24} color={Color.orange_200} />   */}
            
            {
              authCtx.picture === null || authCtx.picture === undefined || authCtx.picture === "null" || authCtx.picture === ""  || authCtx.picture === "NoImage"? 
              <TouchableOpacity onPress={() => navigation.navigate('ProfilePicsView')}>
                <Image transition={1000} source={require("../assets/person-4.png")} style={{width:35, height:35, borderRadius:30, borderWidth:1, top:-5}}/>
              </TouchableOpacity>
              :
              <TouchableOpacity onPress={() => navigation.navigate('ProfilePicsView')}>
                <Image transition={1000} source={{uri: `https://igoeppms.com/igoepp/public/handyman/${authCtx.picture}`}} style={{width:35, height:35, borderRadius:30, borderWidth:1, top:-5}}/>
              </TouchableOpacity>
            }
            <Text style={styles.hiChris}>Hi {authCtx.firstname}</Text>
          </View>

          <TouchableOpacity style={{flexDirection:'row', marginRight:3, justifyContent:'space-around'}} onPress={() => navigation.navigate('Notifications')}>
            <View style={{marginRight:8}}>
              <FontAwesome name="bell" size={24} color={Color.new_color} />
            </View>
            <View>

            {
              notificationnumber === 0 ? null :
                <ImageBackground transition={1000} style={{padding:5, position:'absolute', marginTop:-10, right:0}}
                    contentFit='contain'
                    source={require("../assets/ellipse-127.png")}>
                <Text style={[styles.text2, styles.text2Typo]}>{notificationnumber}</Text>

                </ImageBackground>
            }
            </View>


          </TouchableOpacity>
        </View>

      </View>
      <View>
          <ScrollView >
          <Swiper style={styles.wrapper} 
                dotColor= {Color.dimgray_100}
                // autoplay={true}
                // autoplayTimeout={100}
                activeDotColor='white'
                // activeDotStyle={{ width:20, height:9}}
                // dotStyle={{ width:10, height:11}}
              >
             
              <View style={styles.slide1}>
                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                  <Text style={styles.text}>{request}</Text>
                    {/* {
                      subcatname.map((item, key) => (
                        <Text style={{paddingRight:20, color:Color.white,  fontSize:12, fontFamily:'poppinsMedium', textAlign:'center', top:5}}>
                          {item.id === authCtx.subCatId ? "ues" : null } 
                        </Text>
                      ))
                    } */}
                     <FlatList
                        style={{position: 'absolute', right:0}}
                        data={subcatname}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item) => item.id}
                        
                        renderItem={({item}) => (
                          <>
                            <Text style={{paddingRight:20, color:Color.white,  fontSize:12, bottom:15, fontFamily:'poppinsMedium', textAlign:'center', top:1}}>{item.id.toString() === authCtx.subCatId && item.sub_cat_name}</Text>
                          </>
                          )
                        }
                      />
                  </View>

                <Text style={{fontFamily: 'interBold', fontSize:10, color: Color.white}}>Services Performed</Text>
              </View>
              
              {isLoading ? <LoadingOverlay/> :
              <View style={styles.slide1}>
                {/* <Image style={{height:30, width:30}} source={require("../assets/vectors/vector2.png")}/> */}
                <View style={{flexDirection:'row',}}>
                  <View>
                  <Text style={styles.text}>
                    <MaterialCommunityIcons name="currency-ngn" size={20} color={Color.white}/>
                    {authCtx.showAmount === 'show'  ? authCtx.sumtot : <Text>******</Text>} 
                  </Text>
                  </View>

                  {authCtx.showAmount === 'show' ?
                   <TouchableOpacity style={{alignSelf:'center', marginLeft:10}} onPress={() => onAuthenticate('hide')}>

                      <Entypo name="eye-with-line" size={24} color="white" />
                    </TouchableOpacity>
                  :
                    <TouchableOpacity style={{alignSelf:'center', marginLeft:10}} onPress={() => onAuthenticate('show')}>

                      <Entypo name="eye" size={24} color="white" />
                    </TouchableOpacity>
                  }

                </View>
                <Text  style={{fontFamily: 'interBold', fontSize:10, color: Color.white}}>OutStanding Payment</Text>
              </View>
              }
             
              </Swiper>          
            </ScrollView>

            <ScrollView style={{marginTop:10, borderRadius:10}}>
              <Swiper style={styles.wrapper1} 
                dotColor= {Color.dimgray_100}
                autoplay={true}
                autoplayTimeout={3}
                activeDotColor='white'
                activeDotStyle={{ width:0, height:0}}
                dotStyle={{ width:0, height:0}}>
             
              {sliimage.map((item, key) => (
                <>
                {
                  isLoading ? <LoadingOverlay/> :
                  <ImageBackground key={key} contentFit='contain' source={{uri: `https://igoeppms.com/igoepp/public/slider/${item.slide}`}} style={styles.slide2}></ImageBackground>
                }
                </>
              ))}  
            </Swiper>
          </ScrollView>

        </View>

        

      <ScrollView style={{ marginTop:'2%',}} showsVerticalScrollIndicator={false}>
      <View style={{marginHorizontal:10}}>
        <Text style={[styles.quickLinks,{fontFamily:'poppinsRegular', fontSize:15} ] }>Quick Links</Text>
      </View>

     
      <View>

        < View style={{}}>
          <ScrollView 
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={[styles.subContainer]}
          >

              <View style={{marginRight:10, marginTop:5,}}>

                <TouchableOpacity style={styles.makepayment}  onPress={() => navigation.navigate('BillPayment')}>
                  <Image contentFit='contain' source={require("../assets/makepay.png")} style={{width:40, height: 40,  }} transition={1000}/>
                  <Text style={{ color: Color.steelblue, marginTop:5, fontSize:13,}}>Bill Payment</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.viewrequest, {paddingLeft:8}]} onPress={() => navigation.navigate('ViewRequest')}>
                  {/* <Image contentFit='contain' source={require('../assets/vectors/service.png')} style={{width:50, height: 50, marginTop:50, alignSelf:'flex-end', marginRight:30}} transition={1000}/> */}
                  <Image contentFit='contain' source={require("../assets/group-753.png")} style={{width:50, height: 50, left:7 , marginTop: 55, marginBottom: 25 }} transition={1000}/>
                  <View style={{ justifyContent:'flex-end', alignItems:'flex-end', marginTop: 50}}>
                    <Text style={{color: Color.blueviolet, alignSelf:'baseline', fontSize:13,}}> View Request</Text>
                  </View>
                  <View style={{marginBottom:'30%'}}/>
                </TouchableOpacity>
                
              </View>

              <View style={{marginRight:10, marginTop:5,}}>
                <TouchableOpacity style={[styles.searchhistory, {paddingLeft:8}]} onPress={() => navigation.navigate('ServiceHistory')}>
                  {/* <Image contentFit='contain' source={require('../assets/vectors/service.png')} style={{width:50, height: 50, marginTop:50, alignSelf:'flex-end', marginRight:30}} transition={1000}/> */}
                  <Image contentFit='contain' source={require("../assets/service.png")} style={{width:50, height: 50,  marginTop: 55, marginBottom: 25, alignSelf:'flex-end', marginRight:30 }} transition={1000}/>
                  <View style={{ justifyContent:'flex-end', alignItems:'flex-end', marginTop: 50}}>
                    <Text style={{textAlign:'right', paddingRight:10, color:'#fff', fontFamily: 'poppinsRegular', fontSize:13,}}>Service History</Text>
                  </View>
                  <View style={{marginBottom:'30%'}}/>
                </TouchableOpacity>

                <TouchableOpacity style={styles.acceptedrequest}  onPress={() => navigation.navigate('AcceptedRequest')}>
                  <Image contentFit='contain' source={require('../assets/vector14.png')} style={{width:37,  height: 37, marginLeft:10, marginBottom:5  }} transition={1000}/>
                  <Text style={{color:'#fff', fontFamily: 'poppinsRegular', fontSize: 13}}>Accepted Request</Text>
                </TouchableOpacity>

              </View>

             

              <View style={{marginRight:10, marginTop:5}}>
                <TouchableOpacity style={styles.personalrequest}  onPress={() => navigation.navigate('PersonalRequest')}>
                <Image contentFit='contain' source={require("../assets/group-753.png")} style={{width:40, height: 40, left:7 , marginBottom: 10 }} transition={1000}/>
                  <Text style={{ color: Color.blueviolet, alignSelf:'baseline', fontSize:13,}}>Personal Request</Text>
                </TouchableOpacity>
              
              
                <TouchableOpacity style={[styles.availability, {paddingLeft:8}]} onPress={() => navigation.navigate('Availability')}>
                  <Image contentFit='contain' source={require("../assets/group13.png")} style={{width:50, height: 50,  marginTop: 55, marginBottom: 25, alignSelf:'flex-start', marginLeft:10 }} transition={1000}/>
                  <View style={{ justifyContent:'flex-start', alignItems:'flex-start', marginTop: 50}}>
                    <Text style={{textAlign:'left', color:Color.steelblue, fontFamily: 'poppinsRegular', fontSize:13}}>Availability</Text>

                  </View>
                  <View style={{marginBottom:'30%'}}/>
                </TouchableOpacity>

                
              </View>

          </ScrollView>
        </View>


        </View>
      {
        trend.length === 0 ? null :
        <>
        <View style={{marginTop:10, marginBottom:20}}>
          <Text style={{fontSize:15, marginLeft:10, fontFamily:'poppinsSemiBold'}}>Trending Service</Text>
          {
            trend.map((item, key) => {
              return(
                <View key={key} style={[styles.shadowProps, {flexDirection:'row', borderWidth:1, borderColor:Color.new_color, height:HEIGHT*0.1, alignSelf:'center', borderRadius:10,  width:WIDTH*0.8, margin:10, padding:10, marginLeft:20}]}>
                  <View style={{padding:10, borderColor:Color.new_color, borderWidth:1, borderRadius:10, top: Platform.OS === 'ios' ? 15 : 10, left:-25, position:'absolute', backgroundColor:'white'}}>
                    <Text><Entypo name="tools" size={30} color={Color.new_color} /></Text>
                  </View>

                  <View style={{marginLeft:30,  flex:1, justifyContent:'center'}}>
                      
                      <View>
                        <Text style={{fontFamily:'poppinsSemiBold', fontSize:13}}>{item.sub_category}</Text>
                      </View>

                      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Min Price: {item.min_agreed_price.toLocaleString()}</Text>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Max Price: {item.max_agreed_price.toLocaleString()}</Text>
                    </View>
                  </View>
                </View>
              )
            })
          }
         
        <Text style={{fontSize:15, marginLeft:10, fontFamily:'poppinsSemiBold'}}>Top Selling Product</Text>
        </View>
        </>
      }

      {/* got news */}

      {/* {
        <>
        <View style={{marginTop:10, marginBottom:20}}>
          <Text style={{fontSize:15, marginLeft:10, fontFamily:'poppinsSemiBold'}}>News</Text>
          {
            thenews.map((item, key) => {
              return(
                <View key={key} style={[styles.shadowProps, {flexDirection:'row', borderWidth:1, borderColor:Color.new_color, height:HEIGHT*0.1, alignSelf:'center', borderRadius:10,  width:WIDTH*0.8, margin:10, padding:10, marginLeft:20}]}>
                  <View style={{padding:10, borderColor:Color.new_color, borderWidth:1, borderRadius:10, top: Platform.OS === 'ios' ? 15 : 10, left:-25, position:'absolute', backgroundColor:'white'}}>
                    <Text><Entypo name="tools" size={30} color={Color.new_color} /></Text>
                  </View>

                  <View style={{marginLeft:30,  flex:1, justifyContent:'center'}}>
                      
                      <View>
                        <Text style={{fontFamily:'poppinsSemiBold', fontSize:13}}>{item.sub_category}</Text>
                      </View>

                      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Min Price: {item.min_agreed_price.toLocaleString()}</Text>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:10}}>Max Price: {item.max_agreed_price.toLocaleString()}</Text>
                    </View>
                  </View>
                </View>
              )
            })
          }
         
        </View>
        </>
      } */}


        {
          Platform.OS === 'android' ?
          <View style={{marginBottom:'20%', marginTop:'5%'}}/>
          : 
          <View style={{marginBottom:'30%', marginTop:'5%'}}/>
        }

      </ScrollView>
    </SafeAreaView>
  )
}

export default WelcomeScreen

const styles = StyleSheet.create({
  shadowProps:{
    marginBottom: 20,
    borderRadius: 20, 
    elevation: 7,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 7,
    backgroundColor: 'white',
    overflow: Platform.OS === 'andriod' ? 'hidden' : 'visible',
  },
  quickLinks: {
    color: Color.dimgray_100,
    fontSize: 15,
    fontWeight: "500",
    // borderWidth:1

  },
  text2Typo: {
    fontFamily: 'poppinsSemiBold',
    textAlign: "center",
  },
  text1Typo: {
    fontFamily: 'poppinsSemiBold',
    fontWeight: "500",
  },
  text2: {
    top:1,
    fontSize: 10,
    color: Color.white,
  },
  googlePixel2Xl116Inner: {
    width: 18,
    height: 18,
    position: "absolute",  
  },
  subContainer:{
    // height:HEIGHT * 0.6,
    paddingLeft:5,
    paddingRight:5,
  },
  makepayment:{
    height: HEIGHT * 0.12,
    backgroundColor: Color.skyblue,
    borderRadius: Border.br_3xs,
    width: WIDTH * 0.4,
    marginBottom: 10,
    padding:10
  },
  
  acceptedrequest:{
    height: HEIGHT * 0.12,
    backgroundColor: Color.limegreen_100,
    borderRadius: Border.br_3xs,
    width: WIDTH * 0.4,
    padding:10
  },
  availability:{
    backgroundColor: Color.skyblue,
    maxHeight: HEIGHT * 0.3,
    borderRadius: Border.br_3xs,
    width: WIDTH * 0.4,
    // padding:10,
    // marginBottom:10
  },
  nameContainer:{
    marginBottom:10,
    marginTop:10,
    // marginHorizontal:10
  },
  viewrequest:{
    backgroundColor: Color.mediumpurple,
    maxHeight: HEIGHT * 0.3,
    borderRadius: Border.br_3xs,
    width: WIDTH * 0.4,
    marginBottom:10
  },
  searchhistory:{
    backgroundColor: Color.lightcoral,
    maxHeight: HEIGHT * 0.3,
    borderRadius: Border.br_3xs,
    width: WIDTH * 0.4,
    marginBottom:10,
  },
  personalrequest:{
    backgroundColor: Color.mediumpurple,
    height: HEIGHT * 0.12,
    borderRadius: Border.br_3xs,
    width: WIDTH * 0.4,
    marginBottom: 10,
    padding:10
  },
  searchhistory:{
    backgroundColor: Color.lightcoral,
    maxHeight: DIMENSION.HEIGHT * 0.3,
    borderRadius: Border.br_3xs,
    width: DIMENSION.WIDTH * 0.4,
    marginBottom:10,

  },
  wrapper: {
    height: HEIGHT * 0.18,
  },
  wrapper1: {
    height: HEIGHT * 0.14,
    alignItems:'center',
    justifyContent:'center'
  },
  servicestypo:{
    fontWeight: "500",
    left: "0%",
    top: "0%",
    color: Color.gray6,
  },
  hiChris:{
    top: 2,
    left: 5,
    fontSize: 18,
    fontFamily:'poppinsRegular',
    color: Color.new_color,
    textAlign: "left",
  },
  slide2: {
    flex: 1,
    paddingLeft:20,
    paddingTop:20,
    marginHorizontal:5,
    backgroundColor: Color.new_color,
    borderRadius: 10,
  },
  slide1: {
    flex: 1,
    paddingLeft:20,
    paddingTop:20,
    marginHorizontal:5,
    backgroundColor: Color.new_color,
    borderRadius: 10,
  },



  text: {
    color: '#fff',
    fontSize: 20,
    fontFamily:'poppinsSemiBold'
  }
})