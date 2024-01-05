import { Alert, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Color, DIMENSION, marginStyle } from '../Components/Ui/GlobalStyle'
import Modal from 'react-native-modal'
import {AuthContext} from "../utils/AuthContext"
import {MaterialIcons, FontAwesome, Ionicons} from '@expo/vector-icons'
import Input from '../Components/Ui/Input'
import SubmitButton from '../Components/Ui/SubmitButton'
import GoBack from '../Components/Ui/GoBack'
import { Image } from 'expo-image'
import { GuarantorsUpload, HelperBankDetails, HelperUploadAddressProof, HelperUploadIdCard, HelperUrl, UpLoad } from '../utils/AuthRoute'
import LoadingOverlay from '../Components/Ui/LoadingOverlay'
import * as ImagePicker from 'expo-image-picker'

const data = [
  { label: "Driver's License.", value: "Driver's License." },
  { label: "Permanent Voter's Card", value: "Permanent Voter's Card" },
  {label: "National Identification Number (NIN)", value:"National Identification Number (NIN)"},
  {label: "International Passport", value:"International Passport"}
]

const Complaince = ({navigation}) => {
  const [isGurantorModalVisble, setIsGuarantorModalVisible] = useState(false)
  const [isPassportModalVisble, setIsPassportModalVisible] = useState(false)
  const [isIdCardModalVisble, setIdCardModalVisible] = useState(false)
  const [isAddressModalVisble, setIsAddressModalVisible] = useState(false)
  const [isAccountModalVisble, setisAccountModalVisble] = useState(false)

  const [guarantorname, setGuarantorName] = useState('')
  const [guarantoremail, setGuarantorEmail] = useState('')

  const [isInvalidguarantorname, setIsInvalidGuarantorName] = useState(false)
  const [isInvalidguarantoremail, setIsInvalidGuarantorEmail] = useState(false)

  const [isloading, setisloading] = useState(false)
  const [fetchedInfo, setFetchedInfo] = useState([])

  const [images, setImages] = useState()
  const [addressProof, setAddressProof] = useState()
  const [idCard, setIdCard] = useState()
  
  const [imageBase, setImageBase] = useState()
  const [addressProofBase, setAddressProofBase] = useState()
  const [idCardBase, setIdCardBase] = useState()

  
  const [accountnumber, setAccountNumber] = useState()
  const [accountName, setAccountName] = useState()
  const [isInvalidaccountnumber, setIsInvalidAccountNumber] = useState(false)
  const [isInvalidaccountname, setIsInvalidAccountName] = useState(false)

  const [guarantorstatus, setGuarantorStatus] = useState('')
  const authCtx = useContext(AuthContext)



  useEffect(() => {
    const unsuscribe = navigation.addListener('focus', async() => {
      try {
        setisloading(true)
        const response = await HelperUrl(authCtx.Id, authCtx.token)
        setFetchedInfo(response)
        console.log(response)
        // setGuarantorStatus(response.guarantor_status)
        setisloading(false)
      } catch (error) {
        setisloading(true)
          // console.log(error)
          Alert.alert("Sorry", "An error occured try again later", [
            {
              text:"Ok",
              onPress: () => navigation.goBack()
            }
          ])
          setisloading(false)
          return;
      }
    })
    return unsuscribe
  }, [])

  const Customer = async() => {
    try {
        setisloading(true)
        const response = await HelperUrl(authCtx.Id, authCtx.token)
        // setGuarantorStatus(response.guarantor_status)
        authCtx.helperPicture(response.photo)
        setFetchedInfo(response)
        setisloading(false)
        setGuarantorName(null)
        setGuarantorEmail(null)
        setAccountNumber(null)
        setAccountName(null)
    } catch (error) {
      setisloading(true)
    //   console.log(error)
        Alert.alert("Sorry", "An error occured try again later", [
        {
            text:"Ok",
            onPress: () => navigation.goBack()
        }
        ])
        setisloading(false)
      return;
    }
  }

  const togglePassportModal = () => {
    setIsPassportModalVisible(!isPassportModalVisble)
  }

  const toggleGurantorModal = () => {
    setIsGuarantorModalVisible(!isGurantorModalVisble)
  }

  const toggleAccountModal = () => {
    setisAccountModalVisble(!isAccountModalVisble)
  }


  const toggleIdCardModal = () => {
    setIdCardModalVisible(!isIdCardModalVisble)
  }

  const toggleAddressModal = () => {
    setIsAddressModalVisible(!isAddressModalVisble)
  }


  const captureimage = async () => {
    ImagePicker.getCameraPermissionsAsync()

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect:[4,3],
      quality: 0.75,
      base64: true
    })

    if(result.canceled){
      togglePassportModal()
      return;
    }
    
    if(!result.canceled){
      setImages(result.assets[0].uri)
      setImageBase(result.assets[0].base64)
      togglePassportModal()
    }
  }

  const captureaddressimage = async () => {
    ImagePicker.getCameraPermissionsAsync()
    
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect:[4,3],
      quality: 0.75,
      base64: true
    })

    if(result.canceled){
      toggleAddressModal()
      return;
    }
    
    if(!result.canceled){
      setAddressProof(result.assets[0].uri)
      setAddressProofBase(result.assets[0].base64)
      toggleAddressModal()
    }
}

