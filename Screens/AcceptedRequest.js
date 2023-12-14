import { FlatList, RefreshControl, StyleSheet, Text, SafeAreaView, TouchableOpacity, View, TextInput, Alert, Dimensions, Platform } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Border, Color, DIMENSION, FontSize, marginStyle } from '../Components/Ui/GlobalStyle'
import GoBack from '../Components/Ui/GoBack'
import Modal from 'react-native-modal'
import {Ionicons, MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons'
import { Image, ImageBackground } from 'expo-image'
import { AuthContext } from '../utils/AuthContext'
import LoadingOverlay from '../Components/Ui/LoadingOverlay'
import { EndService, HelperCompleteProof, Request, RequestByHelperid, ShowRequestWithId, StartService } from '../utils/AuthRoute'
import axios from 'axios'



const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height



const AcceptedRequest = ({navigation}) => {
  const [request, setRequest] = useState('')
  const authCtx = useContext(AuthContext)
  const [refresh, setRefresh] = useState(false)
  const [isModalEndServiceVisible, setIsModalEndServiceVisible] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isdetailsLoading, setIsDetailsLoading] = useState([])
  const [description, setDescription] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [customerid, setCustomerId] = useState()
  const [details, setDetails] = useState([])
  const [endid, setendid] = useState()
  const [items, setItems] = useState()



  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async() => {
      // do something
      try {
        setIsLoading(true)
        const response = await RequestByHelperid(authCtx.Id , authCtx.token)
        console.log(response)
        setRequest(response)
        var count = Object.keys(response).length;
        let cityArray = []
        for (var i = 0; i < count; i++){
        cityArray.push({
            label: response[i].id,
        })
      }
        setCustomerId(cityArray)
        // fetchDataForItem(cityArray);
       
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
    });
    return unsubscribe;
  }, [navigation]);

  // console.log(customerid)

  const pull = async () => {
    try {
      setIsLoading(true)
      const response = await RequestByHelperid(authCtx.Id , authCtx.token)
      setRequest(response)
      var count = Object.keys(response).length;
      let cityArray = []
      for (var i = 0; i < count; i++){
      cityArray.push({
          label: response[i].customer_id,
      })
    }
    setCustomerId(cityArray)
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
  }

  const toggleEndServiceModal = (id) => {
    setendid(id)
    setIsModalEndServiceVisible(!isModalEndServiceVisible)
  }
 
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible)
  }

  const showRequestwithid = async (id) => {
    try {
      setIsDetailsLoading(true)
      const response = await ShowRequestWithId(id, authCtx.token) 
      setDetails(response)
      setIsDetailsLoading(false)
      setIsLoading(false)
      // console.log(response)
    } catch (error) {
     Alert.alert("Sorry", "An error occured try again later", [
        {
          text:"Ok",
          onPress: () => navigation.goBack()
        }
      ])
      return;
    }
  }


  const NoAcceptedRequest = () => {
    return (
      <View style={{ justifyContent:'center', alignItems:'center', marginTop: '70%' }}>
          <Text style={{ fontSize: FontSize.size_sm, color: Color.dimgray_100, fontFamily: 'poppinsSemiBold' }}>No Accepted Request</Text>
      </View>
    )
  }

  const refreshme = async () => {
    setIsLoading(true)
    const response = await Request(authCtx.catId, authCtx.token)
    // console.log(response)
    setRequest(response)
    setIsLoading(false)
  }

  const DateFor = new Date()


  //date
  const datefor = DateFor.getDate()
  const monthFor = DateFor.getMonth() + 1
  const year = DateFor.getFullYear()


  //time
  const hourFor = DateFor.getHours()
  const minuteFor = DateFor.getMinutes()
  const secondsFor = DateFor.getSeconds()

  const startservice = async (id) => {
    const confirmDate = datefor <= 9 ? `0${datefor}`  : datefor
    const confirmMonth =  monthFor <= 9 ? `0${monthFor}`  : monthFor

    const confirmminute = minuteFor <=9 ? `0${minuteFor}` : minuteFor
    const confirmhour = hourFor <=9 ? `0${hourFor}` : hourFor
    const confirmseconds = secondsFor <=9 ? `0${secondsFor}` : secondsFor

    const ConfirmDate = year + "-" + confirmMonth + "-" + confirmDate

    const ConfrimTime = confirmhour+":"+confirmminute +":"+ confirmseconds

    try {
      setIsLoading(true)
      const response = await StartService(id, ConfirmDate + " " + ConfrimTime, authCtx.token)
      // console.log(response)
      setIsLoading(false)
      Alert.alert('Success', 'Service Started successfully', [
        {
          text:'Ok',
          onPress: () => refreshme()
        }
      ])
    } catch (error) {
      // console.log(error.response.data)
      Alert.alert("Sorry", "An error occured try again later", [
        {
          text:"Ok",
          onPress: () => navigation.goBack()
        }
      ])
      return;
    }
  }




  const endservice = async () => {
    const confirmDate = datefor <= 9 ? `0${datefor}`  : datefor
    const confirmMonth =  monthFor <= 9 ? `0${monthFor}`  : monthFor

    const confirmminute = minuteFor <=9 ? `0${minuteFor}` : minuteFor
    const confirmhour = hourFor <=9 ? `0${hourFor}` : hourFor
    const confirmseconds = secondsFor <=9 ? `0${secondsFor}` : secondsFor

    const ConfirmDate = year + "-" + confirmMonth + "-" + confirmDate

    const ConfrimTime = confirmhour+":"+confirmminute +":"+ confirmseconds

    
    try {
      setIsLoading(true)
      const response = await EndService(endid, ConfirmDate + " " + ConfrimTime, authCtx.token)
      Alert.alert("Success", `Request with id: ${endid} has been completed and ended successfully`, [
        {
          text:"Ok",
          onPress: () => refreshme()
        }
      ])
      setIsLoading(false)
    } catch (error) {
      Alert.alert("Sorry", "An error occured try again later", [
        {
          text:"Ok",
          onPress: () => navigation.goBack()
        }
      ])
    }
  }


  const complete = async () => {
    try {
      setIsLoading(true)
      const response = await HelperCompleteProof(endid, description, authCtx.token)
      setDescription(null)
      endservice()
      // setIsLoading(false)
    } catch (error) {
      setIsLoading(true)
      Alert.alert("Sorry", "An error occured try again later", [
        {
          text:"Ok",
          onPress: () => navigation.goBack()
        }
      ])
      setIsLoading(false)
    }
  }



  const AssignedHelper = authCtx.Id.toLocaleString()

  // const fetchDataForItem = async (item) => {
  //   let cityArray = []

  //   for(const it of item){
  //     try {
  //       const response = await axios.get(`https://phixotech.com/igoepp/public/api/auth/hrequest/helperhelpchatcountunread/${it.label}`, {
  //         headers:{
  //           Accept: 'application/json',
  //           Authorization: `Bearer ${authCtx.token}`
  //         }
  //       });
  //       cityArray.push(response.data)
  //     } catch (error) {
  //       console.log(error.response);
  //        // Propagate the error
  //     }
  //   }

  //   setItems(cityArray)

  // };

  // const fetchAllDataSequentially = async () => {
   
  // };

  // fetchAllDataSequentially()

  // console.log(items)

  if(isLoading){
    return <LoadingOverlay message={"..."}/>
  }


  return (
    <View style={{marginTop:marginStyle.marginTp, marginHorizontal:10, flex:1}}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.acceptedtxt}>AcceptedRequest</Text>

      <>
      {request.length ===  0 ? <NoAcceptedRequest/> :
      <FlatList
        data={request}
        showsVerticalScrollIndicator={false}
        // style={{marginBottom:'2%'}}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={() => {pull()}}
          />
        }
        renderItem={({item}) => (
          <>
          { item.assigned_helper === AssignedHelper? 
          <>

          <Text style={{marginLeft:10, fontFamily:'poppinsRegular', fontSize:14}}>{item.created_at}</Text>
          <View style={styles.pressable}>
            <View style={{flexDirection:'row'}}>
              <Text style={styles.itemText}>{item.cat_name} </Text>
              <Text style={{fontSize:12, top:3}}>(RID:{item.id})</Text>
            </View>
          <View style={{marginTop:8, marginBottom:10, flexDirection:'row'}}>
          
           <View style={{flexDirection:'row', justifyContent:'space-between', width:DIMENSION.WIDTH * 0.8, }}>
           <Text style={{fontFamily:'poppinsMedium',  fontSize:11, color:Color.saddlebrown_100}}>
           <Ionicons name="location" size={10} color={Color.tomato} />  
           {item.help_lga} {item.help_state} 
           </Text>

           <View style={{flexDirection:'row', flex:1, justifyContent:'flex-end'}}>

           {item.customer_statisfy === null ? 
              <TouchableOpacity style={{marginRight:18, marginTop: -5}} onPress={() => navigation.navigate('Chat', {
                customerId: item.customer_id,
                bid_id: item.id
              })}>

                <Ionicons name="chatbubbles" size={24} color={Color.orange_100} />
                {
                  item.chat_unread_helper === 0 ? "" :

                  <ImageBackground  source={require("../assets/ellipse-127.png")} contentFit="contain" style={{height:15, width:15, justifyContent:'center', position: 'absolute', marginLeft:18, marginTop:-4}}>
                    <Text style={{ fontSize: 8,  color: Color.white, fontFamily:'poppinsBold', textAlign:'center'}}>{item.chat_unread_helper}</Text>
                    {/* <Text style={[styles.text2, styles.text2Typo]}>{chatnum}</Text> */}
                  </ImageBackground>
                }
              </TouchableOpacity>
             
            : ""} 

              <Text style={styles.itemprice}>
                NGN {item.agreed_price}
              </Text>
           </View>
           </View>
           </View>
            


          <View style={{flexDirection:'row', justifyContent:'space-evenly', marginBottom:15}}>
              <TouchableOpacity style={styles.viewbtn} onPress={() => [showRequestwithid(item.id), toggleModal()]}>
                  <Text style={styles.viewtext}>View Request</Text>
              </TouchableOpacity>


              {item.start_request_time === null? 
              <>
                
              <TouchableOpacity style={styles.cancelbtn} onPress={() => Alert.alert('Start Service', 'Are you sure you want to Start service', [
                {
                  text: 'No',
                  onPress: () => {}
                },
                {
                  text: 'Yes',
                  onPress: () => startservice(item.id)
                }
              ])}>
                  <Text style={styles.canceltext}>Start Service</Text>
              </TouchableOpacity>
                </>
              : item.end_request_time === null ?
              <TouchableOpacity style={styles.endbtn} onPress={() => Alert.alert('End Service', 'Are you sure you want to end service', [
                {
                  text: 'No',
                  onPress: () => {}
                },
                {
                  text: 'Yes',
                  onPress: () => toggleEndServiceModal(item.id)
                }
              ])}>
                
                  <Text style={styles.endtext}>End Service</Text>
              </TouchableOpacity>

               : item.customer_statisfy === null ? 
               <>
               <Text style={[styles.completeservicetext, {position:'absolute', top:-57, left:'60%',  fontSize:10} ]}>Satisfaction Pending</Text>
               
               <TouchableOpacity style={styles.cancelbtn} onPress={() =>
                navigation.navigate("UploadScreen", {
                    customerId: item.customer_id,
                    request_id: item.id,
                    date: item.start_request_time
                  })}>
                      <Text style={styles.canceltext}>Upload Proof</Text>
                </TouchableOpacity>
                </>
               
              : item.customer_statisfy !== null  &&
                  // <Text>{item.custom_rating == undefined && "yes"}</Text>
                  
                  <>
                  {  item.custom_rating === undefined || custom_rating === null ?
                    <TouchableOpacity style={styles.cancelbtn} onPress={() => navigation.navigate("RateCustomer", {
                        customerId: item.customer_id,
                        date: item.start_request_time,
                        id: item.id,
                        rating: item.helper_rating
                      })}>
                        <Text style={styles.canceltext}>Rate Customer</Text>
                    </TouchableOpacity>
                  :   
                      <>
                     
                      <TouchableOpacity>
                        <Text style={styles.completeservicetext}>{item.custom_rating === null ? "Null" : "Service Completed" }</Text>
                      </TouchableOpacity>
                      </>
                  }
                  </>

             
              }

            </View>
          </View>
          
          </>
          
          : ''  } 
          </>
          

        )}
        />
        }
        {/* <View style={{marginBottom:"20%"}}/> */}
      </>

      {/* } */}

      <Modal isVisible={isModalVisible}>
          
        <SafeAreaView style={styles.centeredView}>
          <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => toggleModal()}>
            <MaterialIcons name="cancel" size={30} color="white" />
          </TouchableOpacity>

            <View style={styles.modalView}>
              <Text style={styles.modalText}>Details</Text>

             

                {isdetailsLoading ? <LoadingOverlay/> : 
                <FlatList
                  data={details}
                  keyExtractor={(item) => item.id}
                  renderItem={({item}) => (
                    <View>
                       {
                        Platform.OS === 'android' ?
                          <Image source={require("../assets/igoepp_transparent2.png")} style={{height:130, width:130, position:'absolute', alignContent:'center', alignSelf:'center', top:DIMENSION.HEIGHT * 0.1,justifyContent:'center', opacity:0.3, }} contentFit='contain'/>
                        :
                        <Image source={require("../assets/igoepp_transparent2.png")} style={{height:130, width:130, position:'absolute', alignContent:'center', alignSelf:'center', top:DIMENSION.HEIGHT * 0.05,justifyContent:'center', opacity:0.3, }} contentFit='contain'/>
                      }

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Price : </Text>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.agreed_price === null ? '0.00' : item.agreed_price}</Text>
                      </View>

                      {/* <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular'}}>Category Name :</Text>
                        <Text style={{fontFamily:'poppinsRegular'}}>{item.cat_name}</Text>
                      </View> */}

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Customer's Name :</Text>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.customer_name}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row',  alignItems:'center'}}>
                        <Text style={{marginRight: 20, fontSize:11}}>Description :</Text>
                        <Text style={{fontFamily:'poppinsRegular', maxWidth:'80%', textAlign:'right', fontSize:11}}>{item.help_desc}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Help Intervals :</Text>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.help_frequency}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Landmark :</Text>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.help_landmark}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Address :</Text>
                        <Text style={{fontFamily:'poppinsRegular', maxWidth:210, fontSize:11}}>{item.help_location}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Country :</Text>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.help_country}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>State :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.help_state}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Local Government Area :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.help_lga}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Help Size :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.help_size}</Text>
                      </View>
                      
                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Landmark :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.help_landmark}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Status :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.help_status === "C" ? "Completed" : "Active"}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Date :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.help_date}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Time :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.help_time}</Text>
                      </View>
                    </View>
                  )}    
                />
              }
              <View style={{ marginBottom:20}}/>  
          </View>

        </SafeAreaView>
      </Modal>

      <Modal isVisible={isModalEndServiceVisible}>
        <SafeAreaView style={styles.centeredView}>

          <View style={styles.modalView}>
            <Text style={styles.modalText}>Description</Text>

                  <TextInput   value={description} multiline={true} autoCapitalize='sentences' onChangeText={setDescription} style={styles.input} placeholder='Description of service carried out'/>
              <View style={{ marginBottom:20}}/>



            <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
                <TouchableOpacity style={styles.viewbtn} onPress={() => [toggleEndServiceModal(), setDescription()]} >
                      <Text style={styles.viewtext}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelbtn} onPress={() => !description ? Alert.alert('Reason', 'No reason for bid found, write a reason to continue')  : [complete(), toggleEndServiceModal(), ]}>
                    <Text style={styles.canceltext}>Continue</Text>
                </TouchableOpacity>
            </View>
            <View style={{marginBottom:'2%'}}/>
            
          </View>
        </SafeAreaView>
      </Modal>


    </View>
  )
}

