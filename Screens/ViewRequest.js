import { StyleSheet, Text, View, SafeAreaView, FlatList, RefreshControl, TouchableOpacity,Alert, Dimensions, Platform } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { Border, Color, DIMENSION, marginStyle } from '../Components/Ui/GlobalStyle'
import GoBack from '../Components/Ui/GoBack'
import {Ionicons, MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons'
import Modal  from 'react-native-modal'
import { BidRequestWithid, GetCustomer, NegotiatePrice, ShowRequestWithId, SubRequest } from '../utils/AuthRoute'
import { AuthContext } from '../utils/AuthContext'
import LoadingOverlay from '../Components/Ui/LoadingOverlay'
import { Image } from 'expo-image'


const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width


const ViewRequest = ({navigation}) => {

  const [isBidModalVisble, setIsBidModalVisible] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [category, setCategory] = useState([])
  const authCtx = useContext(AuthContext)
  const [isFetching, setIsFetching] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isModalVisble, setIsModalVisible] = useState(false)
  const [request, setRequest] = useState([])
  const [bidinfo, setBidInfo] = useState("")





  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async() => {
      try {
        setIsFetching(true)
        const response = await SubRequest(authCtx.subCatId , authCtx.token)
        // console.log(response)
        setCategory(response)
        setIsFetching(false)
      } catch (error) {
        setIsFetching(true)
        Alert.alert("Sorry", "An error occured try again later", [
          {
              text:"Ok",
              onPress: () => navigation.goBack()
          }
        ])
        setIsFetching(false)
      }
    });
    return unsubscribe;
  }, [navigation]);

  const customer = async (id, customerid, cat_name, help_date, help_time, help_location, help_lga, help_state, help_country, help_desc, help_status, help_frequency, help_size, preassessment) => {
    try {
      setIsFetching(true)
      // console.log(id, customerid)
      const response = await GetCustomer(customerid, authCtx.token)
      const data = response.data.data
      navigation.navigate('ViewRequestWithId', {
        id: id,
        name: cat_name,
        date: help_date + " " + help_time,
        customerName: data.first_name + " " + data.last_name ,
        address: help_location + " "  + help_lga + " "  + help_state + " "  + help_country,
        instruction: help_desc,
        status: help_status,
        helpSize: help_size,
        helpFrequency: help_frequency,
        preassessment: preassessment
      })
      setIsFetching(false)
    } catch (error) {
      setIsFetching(true)
      Alert.alert("Sorry", "An error occured try again later", [
        {
            text:"Ok",
            onPress: () => navigation.goBack()
        }
      ])
      setIsFetching(false)
    }
  }

  const toggleModal =  () => {
    setIsModalVisible(!isModalVisble)
    // console.log(id)
  }
  
  const toggleBidModal =  () => {
    setIsBidModalVisible(!isBidModalVisble)
    // console.log(id)
  }


  const pull = async () => {
    try {
      setRefresh(true)
      const response = await SubRequest(authCtx.subCatId, authCtx.token)
      // console.log(response)
      setCategory(response)
      setRefresh(false)
    } catch (error) {
      setRefresh(true)
      Alert.alert("Sorry", "An error occured try again later", [
        {
            text:"Ok",
            onPress: () => navigation.goBack()
        }
    ])
      setRefresh(false)
    }
  }

  const showRequest = async (id) => {
    try {
      setIsLoading(true)
      const response = await ShowRequestWithId(id, authCtx.token)
      // console.log(response)
      setRequest(response)
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

  const ShowBidinfo = async (id) => {
    try {
        setIsLoading(true)
        const response = await BidRequestWithid(id, authCtx.Id, authCtx.token)
        // console.log(response)
        setBidInfo(response)
        setIsLoading(false)
    } catch (error) {
      setIsLoading(true)
      Alert.alert("Error", "Error fetching Bid detail on request")
      setIsLoading(false)
        // return;
    }
  }

  const AcceptBid = async (bidId, amount) => {
    if(amount === 0 || null){
      return Alert.alert('Amount Invalid', 'No negotiation has been made for you to accept')
    }
    const state = 'N'
    try {
        setIsFetching(true)
        const response = await NegotiatePrice(bidId, amount, state, authCtx.token)
        // console.log(response)
        if(response.message === "success"){
            Alert.alert('Success', "Success", [
              {
                  text:'Ok',
                  onPress: () => [pull()]
              }
          ])
        }
        setIsFetching(false)
    } catch (error) {
      setIsFetching(true)
        return Alert.alert('Error', error.response.data.message, [
            {
              text:'Ok',
              onPress: () => navigation.navigate('ViewRequest')
            }
        ]);
    }
  } 


  if(isFetching){
    return <LoadingOverlay message={"..."}/>
  }

  return (
    <SafeAreaView style={{marginTop:marginStyle.marginTp, marginHorizontal:10}}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.viewrequesttxt}> Request</Text>

      {category.length !== 0 ? 
      
      <>
      <FlatList
        style={{marginBottom:'20%'}}
        data={category}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={() => {pull()}}
          />
        }
        renderItem={({item}) => (
          <>


          <>

          {item.help_status === 'N' || item.help_status === 'X' ?   

          <>   


          <Text style={{marginLeft:10, fontFamily:'poppinsRegular', fontSize:14}}>{item.created_at}</Text>
          <View style={styles.pressable}>
          <View style={{flexDirection:'row'}}>
              <Text style={styles.itemText}>{item.cat_name}</Text>
              <Text style={{fontSize:12, top:3}}> (RID:{item.id})</Text>
            </View>
            <View style={{flexDirection:'row', justifyContent:'space-between', width:WIDTH * 0.85, top:5}}>
              <Text style={{fontFamily:'poppinsMedium', color: Color.saddlebrown_200, fontSize:10}}>
              <Ionicons name="location" size={12} color="tomato" />
                {item.help_lga} {item.help_state} { item.help_country} </Text>
            </View>

            {item.help_status === 'X' ? 
              <View style={{position:'absolute', justifyContent:'flex-end',  alignSelf:'flex-end', right:10, top:20 }}>
                <Text style={{color: Color.tomato}}>Cancelled</Text>            
              </View>
              : ""}
 
              {item.help_status === 'X' ? 
              <View style={{justifyContent:'space-evenly', alignItems:'flex-end', alignSelf:'flex-start', flexDirection:'row',marginTop: 15, marginLeft:20, marginBottom:10}}>
                <TouchableOpacity style={styles.cancelbtn} onPress={() => [toggleModal(), showRequest(item.id)]}>
                  <Text style={styles.canceltext}>View Request</Text>
              </TouchableOpacity>
              </View>
              : 
              <>
              <TouchableOpacity style={{position:'absolute', left:'87%', top:'15%'}} onPress={() => [toggleBidModal(), ShowBidinfo(item.id)]}>
                  <Image contentFit='contain' style={{width: 35, height:35, borderRadius:20, borderColor: 'red', borderWidth: 1, marginRight:28}}  source={require("../assets/gavel_5741343.png")}/>
                  
              </TouchableOpacity>

              <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center', marginTop: 20, marginBottom:10}}>
              <TouchableOpacity style={styles.viewbtn} onPress={() => [toggleModal(), showRequest(item.id)]}>
                  <Text style={styles.viewtext}>View Request</Text>
              </TouchableOpacity>

                
              <TouchableOpacity style={styles.cancelbtn} onPress={() => customer(item.id, item.customer_id, item.cat_name, item.help_date, item.help_time, item.help_location, item.help_lga, item.help_state, item.help_country, item.help_desc, item.help_status, item.help_frequency, item.help_size, item.preassessment_flg,) }>
                  <Text style={styles.canceltext}>Bid</Text>
              </TouchableOpacity>
              </View>
            </>
            }
            </View>
          </>

          : null
            
          } 
          </>
          </>

        )}  
      />
      </>

      :
      <View style={{justifyContent:'center', alignItems:'center', height: HEIGHT * 0.8}}>
      <Text style={{textAlign:'center'}}>No Request Found</Text>
      </View>
    }

        <Modal isVisible={isModalVisble}>
            <SafeAreaView style={styles.centeredView}>

            <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => toggleModal()}>
              <MaterialIcons name="cancel" size={30} color="white" />
            </TouchableOpacity>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Details</Text>

                {isLoading ? 
                <View style={{flex:1, marginTop: 30, marginBottom: 70}}>
                  <LoadingOverlay/>  
              </View>
                : 
                <FlatList
                  data={request}
                  keyExtractor={(item) => item.id}
                  renderItem={({item}) => (
                    <View>
                       {
                          Platform.OS === 'android' ?
                            <Image source={require("../assets/igoepp_transparent2.png")} style={{height:130, width:130, position:'absolute', alignContent:'center', alignSelf:'center', top:DIMENSION.HEIGHT * 0.07,justifyContent:'center', opacity:0.3, }} contentFit='contain'/>
                          :
                          <Image source={require("../assets/igoepp_transparent2.png")} style={{height:130, width:130, position:'absolute', alignContent:'center', alignSelf:'center', top:DIMENSION.HEIGHT * 0.05,justifyContent:'center', opacity:0.3, }} contentFit='contain'/>
                        }

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Price : </Text>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.agreed_price === null ? '0.00' : item.agreed_price}</Text>
                      </View>
                    {/* 
                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Category Name :</Text>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.cat_name}</Text>
                      </View> */}

                      <View style={{justifyContent:'space-between', flexDirection:'row',  alignItems:'center', }}>
                        <Text style={{marginRight: 20, marginBottom:5, fontSize:11}}>Description :</Text>
                        <Text style={{fontFamily:'poppinsRegular', maxWidth:'70%', textAlign:'right', fontSize:11}}>{item.help_desc}</Text>
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
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Request Type :</Text>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.preassessment_flg === "N" ? "Normal Request" : "Preassessment Request"}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Address :</Text>
                        <Text style={{fontFamily:'poppinsRegular', maxWidth:'80%', fontSize:11}}>{item.help_location}</Text>
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
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>L.G.A :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.help_lga}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Help Size :</Text>
                        <Text  style={{fontFamily:'poppinsRegular',fontSize:11}}>{item.help_size}</Text>
                      </View>
                      
                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular',  fontSize:11}}>Landmark :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.help_landmark}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Status :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.help_status === "X" ? "Cancelled" : item.help_status === "N" && "Negotiating"}</Text>
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


          <Modal isVisible={isBidModalVisble}>
            <SafeAreaView style={styles.centeredView}>

            <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => toggleBidModal()}>
              <MaterialIcons name="cancel" size={30} color="white" />
            </TouchableOpacity>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Bid Details</Text>

              {isLoading ? <LoadingOverlay/> :
                <>
              { bidinfo.length ===  0 ? 
                <View  style={{ height:DIMENSION.HEIGHT * 0.2, alignItems:'center', justifyContent:'center'}}>
                  <Text style={{fontSize:16, fontFamily:'poppinsMedium', color: Color.orange_100}}>No Bid Made</Text> 
                </View> 
              : 

              
              <FlatList
                data={bidinfo}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                  
                  <>
                  <View style={{marginBottom:10}}>
                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Bid Id :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.id}</Text>
                      </View>

                       <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Proposed Price :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.proposed_price}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Negotiation Price :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.negotiate_amt === 0 ? "0.00" : item.negotiate_amt}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Helper Id :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.helper_id}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Reason For Bid :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.reason}</Text>
                      </View>
                      

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Date :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.updated_at}</Text>
                      </View>

                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize:11}}>Status :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize:11}}>{item.status === 'R' ? 'Re-Negotiate' : 'Not Accepted'}</Text>
                      </View>

                      {/* <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular'}}>Re-Negotiation Count :</Text>
                        <Text  style={{fontFamily:'poppinsRegular'}}>{item.negotiate_count}</Text>
                      </View> */}

                       {/* <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center', marginTop: 20,}}> */}
                        <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center', marginTop: 15}}>
                          
                          {item.negotiate_amt === 0 ? 
                            <TouchableOpacity style={styles.cancelbtn} onPress={() => Alert.alert('Note', 'No Re-Negotiation has been made on Bid', [
                              {
                                text:'OK',
                                onPress: () => {}
                              }
                            ])}>
                                <Text style={styles.canceltext}>Re-Negotiate</Text>
                            </TouchableOpacity>
                          : 
                          <TouchableOpacity style={styles.cancelbtn} onPress={() => [toggleBidModal(), navigation.navigate('ReNegotiate', {
                            id: item.id,
                            customersPrice: item.negotiate_amt === 0 ? '0.00' : item.negotiate_amt,
                            proposed_price: item.proposed_price
                          })]}>
                              <Text style={styles.canceltext}>Re-Negotiate</Text>
                          </TouchableOpacity>
                          }

                          <TouchableOpacity style={styles.viewbtn} onPress={() => [toggleBidModal(), AcceptBid(item.id, item.negotiate_amt)] }>
                              <Text style={styles.viewtext}>Accept</Text>
                          </TouchableOpacity>
                        </View>
                    </View>
                  </>
                  
                  
                )}
              />
              }
              </>
            }
            </View>
            </SafeAreaView>
          </Modal>
    </SafeAreaView>
  )
}

export default ViewRequest

const styles = StyleSheet.create({
  viewrequesttxt:{
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
    margin:5,
    borderRadius: Border.br_3xs,
    padding:10
  },

  viewbtn:{
    backgroundColor:Color.white,
    borderColor: Color.brown,
    borderWidth: 1,
    justifyContent:'center',
    borderRadius: 3,
    width: WIDTH * 0.36,
    padding: 5
    },
  viewtext:{
    textAlign:'center',
    alignSelf:'center',
    fontFamily: 'poppinsMedium',
    fontSize: 12,
    color: Color.brown
  },

  cancelbtn: {
    backgroundColor: Color.new_color,
    borderRadius: 3,
    justifyContent:'center',
    width: WIDTH * 0.36,
    padding: 5
  },
  canceltext:{
    fontFamily: 'poppinsMedium',
    fontSize: 12,
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
    width: WIDTH  * 0.9,
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