//id card capture image
const captureidcardimage = async () => {
  ImagePicker.getCameraPermissionsAsync()
  
  let result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect:[4,3],
    quality: 0.75,
    base64: true
  })
  
  if(result.canceled){
    toggleIdCardModal()
    return;
  }
  
  if(!result.canceled){
    setIdCard(result.assets[0].uri)
    setIdCardBase(result.assets[0].base64)
    toggleIdCardModal()
    }
  }

   // pick image 
   const pickImage = async () => {
    ImagePicker.getMediaLibraryPermissionsAsync()


    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect:[4,3],
        quality: 0.75,
        base64: true
    })

    if(result.canceled){
      togglePassportModal()
      return;
    }
    
    if(!result.canceled){
      setImages(result.assets[0].uri)
      setImageBase(result.assets[0].base64)
      togglePassportModal()
    }
   
}

//pick address prood image
const pickaddressImage = async () => {
  ImagePicker.getMediaLibraryPermissionsAsync()
        
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect:[4,3],
    quality: 0.75,
    base64: true
  })


  if(result.canceled){
    toggleAddressModal()
    return;
  }
  
  if(!result.canceled){
    setAddressProof(result.assets[0].uri)
    setAddressProofBase(result.assets[0].base64)
    toggleAddressModal()
  }
   
}

