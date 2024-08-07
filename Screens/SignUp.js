import { Alert, Pressable, KeyboardAvoidingView, SafeAreaView, TextInput, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { Dropdown } from 'react-native-element-dropdown'
import { Image } from 'expo-image'
import * as Location from 'expo-location';
import { ConvertPassword, SignUpHandyman } from '../utils/AuthRoute'
import Modal from 'react-native-modal'
import {MaterialIcons, FontAwesome} from '@expo/vector-icons'
import { Base64 } from 'js-base64'
import DateTimePicker from "@react-native-community/datetimepicker"
import { Border, Color, DIMENSION, FontSize, marginStyle} from '../Component/Ui/GlobalStyle'
import Input from '../Component/Ui/Input'
import SubmitButton from '../Component/Ui/SubmitButton'
import { AuthContext } from '../utils/AuthContext'
import LoadingOverlay from '../Component/Ui/LoadingOverlay'
import OTPFieldInput from '../Component/Ui/OTPFieldInput'
import GoBack from '../Component/Ui/GoBack'
import Flat from '../Component/Ui/Flat'
import {Platform} from 'react-native';




const data = [
  {
    id:"Y",
    name: "Accept"
  },
]

const sex = [
  { label: 'Male', value: 'M' },
  { label: 'Female', value: 'F' },
];

const IDTYPE = [
  { label: 'Nimc', value: 'NIN' },
  { label: 'Drivers License', value: 'Drivers License' },
  { label: 'Identification Card', value: 'ID Card' },
];


const SignUp = ({navigation}) => {
    const authCtx = useContext(AuthContext)
    const [enteredEmail, setEnteredEmail] = useState('');
    const [enteredFirstname, setEnteredFirstName] = useState('');
    const [enteredLastName, setEnteredLastName] = useState('');
    const [enteredPhone, setEnteredPhone] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');
    const [enteredConfirmPassword, setEnteredConfirmPassword] = useState('');
    const [enteredGender, setEnteredGender] = useState('');
    const [address, setAddress] = useState('')
    const [idnum, setIdnum] = useState('')
    const [idtype, setIdType] = useState('')

    const [helpdate, setHelpDate] = useState('')
    const [date, setDate] = useState(new Date())
    const [showdatePicker, setShowDatePicker] = useState(false)
    const [helpdateInvalid, sethelpdateInvalid] = useState(false)

  

    const [IsenteredEmail, setIsEnteredEmail] = useState(false);
    const [IsenteredFirstname, setIsEnteredFirstName] = useState(false);
    const [IsenteredLastName, setIsEnteredLastName] = useState(false);
    const [IsenteredPhone, setIsEnteredPhone] = useState(false);
    const [IsenteredPassword, setIsEnteredPassword] = useState(false);
    const [IsenteredConfirmPassword, setIsEnteredConfirmPassword] = useState(false);
    const [Isidnum, setIsIdnum] = useState(false);
    const [Isaddress, setIsAddress] = useState(false)
    const [IsenteredGender, setIsEnteredGender] = useState('');

    
    
    const [isCountryFocus, setIsCountryFocus] = useState(false);
    const [isStateFocus, setIsStateFocus] = useState(false);
    const [isCityFocus, setIsCityFocus] = useState(false);
    
    const [countryData, setCountryData] = useState([]);
    const [stateData, setStateData] = useState([]);
    const [cityData, setCityData] = useState([]);
    
    const [country, setCountry] = useState([]);
    const [state, setState] = useState([]);
    const [city, setCity] = useState([]);

    const [countryName, setCountryName] = useState([]);
    const [stateName, setStateName] = useState([]);
    const [cityName, setCityName] = useState([]);
    
    const [IscountryName, setIsCountryName] = useState('');
    const [IsstateName, setIsStateName] = useState('');
    const [IscityName, setIsCityName] = useState('');


    
    

    const [Iscategory, setIsCategory] = useState('');
    const [Issubcategory, setIsSubcategory] = useState('');
    const [Isidtype, setIsIdtype] = useState('');
    const [referral_code, setreferral_code] = useState()





    const [isSexFocus, setSexFocus] = useState('')

    const [categorydata, setCategoryData] = useState([]);
    const [subcategorydata, setSubcategoryData] = useState([]);

    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');

    const [isCategoryFocus, setIsCategoryFocus] = useState(false);
    const [isSubcategoryFocus, setIsSubcategoryFocus] = useState(false);

    const [isIdtypefocus, setIsIdtypeFocus] = useState(false);


   

    const emailIsInvalid = enteredEmail.includes('@')
  
    const [isLoading, setIsLoading] = useState(false)
    const [isAcceptTermsModalBisible, setisAcceptTermsModalBisible] = useState(false)
    const [avail, setavail] = useState()
    
    
    const toggleAcceptTermsModal = () => {
      setisAcceptTermsModalBisible(!isAcceptTermsModalBisible)
    }

    useEffect(() => {
    // setIsLoading(true)

    var config = {
        method: 'get',
        url: "https://igoeppms.com/igoepp/public/api/category"
    }

    axios(config)
    .then(function (response) {
        var count = Object.keys(response.data.data).length
        let categoryarray = []
        for (var i = 0; i < count; i++){
          categoryarray.push({
                label: response.data.data[i].cat_name,
                value: response.data.data[i].id,
            })
          }
          setCategoryData(categoryarray)
    })
    .catch(function (error) {
        return;
    })
    // setIsLoading(false)
}, [])

const subcat = (categorycode) => {
    var config = {
      method: 'get',
      url: `https://igoeppms.com/igoepp/public/api/showsubcategorybycatid/${categorycode}`,
    }

  axios(config)
  .then(function (response) {
      var count = Object.keys(response.data.data).length;
      let subcategoryarray = []
      for (var i = 0; i < count; i++){
        subcategoryarray.push({
            label: response.data.data[i].sub_cat_name,
            value: response.data.data[i].id,
          })
        }
      setSubcategoryData(subcategoryarray)
    })
    .catch(function (error) {
      return;
    })
  }


  useEffect(() => {
    var config = {
      method: 'get',
      url: "https://igoeppms.com/igoepp/public/api/general/country2",
      headers:{
        Accept: 'application/json',
        Authorization: `Bearer ${authCtx.token}`
      } 
    }
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data.data))
      // console.log(response)
      var count = Object.keys(response.data.data).length
      // console.log(re)
      let countryArray = []
      for (var i = 0; i < count; i++){
        countryArray.push({
          label: response.data.data[i].country_name,
          value: response.data.data[i].id,
        })
        // setCountryCode(response.data.data[i].id)
      }
      setCountryData(countryArray)
    })
    .catch(function (error) {
      // console.log(error);
      return;
    })
  }, [])