export default AcceptedRequest

const styles = StyleSheet.create({
  itemprice:{
    color: Color.new_color,
    display: "flex",
    fontFamily: 'poppinsSemiBold',
    fontSize:12
  },
  completeservicetext:{
    color:'tomato',
    fontFamily: 'poppinsMedium',
    fontSize: 12,
    textAlign: "center",
  },
  input:{
    fontSize: 14,
    maxWidth: DIMENSION.WIDTH ,
    height: DIMENSION.HEIGHT * 0.05,
    // color: Color.new_color,
    borderBottomWidth:0.5,
  },
  acceptedtxt:{
    fontSize: 18,
    color: Color.new_color,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
  },  
  pressable:{
    backgroundColor: Color.mintcream,
    borderColor: "rgba(151, 173, 182, 0.2)",
    borderWidth: 1,
    borderStyle: "solid",
    margin:10,
    borderRadius: Border.br_3xs,
    padding:10
  },

  viewbtn:{
    backgroundColor:Color.white,
    borderColor: Color.brown,
    borderWidth: 1,
    justifyContent:'center',
    borderRadius: 3,
    width: DIMENSION.WIDTH * 0.36,
    padding: 5
    },
  viewtext:{
    textAlign:'center',
    alignSelf:'center',
    fontFamily: 'poppinsMedium',
    fontSize: 10,
    color: Color.brown
  },

  endbtn:{
    backgroundColor:Color.firebrick_200,
    borderWidth: 1,
    borderColor: Color.firebrick_200,
    justifyContent:'center',
    borderRadius: 3,
    width: DIMENSION.WIDTH * 0.36,
    padding: 5
    },

  endtext:{
    textAlign:'center',
    alignSelf:'center',
    fontFamily: 'poppinsMedium',
    fontSize: 10,
    color: Color.white
  },

  cancelbtn: {
    backgroundColor: Color.new_color,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Color.new_color,
    justifyContent:'center',
    width: DIMENSION.WIDTH * 0.36,
    padding: 5
  },
  canceltext:{
    fontFamily: 'poppinsMedium',
    fontSize: 10,
    color: Color.white,
    textAlign: "center",
  },
  centeredView: {
    flex: 1,
    // backgroundColor: Color.light_black,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    width: DIMENSION.WIDTH  * 0.9,
    borderRadius: 20,
    padding: 25,
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    // marginBottom: 15,
    textAlign: 'center',
    fontSize:18, 
    fontFamily:'poppinsRegular'
  },
})