//pick id card image
const pickidcardImage = async () => {
    ImagePicker.getCameraPermissionsAsync()

    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect:[4,3],
        quality: 0.75,
        base64: true
    })

    if(result.canceled){
      toggleIdCardModal()
      return;
    }
    
    if(!result.canceled){
      setIdCard(result.assets[0].uri)
      setIdCardBase(result.assets[0].base64)
      toggleIdCardModal()
    }
   
}






  const deleteImage = () => {
    Alert.alert("Remove Image", "Do you want to delete selected Image", [
      {
        text: "No",
        onPress: () => {}
      },
      {
        text: "Yes",
        onPress: () => [setImages() && setImageBase()]
      },
    ])
    
}

  const deleteaddressImage = () => {
    Alert.alert("Remove Image", "Do you want to delete selected Image", [
      {
        text: "No",
        onPress: () => {}
      },
      {
        text: "Yes",
        onPress: () => [setAddressProof() && setAddressProofBase()]
      },
    ])
      
  }

  const deleteidcardImage = () => {
    Alert.alert("Remove Image", "Do you want to delete selected Image", [
      {
        text: "No",
        onPress: () => {}
      },
      {
        text: "Yes",
        onPress: () => [setIdCard() && setIdCardBase()]
      },
    ])
    
  }

  const uploadImage = async () => {
    let Image;
    // const filename = images.split('/').pop()
    const uploadUrl = `data:image/jpeg;base64,${imageBase}`
    try {
        setisloading(true)
        const response = await UpLoad(authCtx.Id, uploadUrl, authCtx.token)
        // console.log(response)
        setisloading(false)
        setImages()
        setImageBase()
        Alert.alert('Success', 'Passport Uploaded Successfully', [
          {
            text: 'Ok',
            onPress: () => {Customer()}
          }
        ])
    } catch (error) {
        setisloading(true)
        // console.log(error.response)
        Alert.alert('Error', "An error occured please try again later")
        setisloading(false)
        setImages()
        setImageBase()
        return;

    }
}

  const uploadIdCard = async () => {
    const uploadUrl = `data:image/jpeg;base64,${idCardBase}`
    try {
      setisloading(true)
      const response = await HelperUploadIdCard(uploadUrl, authCtx.Id, authCtx.token) 
      // console.log(response)
      setisloading(false)
      setIdCard()
      setIdCardBase()
      Alert.alert('Success', 'Id Card Uploaded Successfully', [
        {
          text: 'Ok',
          onPress: () => {Customer()}
        }
      ])
    } catch (error) {
      setisloading(true)
      // console.log(error.response)
      Alert.alert('Error', "An error occured please try again later")
      setisloading(false)
      setIdCard()
      setIdCardBase()
      return;
    }
  }

  const uploadAddressProof = async () => {
    const uploadUrl = `data:image/jpeg;base64,${addressProofBase}`
    try {
      setisloading(true)
      const response = await HelperUploadAddressProof(uploadUrl, authCtx.Id, authCtx.token) 
      // console.log(response)
      setisloading(false)
      setAddressProof()
      setAddressProofBase()
      Alert.alert('Success', 'Address proof Uploaded Successfully', [
        {
          text: 'Ok',
          onPress: () => {Customer()}
        }
      ])
    } catch (error) {
      setisloading(true)
      // console.log(error.response)
      Alert.alert('Error', "An error occured please try again later")
      setisloading(false)
      setAddressProof()
      setAddressProofBase()
      return;

    }
  }


  


  



  const updateInputValueHandler = (inputType, enteredValue) => {
    switch (inputType) {
      case 'guarantorname':
        setGuarantorName(enteredValue)
        break;

      case 'guarantoremail':
        setGuarantorEmail(enteredValue)
        break;
  
      default:
        break;
    }
}

