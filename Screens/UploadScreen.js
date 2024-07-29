import { StyleSheet, Text, TouchableOpacity, View , SafeAreaView, Alert, FlatList} from 'react-native'
import React, { useContext, useEffect, useState, useRef } from 'react'
import {Platform} from 'react-native';
import * as ImagePicker from "expo-image-picker"
import { Image, ImageBackground } from 'expo-image'
import {MaterialIcons, FontAwesome, Ionicons} from '@expo/vector-icons'
import Modal from 'react-native-modal'
import { GetHelperCompleteProofRequestId, RequestImageProof, UpLoad } from '../utils/AuthRoute'
import { Border, Color, DIMENSION, FontSize, marginStyle } from '../Component/Ui/GlobalStyle'
import Input from '../Component/Ui/Input'
import SubmitButton from '../Component/Ui/SubmitButton'
import { AuthContext } from '../utils/AuthContext'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'
import OTPFieldInput from '../Component/Ui/OTPFieldInput'
import GoBack from '../Component/Ui/GoBack'


const UploadScreen = ({navigation, route}) => {
  const authCtx = useContext(AuthContext)
  const refSheetIdCard = useRef()
  const [images, setImages] = useState([])
  const [imagebase, setImageBase] = useState([])
  const [details, setDetails] = useState()
  const [id, setId] = useState()
  const [IsLoading, setIsLoading] = useState(false)
  const [isuploadModalVisble, setisuploadModalVisble] = useState(false)

  let imageList = []

  const customerId = route?.params?.customerId
  const request_id = route?.params?.request_id
  const date = route?.params?.date
  
  
  useEffect(() => {
    getproofid()
  }, [])

  const getproofid = async () => {
    try {
        const response = await GetHelperCompleteProofRequestId(request_id, authCtx.token)
        // console.log(response.data)
        setDetails(response.data)
        setId(response.data[0].id)
    } catch (error) {
        return
    }
  }

  const toggleuploadModal = () => [
    setisuploadModalVisble(!isuploadModalVisble)
  ]

  const captureimage = async () => {
    // ImagePicker.getCameraPermissionsAsync()

    let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect:[4,3],
        quality: 0.75,
        base64: true
    })

    if(result.canceled){
      toggleuploadModal()
      return;
    }
    
    if(!result.canceled){
      setImages(result.assets[0])
      setImageBase(result.assets[0].base64)
      toggleuploadModal()
    }
}

const pickImage = async () => {
    let imagelist = []
    ImagePicker.getMediaLibraryPermissionsAsync()


    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection:true,
      aspect:[4,3],
      quality: 0.75,
      base64: true,
    })
    
      if(result.canceled){
        toggleuploadModal()
        return;
      }
    
    var count = Object.keys(result.assets).length;
    let catarray = []
    for (var i = 0; i < count; i++){
      catarray.push({
        label: result.assets[i].uri,
      })
      setImageBase(result.assets[i].base64)
      toggleuploadModal()
    } 
    setImages(catarray)
   
}
  const UploadProof = async () => {
    const uploadUrl = `data:image/jpeg;base64,${imagebase}`
    try {
      setIsLoading(true)
      const response = await RequestImageProof(id, uploadUrl, authCtx.token)
      // console.log(response) 
      setIsLoading(false)
      Alert.alert('Success', "Image proof uploaded sucessfully", [
        {
          text: "Ok",
          onPress: () => navigation.goBack()
        }
      ])
    } catch (error) {
      setIsLoading(true)
      // console.log(error.response)
      Alert.alert('Error', "An error occured while uploading image proof", [
        {
          text: "Ok",
          onPress: () => {}
        }
      ])
      setIsLoading(false)
    }
  }

