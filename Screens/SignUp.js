import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { Dropdown } from 'react-native-element-dropdown'
import { Image } from 'expo-image'
import LoadingOverlay from '../Components/Ui/LoadingOverlay'
import { Color, marginStyle } from '../Components/Ui/GlobalStyle'
import Input from '../Components/Ui/Input'
import SubmitButton from '../Components/Ui/SubmitButton'
import * as Location from 'expo-location';
import { SignUpHandyman } from '../utils/AuthRoute'
import {AuthContext} from '../utils/AuthContext'



const sex = [
  { label: 'Male', value: 'M' },
  { label: 'Female', value: 'F' },
  // { label: 'transgender', value: 'T' },
  // { label: 'non-binary', value: 'NB' },
];

const Country = [
  { label: 'Nigeria', value: 'Nigeria' },
];

const State = [
  { label: 'Lagos', value: 'Lagos' },

];

const LGA = [
  { label: 'SuruLere', value: 'SuruLere' },
  { label: 'Amuwo Odofin', value: 'Amuwo Odofin' },
];

const IDTYPE = [
  { label: 'Nimc', value: 'nin' },
  { label: 'Drivers license', value: 'DL' },
  { label: 'Identification Card', value: 'idcard' },

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



    const [IsenteredEmail, setIsEnteredEmail] = useState(false);
    const [IsenteredFirstname, setIsEnteredFirstName] = useState(false);
    const [IsenteredLastName, setIsEnteredLastName] = useState(false);
    const [IsenteredPhone, setIsEnteredPhone] = useState(false);
    const [IsenteredPassword, setIsEnteredPassword] = useState(false);
    const [IsenteredConfirmPassword, setIsEnteredConfirmPassword] = useState(false);
    const [Isidnum, setIsIdnum] = useState(false);
    const [Isaddress, setIsAddress] = useState(false)
    const [IsenteredGender, setIsEnteredGender] = useState('');
    const [IscountryName, setIsCountryName] = useState('');
    const [IsstateName, setIsStateName] = useState('');
    const [IscityName, setIsCityName] = useState('');
    const [Iscategory, setIsCategory] = useState('');
    const [Issubcategory, setIsSubcategory] = useState('');
    const [Isidtype, setIsIdtype] = useState('');






    const [isSexFocus, setSexFocus] = useState('')

    const [isCountryFocus, setIsCountryFocus] = useState(false);
    const [isStateFocus, setIsStateFocus] = useState(false);
    const [isCityFocus, setIsCityFocus] = useState(false);

    const [countryName, setCountryName] = useState('');
    const [stateName, setStateName] = useState('');
    const [cityName, setCityName] = useState('');

    const [categorydata, setCategoryData] = useState([]);
    const [subcategorydata, setSubcategoryData] = useState([]);

    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');

    const [isCategoryFocus, setIsCategoryFocus] = useState(false);
    const [isSubcategoryFocus, setIsSubcategoryFocus] = useState(false);

    const [isIdtypefocus, setIsIdtypeFocus] = useState(false);


   

    const emailIsInvalid = enteredEmail.includes('@')
  
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
    // setIsLoading(true)

    var config = {
        method: 'get',
        url: "https://phixotech.com/igoepp/public/api/category"
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

const handleState = (categorycode) => {

    var config = {
        method: 'get',
        url: `https://phixotech.com/igoepp/public/api/showsubcategorybycatid/${categorycode}`,
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
    }
  }

 

  if(isLoading){
    return <LoadingOverlay message={'...'}/>
  }

    

    
    const signupHandler = async () => {
      setIsLoading(true)
      const emailIsValid = enteredEmail.includes('@');
      const passwordIsValid = enteredPassword.length < 7;
      const passcheck =  enteredPassword === enteredConfirmPassword || enteredConfirmPassword !== null || undefined
      const phonecheck = enteredPhone === null || "" || enteredPhone.length === 0
      const addresscheck = address === null || undefined || "" || address.length === 0
      const countrycheck = countryName === null || undefined || "" || countryName.length === 0
      const statecheck = stateName === null || undefined || "" || stateName.length === 0
      const citycheck = cityName === null || undefined || "" || cityName.length === 0
      const gendercheck = enteredGender === null || undefined || "" || enteredGender.length === 0
      const categorycheck = category == null || undefined || "" || category.length === 0
      const subcategorycheck = subcategory === null || undefined || "" || subcategory.length === 0
      const idnumcheck = idnum === null || undefined || "" || idnum.length === 0
      const idtypecheck = idtype === null || undefined || "" || idtype.length === 0

       
      // console.log(categorycheck, subcategorycheck)

        if(!enteredLastName || !enteredFirstname || !emailIsValid || !enteredPhone || !enteredGender || !category || !subcategory || passwordIsValid ||
         !passcheck || !countryName || !stateName || !cityName || !address
        ){
            const InvalidFirstName = !enteredFirstname
            const InvalidLastName = !enteredLastName
            const InvalidPhone = phonecheck
            const InvalidPassword = !passwordIsValid
            const InvalidConfirmPassword = passcheck
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


            Alert.alert('Invalid details', 'Please check the information provided.')
             
        }else{
          const addresstoUse = address + " " + cityName  + " " + stateName + " " + countryName
          const geocodeLocation = await Location.geocodeAsync(addresstoUse);
          const latitude = !address ? '' : geocodeLocation[0].latitude
          const longitude = !address ? '' : geocodeLocation[0].longitude
          // console.log(addresstoUse)
          
              try {
                setIsLoading(true)
                const response = await SignUpHandyman(enteredLastName, enteredFirstname, enteredEmail, enteredPhone, category, subcategory, enteredConfirmPassword, enteredGender, countryName, stateName, cityName, address, latitude, longitude, idtype, idnum)
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
                setIsLoading(false)
              } catch (error) {
                setIsLoading(true)
                console.log(error.response)
                const myObj = error.response.data.email[0];
                // console.log(myObj.helper_rating)
                // Alert.alert('SignUp Failed', JSON.stringify(error.response.data.email))
                Alert.alert('SignUp Failed', myObj)
                setIsLoading(false)
                return;
            }
        }
      setIsLoading(false)
      
        
    }

    if(isLoading){
        return <LoadingOverlay message={"Creating User"}/>
    }
  return (
    <ScrollView style={{marginTop: marginStyle.marginTp, marginHorizontal:15}} showsVerticalScrollIndicator={false}>

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
    </View>
    <View style={styles.lastname}>
      <Input
        placeholder="Last Name"
        onUpdateValue={updateInputValueHandler.bind(this, 'lastname')}
        value={enteredLastName}
        isInvalid={IsenteredLastName}
        onFocus={() => setIsEnteredLastName(false)}
        />
      </View>
    </View>

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
          data={Country}
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
              setCountryName(item.value);
              setIsCountryFocus(false);
          }}
        />
          <View style={{ marginBottom:10 }}/>
      </View>


  
    <Dropdown
      style={[styles.dropdown, isStateFocus && { borderColor: 'blue' }, IsstateName && styles.inputInvalid]}
      placeholderStyle={[styles.placeholderStyle, {fontFamily: 'poppinsRegular'}]}
      selectedTextStyle={[styles.selectedTextStyle, {fontFamily: 'poppinsRegular'}]}
      inputSearchStyle={[styles.inputSearchStyle, {fontFamily: 'poppinsRegular'}]}
      iconStyle={styles.iconStyle}
      data={State}
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
          setStateName(item.value)
          setIsStateFocus(false);
      }}
    />

  
  <Dropdown
      style={[styles.dropdown, isCityFocus && { borderColor: 'blue' }, IscityName && styles.inputInvalid]}
      placeholderStyle={[styles.placeholderStyle, {fontFamily: 'poppinsRegular'}]}
      selectedTextStyle={[styles.selectedTextStyle, {fontFamily: 'poppinsRegular'}]}
      inputSearchStyle={[styles.inputSearchStyle, {fontFamily: 'poppinsRegular'}]}
      iconStyle={styles.iconStyle}
      data={LGA}
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
          setCityName(item.value)
          setIsCityFocus(false);
    }}
  />


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
          handleState(item.value);
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
      keyboardType={"numeric"}      
      onFocus={() => setIsIdnum(false)}
    />
    }

    <>
    <Input
      placeholder="Password"
      onUpdateValue={updateInputValueHandler.bind(this, 'password')}
      secure
      value={enteredPassword}
      isInvalid={IsenteredPassword}
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
      value={enteredConfirmPassword}
      isInvalid={IsenteredConfirmPassword}
      onFocus={() => setIsEnteredConfirmPassword(false)}

      />
      {IsenteredConfirmPassword && <Text style={{color:Color.tomato, fontSize:12}}>Password Doesn't match</Text>}
    </>

    <View style={{marginBottom:50}}>
      <View style={styles.buttons}>   
        <SubmitButton onPress={signupHandler} message={'Sign Up'}/>
      </View>
      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
        <Text style={{fontFamily:'poppinsRegular', fontSize:15,}}>Already Have An Account? </Text>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={{fontFamily:'poppinsRegular', fontSize:15, color:Color.orange_100}}>Login</Text>
      </TouchableOpacity>
      </View>
    </View>
    </View>
    </ScrollView>
  )
}

export default SignUp

const styles = StyleSheet.create({
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
      buttons: {
        marginTop: 25,
        marginBottom:20,
        marginLeft:20,
        marginRight:20
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

})