const updateInputValueHandlerAccount = (inputType, enteredValue) => {
  switch (inputType) {
    case 'accountname':
      // setAccountName(enteredValue)
      setAccountName(enteredValue)
      break;

    case 'accountnumber':
      setAccountNumber(enteredValue)
      break;

    default:
        break;
  }
  }


  const guarantorHandler = async () => {
    const guarantoremailcheck = guarantoremail.includes('@') && guarantoremail.includes(".com")
    const gurantornamecheck = guarantorname === null || guarantorname === undefined || guarantorname === "" || guarantorname.length === 0

    setIsInvalidGuarantorEmail(!guarantoremailcheck)
    setIsInvalidGuarantorName(gurantornamecheck)

    
    if(guarantoremail && !gurantornamecheck){
      try {
          setisloading(true)
          const response = await GuarantorsUpload(guarantorname, guarantoremail, authCtx.Id, authCtx.token)
          // console.log(response)
          Alert.alert('Success', "Gurantor Details's Uploaded Successfully", [
              {
                  text: 'Ok',
                  onPress: () => {Customer()}
              }
          ])
          setisloading(false)
      } catch (error) {
        setisloading(true)
          // console.log(error.response.data)
        Alert.alert("Sorry", "An error occured try again later", [
          {
              text:"Ok",
              onPress: () => navigation.goBack()
          }
        ])
        setisloading(false)
        return;
      }
    }
      // Alert.alert("Success", "Guarantor details Successfully Uploaded")
  }

  const accountdetailshandler = async () => {
    const accountNameCheck = accountName === null || accountName === undefined || accountName.length === 0
    const accountnumberCheck = accountnumber === null || accountnumber === undefined || accountnumber.length === 0

    setIsInvalidAccountName(accountNameCheck)
    setIsInvalidAccountNumber(accountnumberCheck)

    if(!accountNameCheck && !accountnumberCheck){
      try {
        toggleAccountModal()
        setisloading(true)
        const response = await HelperBankDetails(accountnumber, accountName, authCtx.Id, authCtx.token) 
        // console.log(response)
        Alert.alert('Success', "Bank Account Details's Uploaded Successfully", [
          {
            text: 'Ok',
            onPress: () => {Customer()}
          }
        ])
        setisloading(false)
      } catch (error) {
        setisloading(true)
          // console.log(error.response.data)
        Alert.alert("Sorry", "An error occured try again later", [
          {
              text:"Ok",
              onPress: () => navigation.goBack()
          }
        ])
        setisloading(false)
        return;
          
      }
    }
  }


  if(isloading){
    return <LoadingOverlay message={"..."}/>
  }


  return (
    <View style={{marginTop:marginStyle.marginTp, marginHorizontal:10}}>
      <GoBack onPress={() => navigation.goBack()}>Back</GoBack>
      <Text style={styles.kyhtxt}>KYH Document's</Text>

    <View style={{justifyContent:'center', marginTop:10}}>
           

  <View style={{marginTop: 10, marginHorizontal:5}}>
    <TouchableOpacity style={[styles.shadow, {borderBottomColor: Color.new_color,  padding:20, marginBottom:20, flexDirection:'row', justifyContent:'space-between'}]} onPress={() => [images ? null : fetchedInfo.photo === null ? togglePassportModal() : null]}>
      <Text style={{fontSize:15}}>Passport Upload</Text>

      {/* {authCtx.image === "NoImage" ? */}
      <> 
      {images? 
          <View style={{flexDirection:'row'}}>
          <TouchableOpacity onPress={uploadImage}>
          <FontAwesome name="upload" size={24} color="black" style={{marginRight:5}}/> 
          </TouchableOpacity>
          <TouchableOpacity onPress={deleteImage}>
          <MaterialIcons name="delete" size={24} color="black" style={{marginLeft:5}}/>
          </TouchableOpacity>
      </View>
      : authCtx.picture === "NoImage" ?
      ""
      : 
      <Image source={require("../assets/group-729.png")} style={{width:20, height:20}}/> 

      }
          </>
          
      {/* } */}
    </TouchableOpacity>
    
    <TouchableOpacity style={[styles.shadow, {borderBottomColor: Color.new_color,  padding:20, marginBottom:20, flexDirection:'row', justifyContent:'space-between'}]} onPress={() => [addressProof ? null: fetchedInfo.address_verification_path === null ? toggleAddressModal() : null]}>
      <Text style={{fontSize:15}}>Proof of Address</Text>
        <> 
        {addressProof ? 
          <View style={{flexDirection:'row'}}>
          <TouchableOpacity onPress={uploadAddressProof}>
          <FontAwesome name="upload" size={24} color="black" style={{marginRight:5}}/> 
          </TouchableOpacity>
          <TouchableOpacity onPress={deleteaddressImage}>
          <MaterialIcons name="delete" size={24} color="black" style={{marginLeft:5}}/>
          </TouchableOpacity>
        </View>

        : fetchedInfo.address_verification_path !== null && fetchedInfo.verify_address_date === null  && fetchedInfo.verify_address === "N" ?
            
            <Text style={{color:Color.new_color, fontSize:11, top:4}}>Pending...</Text>

        : fetchedInfo.address_verification_path !== null && fetchedInfo.verify_address_date === null  && fetchedInfo.verify_address === "I" ?
            
            <Text style={{color: Color.tomato, fontSize:11}}>!!! Invalid Document</Text>

        : fetchedInfo.address_verification_path !== null && fetchedInfo.verify_address_date !== null  && fetchedInfo.verify_address === "Y" ?

            <Image source={require("../assets/group-729.png")} style={{width:20, height:20}}/> 
        : ""
        }
        </>
    </TouchableOpacity>

    <TouchableOpacity style={[styles.shadow, {borderBottomColor: Color.new_color,  padding:20, marginBottom:20, flexDirection:'row', justifyContent:'space-between'}]} onPress={() => [idCard ? null : fetchedInfo.identification_path === null ? toggleIdCardModal() : null] }>
      <Text style={{fontSize:15}}>Identification Card</Text>
      {idCard ? 
        <View style={{flexDirection:'row'}}>
          <TouchableOpacity onPress={uploadIdCard}>
          <FontAwesome name="upload" size={24} color="black" style={{marginRight:5}}/> 
          </TouchableOpacity>
          <TouchableOpacity onPress={deleteidcardImage}>
          <MaterialIcons name="delete" size={24} color="black" style={{marginLeft:5}}/>
          </TouchableOpacity>
        </View>

        : fetchedInfo.identification_path !== null && fetchedInfo.verify_identification_date === null  && fetchedInfo.verify_identification === "N" ?
            
            <Text style={{color:Color.new_color, fontSize:11, top:4}}>Pending...</Text>

        : fetchedInfo.identification_path !== null && fetchedInfo.verify_identification_date === null  && fetchedInfo.verify_identification === "I" ?
            
            <Text style={{color: Color.tomato}}>!!! Invalid Document</Text>

        : fetchedInfo.identification_path !== null && fetchedInfo.verify_identification_date !== null  && fetchedInfo.verify_identification === "Y" ?
            
            <Image source={require("../assets/group-729.png")} style={{width:20, height:20}}/> 

        :
            ""
        }
    </TouchableOpacity>

    <TouchableOpacity style={[styles.shadow, {borderBottomColor: Color.new_color,  padding:20, marginBottom:20, flexDirection:'row', justifyContent:'space-between'}]} onPress={() => toggleAccountModal()}>
        <Text style={{fontSize:15}}>Bank Account Details</Text>
        {
            fetchedInfo.accountname && fetchedInfo.accountname !== "null" ?
            <Image source={require("../assets/group-729.png")} style={{width:20, height:20}}/> 
            :
            ""
        }
      </TouchableOpacity>

      <TouchableOpacity style={[styles.shadow, {borderBottomColor: Color.new_color,  padding:20, marginBottom:20, flexDirection:'row', justifyContent:'space-between'}]} onPress={() =>[fetchedInfo.guarantor_status === "A" || fetchedInfo.guarantor_status === "P" ? null : toggleGurantorModal()]}>
          <Text style={{fontSize:15}}>Gurantor's Details Upload</Text>
          {fetchedInfo.guarantor_status === "A" ?
              <Image source={require("../assets/group-729.png")} style={{width:20, height:20}}/> 
          : fetchedInfo.guarantor_status === "P" ?
              <Text style={{color:Color.new_color, fontSize:11, top:4}}>Pending...</Text>
          : ""
          }
      </TouchableOpacity>
    </View>
  </View>

      <Modal isVisible={isPassportModalVisble}>
        <SafeAreaView style={styles.centeredView}>

        <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => togglePassportModal()}>
          <MaterialIcons name="cancel" size={30} color="white" />
        </TouchableOpacity>
        <View style={[styles.modalView,  {width: DIMENSION.WIDTH * 0.7}]} showsVerticalScrollIndicator={false}>
          <Text style={[styles.modalText, {fontSize:16}]}>
            Passport Image
          </Text>

            <View style={{ marginBottom:10}}/>  

          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <View style={{alignItems:'center', justifyContent:'center'}}>

              <TouchableOpacity style={[styles.shadow,{borderWidth:1, padding:15, borderRadius:10, marginRight:10, borderColor:Color.new_color}]} onPress={captureimage}>
                <FontAwesome name="camera" size={24} color={Color.new_color} />
              </TouchableOpacity>
              <Text style={[styles.panelBottomTitle, {marginRight:15}]}> Camera</Text>
            </View>

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
      <Modal isVisible={isAddressModalVisble}>
        <SafeAreaView style={styles.centeredView}>

        <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => toggleAddressModal()}>
          <MaterialIcons name="cancel" size={30} color="white" />
        </TouchableOpacity>
        <View style={[styles.modalView,  {width: DIMENSION.WIDTH * 0.7}]} showsVerticalScrollIndicator={false}>
          <Text style={[styles.modalText, {fontSize:16}]}>
            Proof Of Address
          </Text>

            <View style={{ marginBottom:10}}/>  

          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <View style={{alignItems:'center', justifyContent:'center'}}>
              <TouchableOpacity style={[styles.shadow,{borderWidth:1, padding:15, borderRadius:10, marginRight:10, borderColor:Color.new_color}]} onPress={captureaddressimage}>
                <FontAwesome name="camera" size={24} color={Color.new_color} />
              </TouchableOpacity>
              <Text style={[styles.panelBottomTitle, {marginRight:15}]}> Camera</Text>
            </View>

            <View style={{alignItems:'center', justifyContent:'center'}}>
              <TouchableOpacity style={[styles.shadow,{borderWidth:1, padding:15, borderRadius:10, marginLeft:10, borderColor:Color.new_color}]} onPress={pickaddressImage}>
                <Ionicons name="ios-library-sharp" size={24} color={Color.new_color} />
              </TouchableOpacity>
              <Text style={[styles.panelBottomTitle, {marginLeft:15, marginRight:10}]}> Libraries</Text>
            </View>
          </View>

            <View style={{marginBottom:10}}/>
        </View>

        </SafeAreaView>
      </Modal>

    <Modal isVisible={isIdCardModalVisble}>
        <SafeAreaView style={styles.centeredView}>

        <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => toggleIdCardModal()}>
          <MaterialIcons name="cancel" size={30} color="white" />
        </TouchableOpacity>
        <View style={[styles.modalView,  {width: DIMENSION.WIDTH * 0.7}]} showsVerticalScrollIndicator={false}>
          <Text style={[styles.modalText, {fontSize:16}]}>
            Upload Id Card
          </Text>

            <View style={{ marginBottom:10}}/>  

          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <View style={{alignItems:'center', justifyContent:'center'}}>
              <TouchableOpacity style={[styles.shadow,{borderWidth:1, padding:15, borderRadius:10, marginRight:10, borderColor:Color.new_color}]} onPress={captureidcardimage}>
                <FontAwesome name="camera" size={24} color={Color.new_color} />
              </TouchableOpacity>
              <Text style={[styles.panelBottomTitle, {marginRight:15}]}> Camera</Text>
            </View>

            <View style={{alignItems:'center', justifyContent:'center'}}>
              <TouchableOpacity style={[styles.shadow,{borderWidth:1, padding:15, borderRadius:10, marginLeft:10, borderColor:Color.new_color}]} onPress={pickidcardImage}>
                <Ionicons name="ios-library-sharp" size={24} color={Color.new_color} />
              </TouchableOpacity>
              <Text style={[styles.panelBottomTitle, {marginLeft:15, marginRight:10}]}> Libraries</Text>
            </View>
          </View>

            <View style={{marginBottom:10}}/>
        </View>

        </SafeAreaView>
      </Modal>


  <Modal isVisible={isGurantorModalVisble}>
        <SafeAreaView style={styles.centeredView}>

        <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => toggleGurantorModal()}>
          <MaterialIcons name="cancel" size={30} color="white" />
        </TouchableOpacity>

        <View style={[styles.modalView]}>
          <Text style={styles.modalText}>Gurantor's Details</Text>
          <View style={{ marginBottom:10}}/>  

            <Text style={styles.label}>Name</Text>
            <Input onFocus={() => setIsInvalidGuarantorName()} placeholder={"Enter Guarantor's Name"} value={guarantorname} style={[isInvalidguarantorname && styles.inputInvalid]} onUpdateValue={updateInputValueHandler.bind(this, 'guarantorname')} autoCapitalize='words'/>


            <Text style={styles.label}>Email</Text>
            <Input onFocus={() => setIsInvalidGuarantorEmail()} placeholder={"Enter Guaranrtor's Email"} style={[isInvalidguarantoremail && styles.inputInvalid]}  value={guarantoremail} onUpdateValue={updateInputValueHandler.bind(this, 'guarantoremail')} keyboardType="email-address" autoCapitalize='none'/>
          
            <View style={{marginBottom:10}}/>
            {/* <TextInput autoCapitalize=''/> */}

            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <TouchableOpacity style={styles.viewbtn} onPress={toggleGurantorModal}>
                    <Text style={styles.viewtext}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelbtn} onPress={guarantorHandler}>
                    <Text style={styles.canceltext}>Submit</Text>
                </TouchableOpacity>
            </View>

            <View style={{marginBottom:10}}/>
        </View>

        </SafeAreaView>
      </Modal>


      <Modal isVisible={isAccountModalVisble}>
        <SafeAreaView style={styles.centeredView}>

        <TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => toggleAccountModal()}>
          <MaterialIcons name="cancel" size={30} color="white" />
        </TouchableOpacity>
        <View style={styles.modalView} showsVerticalScrollIndicator={false}>
          <Text style={[styles.modalText, {fontSize:16}]}>
            {fetchedInfo.accountname && fetchedInfo.account !== "null" ? "Update Bank Account Details" : "Bank Account Details"}
            {/* Bank Account Details */}
          </Text>
          <View style={{ marginBottom:10}}/>  

            <Text style={styles.label}>Account Name 
            {fetchedInfo.accountname === null ? " (No account added)" : `(${fetchedInfo.accountname})`}
            </Text>
            <Input onFocus={() => setIsInvalidAccountName()} placeholder={"Enter Account Holder's Name"} value={accountName} style={[isInvalidaccountname && styles.inputInvalid]} onUpdateValue={updateInputValueHandlerAccount.bind(this, 'accountname')} autoCapitalize='words'/>

            <Text style={styles.label}>Bank Name</Text>
            <Input editable={false} style={{backgroundColor: Color.gray6, color: Color.dimgray_200}}  value={"Parallex Bank"} autoCapitalize='none'/>


            <Text style={styles.label}>Account Number 
              {fetchedInfo.account === null ? "" : `(${fetchedInfo.account})`}
            </Text>
            <Input onFocus={() => setIsInvalidAccountNumber()} placeholder={"Enter Account Number"} maxLength={10} keyboardType="numeric" style={[isInvalidaccountnumber && styles.inputInvalid]}  value={accountnumber} onUpdateValue={updateInputValueHandlerAccount.bind(this, 'accountnumber')} autoCapitalize='none'/>
          
            <View style={{marginBottom:20}}/>
            {/* <TextInput autoCapitalize=''/> */}

            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <TouchableOpacity style={styles.viewbtn} onPress={toggleAccountModal}>
                    <Text style={styles.viewtext}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelbtn} onPress={accountdetailshandler}>
                    <Text style={styles.canceltext}>
                      {fetchedInfo.accountname && fetchedInfo.account === null  ? "Submit" : "Update"}
                      {/* Submit */}
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={{marginBottom:10}}/>

        </View>

        </SafeAreaView>
      </Modal>
    
    </View>
  )
}

export default Complaince

const styles = StyleSheet.create({
  inputInvalid: {
    backgroundColor: Color.error100,
  },
  panelBottomTitle: {
    fontSize: 12,
    fontFamily: 'poppinsSemiBold',
    top:5,
    color: Color.orange_100,
  },
  shadow:{
    // marginBottom: 20,
    borderRadius: 20, 
    elevation: 7,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    backgroundColor: 'white',
    overflow: Platform.OS === 'andriod' ? 'hidden' : 'visible',
  },
  kyhtxt:{
    fontSize: 18,
    color: Color.new_color,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
  }, 
  label: {
    color: 'black',
    marginBottom: 2,
    fontSize: 14,
    fontFamily: 'poppinsMedium'
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
    fontSize: 12,
    color: Color.brown
  },
  cancelbtn: {
    backgroundColor: Color.new_color,
    borderRadius: 3,
    justifyContent:'center',
    width: DIMENSION.WIDTH * 0.36,
    padding: 5
  },
  canceltext:{
    fontFamily: 'poppinsMedium',
    fontSize: 12,
    color: Color.white,
    textAlign: "center",
  },
})