const handleState = (countryCode) => {
  var config = {
    method: 'get',
    url: `https://igoeppms.com/igoepp/public/api/general/state2/${countryCode}`,
    // headers:{
    //   Accept: 'application/json',
    //   Authorization: `Bearer ${authCtx.token}`
    // }
  }
  axios(config)
  .then(function (response) {
      console.log(JSON.stringify(response.data))
    var count = Object.keys(response.data.data).length;
    let stateArray = []
    for (var i = 0; i < count; i++){
      stateArray.push({
        label: response.data.data[i].state_name,
        value: response.data.data[i].id,
      })
      // setStateCode(response.data.data[i].id)
    }
    setStateData(stateArray)
  })
  .catch(function (error) {
    // console.log(error);
    return;
  })
}
const handleCity = (stateCode) => {
  // console.log(stateCode)
  var config = {
    method: 'get',
    url: `https://igoeppms.com/igoepp/public/api/general/lga2/${stateCode}`,
    headers:{
      Accept: 'application/json',
      Authorization: `Bearer ${authCtx.token}`
    }
  }

  axios(config)
  .then(function (response) {
    // console.log(JSON.stringify(response.data))
    var count = Object.keys(response.data.data).length;
    let cityArray = []
    for (var i = 0; i < count; i++){
      cityArray.push({
        label: response.data.data[i].lga_name,
        value: response.data.data[i].id,
      })
      // setCityCode(response.data.data[i].lga_code)
    }
    setCityData(cityArray)
  })
  .catch(function (error) {
    // console.log(error);
    return;
  })
}

const toggleDatePicker = () => {
  setShowDatePicker(!showdatePicker)
}

const onChangeDatePicker = ({type}, selectdDate) => {
  if(type == 'set'){
    const currentDate = selectdDate;
    setDate(currentDate)

    if(Platform.OS === 'android'){
      toggleDatePicker();
      const getdobdate = currentDate.getDate()
      const getdobyear = currentDate.getFullYear()
      const getdobmonth = currentDate.getMonth()+1

      // console.log(currentDate.getMonth())
      // console.log(currentDate.getDate())


      const dobtosend = getdobyear + "-" + getdobmonth + "-" + getdobdate
      // console.log(dobtosend)
      // setHelpDate(currentDate.toLocaleDateString())
      setHelpDate(dobtosend)
    }
  }else{
    toggleDatePicker()
  }
}

const confirmIOSDate = () => {
  const getdobdate = date.getDate()
  const getdobyear = date.getFullYear()
  const getdobmonth = date.getMonth()+1

  const dobtosend = getdobyear + "-" + getdobmonth + "-" + getdobdate

  // setHelpDate(date.toDateString())
  setHelpDate(date.toDateString())
  toggleDatePicker()
}



