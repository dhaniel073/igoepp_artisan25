import { FlatList, StyleSheet, TouchableOpacity, Text, View, SafeAreaView, Dimensions,  Alert } from 'react-native'
import React, { useContext, useEffect, useState, useRef } from 'react'
import { Image, ImageBackground } from 'expo-image'
import { RequestByHelperid, RequestCompletedRequestByHelperId, ShowRequestWithId } from '../utils/AuthRoute'
import Modal from 'react-native-modal'
import {MaterialIcons, Entypo, AntDesign} from '@expo/vector-icons'
import { Border, Color, DIMENSION, FontSize, marginStyle } from '../Component/Ui/GlobalStyle'
import Input from '../Component/Ui/Input'
import SubmitButton from '../Component/Ui/SubmitButton'
import { AuthContext } from '../utils/AuthContext'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'
import OTPFieldInput from '../Component/Ui/OTPFieldInput'
import GoBack from '../Component/Ui/GoBack'
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import {Platform} from 'react-native';




const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height


const ServiceHistory = ({navigation}) => {
  const [request, setRequest] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isModalVisible, setisModalVisible] = useState(false)
  const [details, setDetails] = useState([])
  const [isdetailsLoading, setisdetailsLoading] = useState(false)
  const authCtx = useContext(AuthContext)


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async() => {
      // do something
      try {
        setIsLoading(true)
        const response = await RequestCompletedRequestByHelperId(authCtx.Id , authCtx.token)
        setRequest(response)
        setIsLoading(false)
      } catch (error) {
        // console.log(error)
        return;
      }
    });
    return unsubscribe;
  }, [navigation]);

  const viewRef = useRef();

    const captureAndShare = async () => {
      try {
        // Capture the screenshot
        const uri = await captureRef(viewRef, {
          format: 'png',
          quality: 1,
        });
  
        // Share the screenshot
        await Sharing.shareAsync(uri);
      } catch (error) {
        console.error('Error capturing and sharing screenshot:', error);
      }
    };

    const captureAndSaveScreen = async () => {
      try {
        // Capture the screen
        const uri = await captureRef(viewRef, {
          format: 'png',
          quality: 1.0,
        });
  
        // Get permission to access media library
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission to access media library is required!');
          return;
        }
  
        // Define the custom file name
        const fileName = `receipt_${new Date().getTime()}.png`;
        const downloadDir = FileSystem.documentDirectory + 'Download/';
        const fileUri = downloadDir + fileName;
  
        // Ensure the download directory exists
        await FileSystem.makeDirectoryAsync(downloadDir, { intermediates: true });
  
        // Move the captured image to the download directory with the custom name
        await FileSystem.moveAsync({
          from: uri,
          to: fileUri,
        });
  
        // Save the file to the device's download folder
        const asset = await MediaLibrary.createAssetAsync(fileUri);
        const album = await MediaLibrary.getAlbumAsync('Download');
        if (album == null) {
          await MediaLibrary.createAlbumAsync('Download', asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }

        Alert.alert('Receipt saved successfully!');
      } catch (error) {
        console.error('Failed to capture and save screen:', error);
        Alert.alert('Failed to save receipt!');
      }
    };

    const ViewDetails = async (id) => {
      try {
        setisdetailsLoading(true)
        const response = await ShowRequestWithId(id, authCtx.token)
        // console.log(response)
        setDetails(response)
        setisdetailsLoading(false)
      } catch (error) {
        setisdetailsLoading(true)
        Alert.alert("Sorry", "An error occured try again later", [
          {
            text:"Ok",
            onPress: () => navigation.goBack()
          }
        ])
        setisdetailsLoading(false)
        return;
      }
    }



  const toggleModal = () => {
    setisModalVisible(!isModalVisible)
  }
  const NoServiceRequest = () => {
    return (
      <View style={{ justifyContent:'center', alignItems:'center', marginTop: '70%' }}>
          <Text style={{ fontSize: FontSize.size_sm, color: Color.dimgray_100, fontFamily: 'poppinsSemiBold' }}>No Service Completed</Text>
      </View>
    )
  }

  if(isLoading){
    return <LoadingOverlay message={"..."}/>
  }

  return (
    <View style={{marginTop:marginStyle.marginTp, marginHorizontal:10}}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.servicehistorytxt}>ServiceHistory</Text>
      <>        
          {request.length === 0 ? <NoServiceRequest/> : 
            <>                          
            <ImageBackground  style={{backgroundColor:'#F%F%F%', padding:5}} source={require("../assets/53541125-white-background-soft-light-grey-texture.jpg")}>
              <Text style={{textAlign:'center', fontSize:18, color:'grey', fontFamily:'poppinsMedium'}}>Completed Services</Text>
            </ImageBackground>

            <View style={{marginTop:10, marginBottom:10}}/>
            <FlatList
              data={request}
              keyExtractor={(item) => item.id}
              style={{marginBottom:10}}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => (
                <>
                {item.help_status === 'C' && item.start_request_time !== null || undefined && item.end_request_time !== null || undefined ? 
                <View style={styles.pressable}>

                  <Text style={styles.itemText}>{item.cat_name}</Text>

                  <View style={{flexDirection:'row', justifyContent:'space-between',  paddingRight:10}}>
                    <Text style={styles.itemprice}>NGN {item.agreed_price}</Text>    

                  <TouchableOpacity style={{justifyContent:'center', flexDirection:'row',}} onPress={() => [toggleModal(), ViewDetails(item.id)]}>
                    <Text style={{textAlign:'center', fontFamily:'poppinsRegular', color: Color.tomato, fontSize:12}}> View Details</Text>
                  </TouchableOpacity>
                  </View>
                </View>
                : ""}
                </>
              )}
              
            />
              </>
          }
          </>


        <Modal isVisible={isModalVisible}>
          
        <SafeAreaView style={styles.centeredView}>
          <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => toggleModal()}>
            <MaterialIcons name="cancel" size={30} color="white" />
          </TouchableOpacity>

            <View style={styles.modalView}  ref={viewRef}>
              <Text style={styles.modalText}>Details</Text>

                {isdetailsLoading ? <LoadingOverlay/> : 
                <FlatList
                  data={details}
                  keyExtractor={(item) => item.id}
                  renderItem={({item}) => (
                    <View>
                        {
                          Platform.OS === 'android' ?
                            <Image source={require("../assets/igoepp_transparent2.png")} style={{height:130, width:130, position:'absolute', alignContent:'center', alignSelf:'center', top:DIMENSION.HEIGHT * 0.12,justifyContent:'center', opacity:0.3, }} contentFit='contain'/>
                          :
                          <Image source={require("../assets/igoepp_transparent2.png")} style={{height:130, width:130, position:'absolute', alignContent:'center', alignSelf:'center', top:DIMENSION.HEIGHT * 0.05,justifyContent:'center', opacity:0.3, }} contentFit='contain'/>
                        }

                        <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize :11 }}>Bid Reference : </Text>
                        <Text style={{fontFamily:'poppinsRegular', fontSize :11 }}> {item.id}</Text>
                        </View>

                        <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize :11 }}>Customer Id : </Text>
                        <Text style={{fontFamily:'poppinsRegular', fontSize :11 }}> {item.customer_id}</Text>
                        </View>

                        <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize :11 }}>Customer Satisfaction :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize :11 }}> {item.customer_statisfy === "N" ? "Not Satisfied" : "Satisfied"}</Text>
                        </View>

                        <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize :11 }}>Price : </Text>
                        <Text style={{fontFamily:'poppinsRegular', fontSize :11 }}> {item.agreed_price === null ? '0.00' : item.agreed_price}</Text>
                        </View>

                        {/* <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular'}}>Category Name :</Text>
                        <Text style={{fontFamily:'poppinsRegular'}}> {item.cat_name}</Text>
                        </View> */}

                        <View style={{justifyContent:'space-between', flexDirection:'row',  alignItems:'center'}}>
                        <Text style={{marginRight: 20, fontFamily: 'poppinsRegular',fontSize :11 }}>Description :</Text>
                        <Text style={{fontFamily:'poppinsRegular', maxWidth:'60%', textAlign:'right', fontSize :11 }}> {item.help_desc}</Text>
                        </View>

                        <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize :11 }}>Help Intervals :</Text>
                        <Text style={{fontFamily:'poppinsRegular', fontSize :11 }}> {item.help_frequency}</Text>
                        </View>

                        <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize :11 }}>Landmark :</Text>
                        <Text style={{fontFamily:'poppinsRegular', fontSize :11 }}> {item.help_landmark}</Text>
                        </View>

                        <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize :11 }}>Address :</Text>
                        <Text style={{fontFamily:'poppinsRegular', fontSize :11 }}> {item.help_location}</Text>
                        </View>

                        <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize :11 }}>Country :</Text>
                        <Text style={{fontFamily:'poppinsRegular', fontSize :11 }}> {item.help_country}</Text>
                        </View>

                        <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize :11 }}>State :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize :11 }}> {item.help_state}</Text>
                        </View>

                        <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize :11 }}>L.G.A :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize :11 }}> {item.help_lga}</Text>
                        </View>

                        <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize :11 }}>Help Size :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize :11 }}> {item.help_size}</Text>
                        </View>


                        <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize :11 }}>Landmark :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize :11 }}> {item.help_landmark}</Text>
                        </View>

                        <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize :11 }}>Service Start Time :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize :11 }}> {item.start_request_time}</Text>
                        </View>

                        <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize :11 }}>Service End Time :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize :11 }}> {item.end_request_time}</Text>
                        </View>


                        <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize :11 }}>Status :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize :11 }}> {item.help_status === 'C' ? 'Completed' : null}</Text>
                        </View>

                        <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize :11 }}>Date :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize :11 }}> {item.help_date}</Text>
                        </View>

                        <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                        <Text style={{fontFamily:'poppinsRegular', fontSize :11 }}>Time :</Text>
                        <Text  style={{fontFamily:'poppinsRegular', fontSize :11 }}> {item.help_time}</Text>
                        </View>

                        <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center', marginTop: 20,}}>
                        
                        <TouchableOpacity style={styles.sharebtn} onPress={() =>  captureAndShare()}>
                              <Entypo name="forward" size={24} color={Color.new_color}/>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => captureAndSaveScreen()}>
                          <AntDesign name="download" size={24} color={Color.new_color} />
                        </TouchableOpacity>
                      </View>


                    </View>
                  )}    
                />
              }
              <View style={{ marginBottom:20}}/>  
          </View>

        </SafeAreaView>
      </Modal>
    </View>
  )
}

export default ServiceHistory

const styles = StyleSheet.create({
  itemprice:{
    fontFamily:'poppinsRegular',
    fontSize:12,
    color: Color.tomato
  },
  servicehistorytxt:{
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
    margin:3,
    borderRadius: Border.br_3xs,
    padding:16
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