if(IsLoading){
    return <LoadingOverlay message={"..."}/>
}
  return (
    <View style={{marginTop:marginStyle.marginTp, marginHorizontal:10, }}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.uploadtxt}>UploadScreen</Text>

        {/* {images.map((item, key) => (
          <>
            {
              images.length > 3 ?
              Alert.alert("Image Overload", "Maximum number of image exceeded, only 3 images can be sent", [
                {
                    text: 'Ok',
                    onPress: () => setImages([])
                }
              ]) 
              :
                <Image source={{uri: item.label}} style={styles.images}/>
            }
          </>
        ))} */}
        {
          images.length === 0 ?
          <>
          {Platform.OS === 'android' ?
            <>
           <View style={{borderRadius: 10, borderColor: Color.grey2, borderStyle:'dashed', width: DIMENSION.WIDTH * 0.9, alignSelf:'center',alignItems:'center', borderWidth:1,  height:DIMENSION.HEIGHT * 0.2,  justifyContent:'center'}}>
             <Text style={{}}>Upload Image</Text>
           </View>
           <View style={{marginLeft:30, marginRight:30, marginTop:20}}>
              <SubmitButton style={{marginTop:10, }} message={"Select Image"} onPress={() => toggleuploadModal()}/>
            </View>
           </>
           :
           <>
           <View style={{borderRadius: 10, borderColor: Color.grey2, width: DIMENSION.WIDTH * 0.9, alignSelf:'center',alignItems:'center', borderWidth:1,  height:DIMENSION.HEIGHT * 0.2,  justifyContent:'center'}}>
             <Text style={{}}>Upload Image</Text>
           </View>               
            <View style={{marginLeft:30, marginRight:30, marginTop:20}}>
                <SubmitButton style={{marginTop:10, }} message={"Select Image"} onPress={() => toggleuploadModal()}/>
            </View>
            </>
         }
          </>
          : 
           
            <>
            {
              images.length <= 3 ?
              <>
              <FlatList
              data={images}
              style={{marginBottom: 10}}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({item}) => (
                <View>
                  <Image source={{uri: item.label}} style={styles.images} contentFit='fill'/>
                </View>
              )}
            />
              <SubmitButton style={{marginTop:15, marginHorizontal:20}} message={"Upload Image"} onPress={() => UploadProof()}/>
            </>

            : 
              Alert.alert("Image Overload", "Maximum number of image exceeded, only 3 images can be sent", [
                {
                  text: 'Ok',
                  onPress: () => setImages([])
                }
              ]) 
            }
          </>
         }


        <Modal isVisible={isuploadModalVisble}>
        <SafeAreaView style={styles.centeredView}>

        <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => toggleuploadModal()}>
          <MaterialIcons name="cancel" size={30} color="white" />
        </TouchableOpacity>
        <View style={[styles.modalView,  {width: DIMENSION.WIDTH * 0.7}]} showsVerticalScrollIndicator={false}>
          <Text style={[styles.modalText, {fontSize:16}]}>
            Upload Image Proof
          </Text>

            <View style={{ marginBottom:10}}/>  

          <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
            {/* <View style={{alignItems:'center', justifyContent:'center'}}>
              <TouchableOpacity style={[styles.shadow,{borderWidth:1, padding:15, borderRadius:10, marginRight:10, borderColor:Color.new_color}]} onPress={captureimage}>
                <FontAwesome name="camera" size={24} color={Color.new_color} />
              </TouchableOpacity>
              <Text style={[styles.panelBottomTitle, {marginRight:15}]}> Camera</Text>
            </View> */}

            <View style={{alignItems:'center', justifyContent:'center'}}>
              <TouchableOpacity style={[styles.shadow,{borderWidth:1, padding:15, borderRadius:10, marginLeft:10, borderColor:Color.new_color}]} onPress={pickImage}>
                <Ionicons name="ios-library-sharp" size={24} color={Color.new_color} />
              </TouchableOpacity>
              <Text style={[styles.panelBottomTitle, {marginLeft:15, marginRight:10}]}> Libraries</Text>
            </View>
          </View>

            <View style={{marginBottom:10}}/>
        </View>

        </SafeAreaView>
      </Modal>
    </View>
  )
}

export default UploadScreen

const styles = StyleSheet.create({
  images:{
    backgroundColor: Color.mintcream,
    borderColor: "rgba(151, 173, 182, 0.2)",
    borderWidth: 1,
    borderStyle: "solid",
    margin:5,
    borderRadius: Border.br_3xs,
    padding:5,
    width:DIMENSION.WIDTH * 0.9,
    height: DIMENSION.HEIGHT * 0.2,
    alignSelf:'center'
  },
  shadow:{
    // marginBottom: 10,
    borderRadius: 20, 
    elevation: 7,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    backgroundColor: 'white',
    overflow: Platform.OS === 'andriod' ? 'hidden' : 'visible',
  },
  uploadtxt:{
    fontSize: 18,
    color: Color.new_color,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
  },
  uploadsscreentext:{
    fontSize: 16,
    color: Color.new_color,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginBottom:15,
},
startImgStyle:{
  width: DIMENSION.WIDTH * 0.9,
  height: 200,
  margin:3,
  borderWidth:1,
  // position:'absolute'

},
container:{
  padding:10,
  marginTop: marginStyle.marginTp
},
commandButton:{
  padding: 13,
  borderRadius: 6,
  backgroundColor: Color.white,
  // alignItems: 'center',

},
panelBottomTitle: {
  fontSize: 12,
  fontFamily: 'poppinsRegular',
  color: Color.orange_100,
  top:5
},
centeredView: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
modalView: {
  margin: 20,
  backgroundColor: 'white',
  width: DIMENSION.WIDTH  * 0.9,
  borderRadius: 20,
  padding: 20,
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
  textAlign: 'center',
  fontSize:18, 
  fontFamily:'poppinsRegular'
},
})