useEffect(() => {
  const getPermissions = async () => {
    let {status} = await Location.requestForegroundPermissionsAsync();
    // console.log(status)
    if (status !== 'granted'){
      Alert.alert('Location', 'Please grant location Permissions')
      return;
    }else{
      const currentlocation = await Location.geocodeAsync('')
    }
  };
  getPermissions();
}, [])




  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case 'email':
        setEnteredEmail(enteredValue);
        break;
      case 'firstname':
        setEnteredFirstName(enteredValue);
        break;
      case 'lastname':
        setEnteredLastName(enteredValue);
        break;
      case 'phone':
        setEnteredPhone(enteredValue);
        break;
      case 'password':
        setEnteredPassword(enteredValue);
        break;
      case 'confirmPassword':
        setEnteredConfirmPassword(enteredValue);
        break;
      case 'address':
        setAddress(enteredValue);
        break;
      case 'idnum':
        setIdnum(enteredValue);
        break;
      case 'referral':
        setreferral_code(enteredValue)
        break;
      case 'date':
        setDate(enteredValue)
        break;
    }
  }

 

  if(isLoading){
    return <LoadingOverlay message={'...'}/>
  }

  const convertpasswordget = async () => {
    toggleAcceptTermsModal()
    try {
      setIsLoading(true)
      const response = await ConvertPassword(enteredPassword)
      // console.log(response)
      const password = response
      signupSend(password)
    } catch (error) {
      setIsLoading(true)
      // console.log(error.response)
      Alert.alert("Error", "An error occured")
      setIsLoading(false)
    }
  }
    
  // console.log(helpdate)

    
    const signupHandler = async () => {
      // setIsLoading(true)
      const emailIsValid = enteredEmail.includes('@');
      const passwordIsValid = enteredPassword === null || enteredPassword === undefined || enteredPassword.length < 7;
      const passcheck =  enteredConfirmPassword === enteredPassword
      const phonecheck = enteredPhone === null || "" || enteredPhone.length === 0
      const addresscheck = address === null || undefined || "" || address.length === 0
      const countrycheck = country === null || undefined || "" || country.length === 0
      const statecheck = state === null || undefined || "" || state.length === 0
      const citycheck = city === null || undefined || "" || city.length === 0
      const helpdatecheck = helpdate === null || helpdate === undefined || helpdate === "" || helpdate.length === 0

      const gendercheck = enteredGender === null || undefined || "" || enteredGender.length === 0
      const categorycheck = category == null || undefined || "" || category.length === 0
      const subcategorycheck = subcategory === null || undefined || "" || subcategory.length === 0
      const idnumcheck = idnum === null || undefined || "" || idnum.length === 0
      const idtypecheck = idtype === null || undefined || "" || idtype.length === 0
      const firstnamecheck = enteredFirstname.length > 0  
      const lastnamecheck = enteredLastName.length > 0

       
      
        if(!firstnamecheck || !lastnamecheck || !emailIsValid || !enteredPhone || !enteredGender || !category || !subcategory || passwordIsValid ||
         !passcheck || !country || !state || !city || !address || helpdatecheck || idtypecheck || idnumcheck
        ){
            const InvalidFirstName = !firstnamecheck
            const InvalidLastName = !lastnamecheck
            const InvalidPhone = phonecheck
            const InvalidPassword = passwordIsValid
            const InvalidConfirmPassword = !passcheck
            const InvalidEmail = !emailIsValid
            const InvalidAddress = addresscheck
            const InvalidCountry = countrycheck
            const InvalidState = statecheck
            const InvalidCity = citycheck
            const InvalidGender = gendercheck
            const InvalidCategory = categorycheck
            const InvalidSubcategory = subcategorycheck
            const Invalididnum = idnumcheck
            const Invalididtype = idtypecheck


            setIsEnteredEmail(InvalidEmail)
            setIsEnteredFirstName(InvalidFirstName)
            setIsEnteredLastName(InvalidLastName)
            setIsEnteredPhone(InvalidPhone)
            setIsEnteredPassword(InvalidPassword)
            setIsEnteredConfirmPassword(InvalidConfirmPassword)
            setIsEnteredGender(InvalidGender)
            setIsAddress(InvalidAddress)
            setIsCountryName(InvalidCountry)
            setIsStateName(InvalidState)
            setIsCityName(InvalidCity)
            setIsCategory(InvalidCategory)
            setIsSubcategory(InvalidSubcategory)
            setIsIdnum(Invalididnum)
            setIsIdtype(Invalididtype)
            sethelpdateInvalid(helpdatecheck)



            Alert.alert('Invalid details', 'Please check the information provided.')
             
        }else{
          // if(Platform.OS === 'ios'){
          //   const addresstoUse = address + " " + city  + " " + state + " " + country
          //   const geocodeLocation = await Location.geocodeAsync(addresstoUse);
          //   const latitude = !address ? '' : geocodeLocation[0].latitude
          //   const longitude = !address ? '' : geocodeLocation[0].longitude

          //   try {
          //     setIsLoading(true)
          //     const response = await ConvertPassword(enteredPassword)
          //     // console.log(response)
          //     const password = response
          //     navigation.navigate('TermsAndCondition', {
          //       enteredEmail: enteredEmail, 
          //       enteredPassword: enteredPassword,
          //       enteredConfirmPassword:enteredConfirmPassword,
          //       enteredPhone:enteredPhone,
          //       address: address,
          //       country: country,
          //       state: state,
          //       city: city,
          //       helpdate: helpdate,
          //       enteredGender: enteredGender,
          //       category: category,
          //       subcategory: subcategory,
          //       idnum: idnum,
          //       idtype: idtype,
          //       enteredFirstname: enteredFirstname,
          //       enteredLastName: enteredLastName, latitude: latitude, longitude: longitude,
          //       convertedPassword: password
          //     })
          //     setIsLoading(false)
          //   } catch (error) {
          //     setIsLoading(true)
          //     // console.log(error.response)
          //     Alert.alert("Error", "An error occured")
          //     setIsLoading(false)
          //   }
          // }else{
            toggleAcceptTermsModal()
          // }
        }
      // setIsLoading(false)
    }

    const signupSend = async (conpass) => {
      const addresstoUse = address + " " + city  + " " + state + " " + country
      const geocodeLocation = await Location.geocodeAsync(addresstoUse);
      const latitude = !address ? '' : geocodeLocation[0].latitude
      const longitude = !address ? '' : geocodeLocation[0].longitude
      // const passwordMd5 = Base64.encode(enteredPassword)
      // console.log(addresstoUse)

      console.log(enteredEmail,
        enteredPassword,
        enteredConfirmPassword,
        enteredPhone,
        address,
        country,
        state,
        city,
        helpdate,
        enteredGender,
        category,
        subcategory,
        idnum,
        idtype,
        enteredFirstname,
        enteredLastName, latitude, longitude)

        // lastname, firstname, email, dob, phone, category, subcategory, password, sex, country, state, lga, address, latitude, longitude, identification_type,identification_num, referral_code

      try {
        setIsLoading(true)
        const response = await SignUpHandyman(enteredLastName, enteredFirstname, enteredEmail, helpdate, enteredPhone, category, subcategory, conpass, enteredGender, country, state, city, address, latitude, longitude, idtype, idnum, referral_code)
        console.log(response)
        authCtx.authenticated(response.access_token)
        authCtx.helperId(response.helper_id)
        authCtx.helperEmail(response.email)
        authCtx.helperFirstName(response.first_name)
        authCtx.helperLastName(response.last_name)
        authCtx.helperCatId(response.category)
        authCtx.helperSubCatId(response.subcategory) 
        authCtx.helperPhone(response.phone)
        authCtx.helperPicture(response.photo)
        authCtx.helperuserid(response.userid)
        authCtx.helperShowAmount('show')
        authCtx.helperlastLoginTimestamp(new Date().toString())
        authCtx.helpersumtot("0.00")
        setIsLoading(false)
      } catch (error) {
        setIsLoading(true)
        console.log(error.response)
        // Alert("Error", "An error occured try again later", {
        //     text: "Ok",
        //     onPress: () => navigation.goBack()
        // })
        const myObj = error.response.data.email;
        console.log(error.response)
        console.log(myObj)
        Alert.alert('SignUp Failed', myObj.toString())
        setIsLoading(false)
        return;
      }
    }

    if(isLoading){
      return <LoadingOverlay message={"Creating User"}/>
    }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
    <ScrollView style={{marginTop:55, marginHorizontal:18}} showsVerticalScrollIndicator={false}>

    <View style={{alignSelf:'center'}}>
    <Image style={{ width:100, height:100,}} source={require("../assets/igoepp_transparent2.png")}   placeholder={'blurhash'}
        contentFit="contain"
        transition={1000}
        />
      </View>
    <Text style={styles.Title}>Artisan Sign Up</Text>

      <View>
        <View style={styles.nameContainer}>
        <View style={styles.firstname}>

        <Input
          placeholder="First Name"
          onUpdateValue={updateInputValueHandler.bind(this, 'firstname')}
          value={enteredFirstname}
          isInvalid={IsenteredFirstname}
          onFocus={() => setIsEnteredFirstName(false)}
          />
        {/* {IsenteredFirstname && <Text style={{fontSize:10, color:Color.red}}>First name must be at least 5 characters</Text>} */}
    </View>
    <View style={styles.lastname}>
      <Input
        placeholder="Last Name"
        onUpdateValue={updateInputValueHandler.bind(this, 'lastname')}
        value={enteredLastName}
        isInvalid={IsenteredLastName}
        onFocus={() => setIsEnteredLastName(false)}
        />
        {/* {IsenteredLastName && <Text style={{fontSize:10, color:Color.red}}>Last name must be at least 5 characters</Text>} */}
      </View>
    </View>


        {showdatePicker && (
          <DateTimePicker
            mode="date"
            display='spinner'
            value={date}
            onChange={onChangeDatePicker}
            style={{ height: 120, marginTop: -10, fontFamily: 'poppinsRegular'}}
            // minimumDate={new Date()}
          />
        )}  

        {showdatePicker && Platform.OS === "ios" && (
        <View style={{ flexDirection: "row", justifyContent: 'space-around', marginTop:10 }}>
          <TouchableOpacity style={[styles.button1, styles.pickerButton, {backgroundColor: "#11182711"}]}
            onPress={toggleDatePicker}
          >
            <Text style={[styles.buttonText, {color: "#075985", fontFamily: 'poppinsRegular'}]}>Cancel</Text>
          </TouchableOpacity>


          <TouchableOpacity style={[styles.button1, styles.pickerButton,]}
            onPress={confirmIOSDate}
          >
            <Text style={[styles.buttonText, {fontFamily: 'poppinsRegular'}]}>Confirm</Text>
          </TouchableOpacity>
        </View>
        )}

      {!showdatePicker && (
        <Pressable style={styles.action} onPress={ () => [toggleDatePicker(), helpdateInvalid && sethelpdateInvalid(false)]}>
          <FontAwesome size={20} 
              color={Color.gray_100} 
              name="calendar"/>
          <TextInput
            placeholder={"Select Date of Birth"}
            value={helpdate}
            onChangeText={updateInputValueHandler.bind(this, 'date')}
            placeholderTextColor={"#11182744"}
            editable={false}
            // isInvalid={helpdateInvalid}
            // onFocus={() => sethelpdateInvalid(false)}
            onPressIn={toggleDatePicker}
            style={[styles.textInput, 
            ]}
          />
        </Pressable>
        )}

    <Input
      placeholder="Email Address"
      onUpdateValue={updateInputValueHandler.bind(this, 'email')}
      value={enteredEmail}
      keyboardType="email-address"
      autoCapitalize='none'
      isInvalid={IsenteredEmail}
      onFocus={() => setIsEnteredEmail(false)}
      // style={}
    />

    <View style={{ borderBottomColor: Color.dimgray_100, borderBottomWidth:1}}>
      <Dropdown
        style={[styles.dropdown, isSexFocus && { borderColor: 'blue' }, IsenteredGender ? styles.inputInvalid : null]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={sex}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isSexFocus ? 'Select Gender' : enteredGender}
        searchPlaceholder="Search..."
        value={enteredGender}
        onFocus={() => [setSexFocus(true), setIsEnteredGender(false)]}
        onBlur={() => setSexFocus(false)}
        onChange={item => {
          setEnteredGender(item.value);
          setSexFocus(false);
        }}
      />
        <View style={{ marginBottom:10 }}/>
      </View>
      
      <View style={{ borderBottomColor: Color.dimgray_100, borderBottomWidth:1}}>
      <Dropdown
        style={[styles.dropdown, isCountryFocus && { borderColor: 'blue' }, IscountryName && styles.inputInvalid]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={countryData}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isCountryFocus ? 'Select Country' : '...'}
        searchPlaceholder="Search..."
        value={countryName}
        onFocus={() =>[ setIsCountryFocus(true), setIsCountryName(false)]}
        onBlur={() => setIsCountryFocus(false)}
        onChange={item => {
          setCountry(item.label);
          setCountryName(item.value)
          setIsCountryFocus(false);
          handleState(item.value)
        }}
      />
        <View style={{ marginBottom:10 }}/>
    </View>

    <View style={{ borderBottomColor: Color.dimgray_100, borderBottomWidth:1}}> 
    <Dropdown
      style={[styles.dropdown, isStateFocus && { borderColor: 'blue' }, IsstateName && styles.inputInvalid]}
      placeholderStyle={[styles.placeholderStyle, {fontFamily: 'poppinsRegular'}]}
      selectedTextStyle={[styles.selectedTextStyle, {fontFamily: 'poppinsRegular'}]}
      inputSearchStyle={[styles.inputSearchStyle, {fontFamily: 'poppinsRegular'}]}
      iconStyle={styles.iconStyle}
      data={stateData}
      search
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder={!isStateFocus ? 'Select State' : '...'}
      searchPlaceholder="Search..."
      value={stateName}
      onFocus={() => [setIsStateFocus(true), setIsStateName(false)]}
      onBlur={() => setIsStateFocus(false)}
      onChange={item => {
        setState(item.label)
        setStateName(item.value)
        setIsStateFocus(false);
        handleCity(item.value)
      }}
      />
      <View style={{marginBottom:10}}/>
    </View>

    <View style={{ borderBottomColor: Color.dimgray_100, borderBottomWidth:1}}> 
    <Dropdown
      style={[styles.dropdown, isCityFocus && { borderColor: 'blue' }, IscityName && styles.inputInvalid]}
      placeholderStyle={[styles.placeholderStyle, {fontFamily: 'poppinsRegular'}]}
      selectedTextStyle={[styles.selectedTextStyle, {fontFamily: 'poppinsRegular'}]}
      inputSearchStyle={[styles.inputSearchStyle, {fontFamily: 'poppinsRegular'}]}
      iconStyle={styles.iconStyle}
      data={cityData}
      search
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder={!isCityFocus ? 'Select City' : '...'}
      searchPlaceholder="Search..."
      value={cityName}
      onFocus={() => [setIsCityFocus(true), setIsCityName(false)]}
      onBlur={() => setIsCityFocus(false)}
      onChange={item => {
        setCity(item.label)
        setCityName(item.value)
        setIsCityFocus(false);
      }}
    />
      <View style={{marginBottom:10}}/>
    </View>

      <>
      <Input placeholder="Address" value={address} onUpdateValue={updateInputValueHandler.bind(this, 'address')} isInvalid={Isaddress} onFocus={() => setIsAddress(false)}/>
        {/* <ButtonL onPress={geocode} message={'Geo Address'}/> */}
      </>

      <Input
        placeholder="Phone Number"
        onUpdateValue={updateInputValueHandler.bind(this, 'phone')}
        value={enteredPhone}
        keyboardType="numeric"
        isInvalid={IsenteredPhone}
        onFocus={() => setIsEnteredPhone(false)}
        maxLength={11}

      />

      <>
      <Dropdown
        style={[styles.dropdown, isCategoryFocus && { borderColor: 'blue' }, Iscategory && styles.inputInvalid]}
        placeholderStyle={[styles.placeholderStyle, {fontFamily: 'poppinsRegular'}]}
        selectedTextStyle={[styles.selectedTextStyle, {fontFamily: 'poppinsRegular'}]}
        inputSearchStyle={[styles.inputSearchStyle, {fontFamily: 'poppinsRegular'}]}
        iconStyle={styles.iconStyle}
        data={categorydata}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isCategoryFocus ? 'Select Category' : '...'}
        searchPlaceholder="Search..."
        value={category}
        onFocus={() => [setIsCategoryFocus(true), setIsCategory(false)]}
        onBlur={() => setIsCategoryFocus(false)}
        onChange={item => {
          subcat(item.value);
          setCategory(item.value)
          setIsCategoryFocus(false);
      }}
    />

    <Dropdown
      style={[styles.dropdown, isSubcategoryFocus && { borderColor: 'blue' }, Issubcategory ? styles.inputInvalid : null]}
      placeholderStyle={[styles.placeholderStyle, {fontFamily: 'poppinsRegular'}]}
      selectedTextStyle={[styles.selectedTextStyle, {fontFamily: 'poppinsRegular'}]}
      inputSearchStyle={[styles.inputSearchStyle, {fontFamily: 'poppinsRegular'}]}
      iconStyle={styles.iconStyle}
      data={subcategorydata}
      search
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder={!isSubcategoryFocus ? 'Select Sub Category' : '...'}
      searchPlaceholder="Search..."
      value={subcategory}
      onFocus={() => [setIsSubcategoryFocus(true), setIsSubcategory(false)]}
      onBlur={() => setIsSubcategoryFocus(false)}
      onChange={item => {
        // handleCity(category, item.value)
        setSubcategory(item.value)
        setIsSubcategoryFocus(false);
    }}
  />
      </>    

    <Dropdown
      style={[styles.dropdown, isIdtypefocus && { borderColor: 'blue' }, Isidtype ? styles.inputInvalid : null]}
      placeholderStyle={[styles.placeholderStyle, {fontFamily: 'poppinsRegular'}]}
      selectedTextStyle={[styles.selectedTextStyle, {fontFamily: 'poppinsRegular'}]}
      inputSearchStyle={[styles.inputSearchStyle, {fontFamily: 'poppinsRegular'}]}
      iconStyle={styles.iconStyle}
      data={IDTYPE}
      search
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder={!isIdtypefocus ? 'Select Identification Type' : '...'}
      searchPlaceholder="Search..."
      value={idtype}
      onFocus={() => [setIsIdtypeFocus(true), setIsIdtype(false)]}
      onBlur={() => setIsIdtypeFocus(false)}
      onChange={item => {
        // handleCity(category, item.value)
        setIdType(item.value)
        setIsIdtypeFocus(false);
      }}
    />

    {
    idtype
    &&
    <Input value={idnum}
      onUpdateValue={updateInputValueHandler.bind(this, 'idnum')}
      placeholder={idtype === "nin" ? "Nin number"  : idtype === "DL" ? "Drivers license Number" : "Id card number"}
      isInvalid={Isidnum}
      // keyboardType={"numeric"}      
      onFocus={() => setIsIdnum(false)}
    />
    }

    <>
      <Input
        placeholder={"Referral Code"}
        onUpdateValue={updateInputValueHandler.bind(this, 'referral')}
        value={referral_code}
      />
    </>

    <>
    <Input
      placeholder="Password"
      onUpdateValue={updateInputValueHandler.bind(this, 'password')}
      secure
      value={enteredPassword}
      isInvalid={IsenteredPassword}
      autoCapitalize={'none'}
      onFocus={() => setIsEnteredPassword(false)}
    />

    {
      IsenteredPassword && <Text style={{color:Color.tomato, fontSize:12}}>Password must be more than 7 characters</Text>
    }
    </>
    <>
    
    <Input
      placeholder="Verify Password"
      onUpdateValue={updateInputValueHandler.bind(
      this,
      'confirmPassword'
      )}
      secure
      autoCapitalize={'none'}
      value={enteredConfirmPassword}
      isInvalid={IsenteredConfirmPassword}
      onFocus={() => setIsEnteredConfirmPassword(false)}

      />
      {IsenteredConfirmPassword && <Text style={{color:Color.tomato, fontSize:12}}>Password Doesn't match</Text>}
    </>

    <View style={{marginBottom:50}}>
        <SubmitButton style={{marginHorizontal:30, marginTop:20, marginBottom:10}} onPress={signupHandler} message={'Sign Up'}/>
      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
        <Text style={{fontFamily:'poppinsRegular', fontSize:15,}}>Already Have An Account? </Text>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={{fontFamily:'poppinsRegular', fontSize:15, color:Color.orange_100}}>Login</Text>
      </TouchableOpacity>
      </View>
    </View>
    </View>

    
    <Modal isVisible={isAcceptTermsModalBisible}>

<SafeAreaView style={styles.centeredView}>

<TouchableOpacity style={{justifyContent:'flex-end', alignSelf:'flex-end', marginBottom:5, }} onPress={() => toggleAcceptTermsModal()}>
  <MaterialIcons name="cancel" size={30} color="white" />
</TouchableOpacity>

<View style={styles.modalView}>
<Text style={styles.modalText}>Accept Terms and Condition</Text>

<View style={{marginBottom:'2%'}}/>
<ScrollView showsVerticalScrollIndicator={false}>
<View style={{alignItems:'center'}}>
  <Text style={{textAlign:'center'}}>SUPPLIER SERVICE LEVEL AGREEMENT</Text> 
</View>

<Text> A.	SERVICE LEVEL AGREEMENT(SLA)</Text>

<Text style={styles.textsty}> 
  1.	Services to be Performed
</Text>
<Text style={styles.textsty2}>
  I have agreed to work in the capacity of <Text style={{fontFamily:'poppinsBold'}}> {enteredFirstname} { enteredLastName}</Text> as an Artisan 
</Text>
  

<Text style={styles.textsty}>
2.	Payment </Text>
<Text style={styles.textsty2}>
IGOEPP pays the artisan 36hrs after the customer has confirmed that the service has been executed satisfactory. IGOEPP would deduct 10% commission from the total amount collected from the customer.
</Text>

<Text style={styles.textsty}>
3.	Expenses</Text>
<Text style={styles.textsty2}>
Artisan is to ensure that all expenditure is considered in the bidding process with the customer. The customer can only buy replacement parts from IGOEPP designated suppliers.
</Text>

<Text style={styles.textsty}>
4.	Materials for Work </Text>
<Text style={styles.textsty2}>
All parts and materials that would be used to work for a customer must be purchased from IGOEPP designated suppliers by the customer in the IGOEPP Market Place on the APP. Artisan must not replace faulty parts or materials with personal materials or materials purchased from unauthorized supplier. IGOEPP Suppliers would deliver the part not the customer for the artisan to work with.
</Text>

<Text style={styles.textsty}>
5.	Terminating the Agreement</Text>
<Text style={styles.textsty2}>
With reasonable cause, either IGOEPP or Artisan may terminate the Agreement, effective immediately upon giving written notice.
Reasonable cause includes:
•	A material violation of this Agreement, or
•	Any act exposing the other party of liability to others for the personal injury or property damage.
OR
Either party may terminate this Agreement at any time by giving 30 days written notice to the other party of the intention to terminate. However, Artisan cannot terminate this agreement when there is a pending dispute with one of IGOEPP’s customers involving him.
</Text>

<Text style={styles.textsty}>
6.	Modifying the  Agreement </Text>
<Text style={styles.textsty2}>
This Agreement may be modified on mutual consent of both parties. (Ratification can be done via oral, written, email or other digital agreement).
</Text>

<Text style={styles.textsty}>
7.	Confidentiality</Text>
<Text style={styles.textsty2}>
Artisans acknowledge that it will be necessary for IGOEPP to disclose certain confidential and proprietary information about the client to them in order for artisan to perform duties under this Agreement. Artisan acknowledges that disclosure to the third party or misuse of this proprietary or confidential information would irreparably harm the Client. Accordingly, Artisan will not disclose or use, either during or after the term of this Agreement, any proprietary or confidential information of the Client without the Client’s prior written permission except to the extent necessary to perform the agreed service on the Client’s behalf.
Upon termination of Artisan’s service to company or at Client’s request, Artisan shall deliver to client all materials in Artisan’s possession relating to Client’s business.

Artisan acknowledges that any branch or threatened breach of this Agreement will result in irreparable harm to Client for which damages would be an adequate remedy. Therefore, Client shall be entitled to equitable relief, including an injunction, in the event of such breach or threatened breach of this Agreement. Such equitable relief shall be in addition to Client’s right’s and remedies otherwise available at law.
</Text>

<Text style={styles.textsty}>
8.	No Partnership</Text>
<Text style={styles.textsty2}>
This Agreement does not create a partnership relationship. Artisan does not have authority to enter contracts on IGOEPP’s behalf.
</Text>

<View style={{flexDirection:'row', justifyContent:'center', flex:1, marginTop:10, paddingLeft:15 }}>
  
<View style={{marginTop:'1%'}}>
  {data.map((item, key) => 
    <View key={key} style={{flexDirection:'row', justifyContent:'center', marginTop:5}}>
      <TouchableOpacity style={[styles.outer, ]} onPress={() => setavail(item.id)}>
        {avail === item.id && <View style={styles.inner}/>} 
      </TouchableOpacity>
      <Text style={{marginTop:5}}> Accept</Text>
  </View>
  )}
</View>
    <View style={{marginBottom:10}}/>
{
  avail  && 
    <SubmitButton style={{flex:1, marginLeft:10, marginHorizontal:20}} message={"Continue"} onPress={() => convertpasswordget()}/>
}
</View>
  <View style={{marginBottom:20}}/>

</ScrollView>

  </View>


  </SafeAreaView>
</Modal>
  
    </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default SignUp

const styles = StyleSheet.create({
  textInput:{
    flex: 1,
    fontFamily: 'poppinsRegular',
    marginTop: -12,
    paddingLeft: 10,
    fontSize: 15,
    top: 8,
  },
  action:{
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 7,
    borderBottomWidth: 1,
    borderBottomColor: Color.gray_100,
    paddingBottom: 5
  },
  container:{
    flex:1,
    marginTop:'12%',
    marginBottom:'1%'
  },
  textsty:{
    fontFamily:'poppinsBold'
  },
  textsty2:{
    fontFamily:'poppinsRegular'
  },
  outer:{
    width:25,
    height: 25,
    borderWidth: 1,
    borderRadius: 15,
    justifyContent:'center',
    alignItems: 'center'
  },
  inner:{
    width:15,
    height:15,
    backgroundColor: Color.new_color,
    borderRadius:10
  },
  container:{
    flex:1,
    marginTop:'12%',
    marginBottom:'1%'
  },
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

  nameContainer:{
    flex: 1,
    flexDirection: "row",
    // justifyContent: 'space-between',
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
    marginBottom: 10,
    // marginHorizontal: 50,
    fontSize: 25,
    // fontWeight: 'bold',
    fontFamily: 'poppinsMedium',
    color: Color.orange_100
  },
  centeredView: {
    flex: 1,
    // backgroundColor: Color.light_black,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
  },
  modalView: {
    margin: 15,
    backgroundColor: 'white',
    width: DIMENSION.WIDTH  * 0.9,
    borderRadius: 20,
    padding: 25,
    // alignItems: 'center',
    maxHeight: DIMENSION.HEIGHT * 0.7,
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
    fontSize:16, 
    fontFamily:'poppinsRegular'
  },
})